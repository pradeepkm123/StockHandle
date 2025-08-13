import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Package, TrendingUp, Triangle, Minus, Search, RotateCcw } from 'lucide-react';
import PhoneIcon from '@mui/icons-material/Phone';
import './InventoryDashboard.css';
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const API = 'http://localhost:5000/api';

const InventoryDashboard = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [dispatch, setDispatch] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isOutwardOpen, setIsOutwardOpen] = useState(false);
  const [outwardItem, setOutwardItem] = useState(null);
  const [outQty, setOutQty] = useState('');
  const [outReason, setOutReason] = useState('');
  const [outRef, setOutRef] = useState('');
  const [formErr, setFormErr] = useState('');

  // ---------- helpers ----------
  const inr = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;
  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const preferNum = (...vals) => {
    for (const v of vals) {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) return n;
    }
    return 0;
  };
  const norm = (s) =>
    (s ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

  const tokens = (s) =>
    norm(s)
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(' ')
      .filter(Boolean);

  const overlapScore = (a, b) => {
    const A = new Set(tokens(a));
    const B = new Set(tokens(b));
    if (A.size === 0 || B.size === 0) return 0;
    let inter = 0;
    for (const t of A) if (B.has(t)) inter++;
    return inter / Math.max(A.size, B.size);
  };

  const qtyOf = (it) => {
    const candidates = ['quantity', 'qty', 'stock', 'availableQty', 'available', 'reorderQty'];
    for (const k of candidates) {
      const n = num(it?.[k]);
      if (n) return n;
    }
    return 0;
  };

  // Build a quick lookup map for product pricing by model
  const productsByModel = useMemo(() => {
    const map = {};
    for (const p of products) {
      const key = (p.modelNo || p.model || '').toString().trim();
      if (!key) continue;
      map[key] = p;
    }
    return map;
  }, [products]);

  // Resolve per-unit price for any row
  const unitPriceOf = (it) => {
    const perUnit = preferNum(
      it?._unitPrice,
      it?.unitPrice,
      it?.price,
      it?.rate,
      it?.mrp,
      it?.dealerPrice
    );
    if (perUnit) return perUnit;

    const q = qtyOf(it);
    const total = preferNum(
      it?.value,
      it?.amount,
      it?.totalValue,
      it?.lineTotal,
      it?.priceTotal,
      it?.total
    );
    if (q > 0 && total) return total / q;

    const modelKey = (it?.modelNo || it?.model || '').toString().trim();
    const prod = productsByModel[modelKey];
    return preferNum(prod?.mrp, prod?.dealerPrice, 0);
  };

  const rowValue = (it) => {
    const total = preferNum(
      it?.value,
      it?.amount,
      it?.totalValue,
      it?.lineTotal,
      it?.priceTotal,
      it?.total,
      it?._rowTotal
    );
    if (total) return total;
    return unitPriceOf(it) * qtyOf(it);
  };

  // ---------- data fetch ----------
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const [customersRes, productsRes, inventoryRes] = await Promise.all([
          fetch(`${API}/customers`),
          fetch(`${API}/products`),
          fetch(`${API}/inventory`),
        ]);

        if (!customersRes.ok || !productsRes.ok || !inventoryRes.ok) {
          throw new Error('Failed to load initial data');
        }

        setCustomers(await customersRes.json());
        setProducts(await productsRes.json());
        setInventory(await inventoryRes.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  // ---------- robust store matching & aggregation ----------
  const belongsToStore = (inv, store) => {
    // 1) direct id matches
    const sId = store?._id ? String(store._id) : null;
    const invIds = [
      inv.storeId,
      inv.customerId,
      inv.store?._id,
      inv.customer?._id,
    ]
      .filter(Boolean)
      .map((x) => String(x));
    if (sId && invIds.includes(sId)) return true;

    // 2) exact normalized name/location matches
    const invNames = [inv.storeName, inv.location, inv.customerName, inv.store?.name]
      .filter(Boolean)
      .map(norm);
    const storeNames = [store.storeName, store.address, store.customerName]
      .filter(Boolean)
      .map(norm);

    for (const a of invNames) {
      if (!a) continue;
      for (const b of storeNames) {
        if (a && b && a === b) return true;
      }
    }

    // 3) fuzzy (token overlap) fallback
    for (const a of invNames) {
      for (const b of storeNames) {
        if (overlapScore(a, b) >= 0.75) return true;
      }
    }

    // 4) contains (e.g., "Store A - Chennai" contains "Store A")
    for (const a of invNames) {
      for (const b of storeNames) {
        if (!a || !b) continue;
        if (a.includes(b) || b.includes(a)) return true;
      }
    }

    return false;
  };

  const aggregateForStore = (invRows, store) => {
    const seen = new Set();
    let totalPrice = 0;
    let productLines = 0;
    let lowStockAlerts = 0;

    for (const inv of invRows) {
      if (!belongsToStore(inv, store)) continue;

      const qty = qtyOf(inv);
      const price = preferNum(inv.mrp, inv.dealerPrice);
      totalPrice += price * qty;

      const modelKey = inv.modelNo || inv.model || inv._id || '';
      if (!seen.has(modelKey)) {
        seen.add(modelKey);
        productLines += 1;
      }
      if (qty > 0 && qty <= 5) lowStockAlerts += 1;
    }
    return { totalPrice, productLines, lowStockAlerts };
  };

  // ---------- store click / detail ----------
  const handleStoreClick = async (store) => {
    setSelectedStore(store);
    setSearchTerm('');
    setCurrentPage(1);
    setLoading(true);
    setError(null);

    try {
      const dispatchRes = await fetch(`${API}/dispatch?storeName=${encodeURIComponent(store.storeName)}`);
      if (!dispatchRes.ok) throw new Error(`Failed to fetch store dispatch data: ${dispatchRes.statusText}`);
      const dispatchData = await dispatchRes.json();
      const onceSorted = [...dispatchData].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      const normalized = onceSorted.map((d) => {
        const q = qtyOf(d);
        const u = unitPriceOf(d);
        const v = q ? u * q : preferNum(d?.value, d?.amount, d?.totalValue);
        return { ...d, _unitPrice: u, _rowTotal: v };
      });
      setDispatch(normalized);

      const recentTxRes = await fetch(`${API}/transactions?storeName=${encodeURIComponent(store.storeName)}`);
      if (!recentTxRes.ok) throw new Error(`Failed to fetch recent transactions: ${recentTxRes.statusText}`);
      const recentTxData = await recentTxRes.json();
      setRecentTx(recentTxData);
    } catch (e) {
      console.error('Error fetching data:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedStore(null);
    setDispatch([]);
    setRecentTx([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // ---------- top cards (overall) ----------
  const totalProductValue = useMemo(
    () =>
      inventory.reduce(
        (sum, it) => sum + preferNum(it?.mrp, it?.dealerPrice) * qtyOf(it),
        0
      ),
    [inventory]
  );

  const totalStockUnits = useMemo(() => inventory.reduce((sum, it) => sum + qtyOf(it), 0), [inventory]);
  const totalLowStock = useMemo(() => inventory.filter((it) => {
    const q = qtyOf(it);
    return q > 0 && q <= 5;
  }).length, [inventory]);

  const cardData = [
    { title: 'Active Stores', value: customers.filter((c) => Boolean(c.status)).length, icon: <StoreIcon style={{ color: '#005899' }} />, bg: 'kpi-bg-blue' },
    { title: 'Total Products', value: inr(totalProductValue), icon: <Inventory2Icon style={{ color: '#005b00' }} />, bg: 'kpi-bg-green' },
    { title: 'Total Stock', value: totalStockUnits, icon: <WarehouseIcon style={{ color: '#005700' }} />, bg: 'kpi-bg-green' },
    { title: 'Low Stock Alerts', value: totalLowStock, icon: <WarningAmberIcon style={{ color: '#9d0017' }} />, bg: 'kpi-bg-red', danger: true },
  ];

  const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const prev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const next = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    return (
      <div className="inv-pagination">
        <button onClick={prev} disabled={currentPage === 1} className="inv-btn inv-btn-outline">
          Previous
        </button>
        <span className="inv-pagination__info">Page {currentPage} of {totalPages || 1}</span>
        <button onClick={next} disabled={currentPage === totalPages || totalPages === 0} className="inv-btn inv-btn-outline">
          Next
        </button>
      </div>
    );
  };

  const OutwardModal = ({ open, onClose, item, store }) => {
    if (!open || !item) return null;

    const onSubmit = async () => {
      setFormErr('');
      const q = num(outQty);
      if (!q) return setFormErr('Quantity is required.');
      if (q < 1) return setFormErr('Quantity must be at least 1.');
      const currentStock = qtyOf(item);
      if (q > currentStock) return setFormErr(`Only ${currentStock} units available.`);

      try {
        const transactionResponse = await fetch(`${API}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeName: store.storeName,
            customerName: store.customerName,
            modelNo: item.modelNo,
            quantity: q,
            unitPrice: unitPriceOf(item),
            value: unitPriceOf(item) * q,
            reason: outReason,
            reference: outRef,
            type: 'outward',
          }),
        });

        if (!transactionResponse.ok) {
          throw new Error('Failed to save transaction');
        }

        const dispatchResponse = await fetch(`${API}/dispatch/${item._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: currentStock - q,
          }),
        });

        if (!dispatchResponse.ok) {
          throw new Error('Failed to update dispatch data');
        }

        setDispatch((prev) => {
          const idKey = item._id ?? item.id ?? null;
          return prev.map((d) => {
            const isMatch = idKey ? (d._id === idKey || d.id === idKey) : (d.modelNo === item.modelNo);
            if (!isMatch) return d;
            const newQty = Math.max(0, qtyOf(d) - q);
            const next = { ...d, quantity: newQty, _unitPrice: unitPriceOf(d) };
            if (typeof d.stock !== 'undefined') next.stock = Math.max(0, num(d.stock) - q);
            next._rowTotal = unitPriceOf(next) * qtyOf(next);
            return next;
          });
        });

        const tx = {
          customerName: store.customerName,
          storeName: store.storeName,
          location: store.location,
          modelNo: item.modelNo,
          quantity: q,
          reason: outReason,
          reference: outRef,
          type: 'outward',
          productName: item.productName || item.model || item.modelNo,
          createdAt: new Date().toISOString(),
        };

        setRecentTx((prev) => [tx, ...prev].slice(0, 50));
        setOutQty('');
        setOutReason('');
        setOutRef('');
        onClose();
      } catch (error) {
        setError(error.message);
      }
    };

    return (
      <div className="inv-modal__backdrop" onClick={onClose}>
        <div className="inv-modal__card" onClick={(e) => e.stopPropagation()}>
          <div className="inv-modal__header">
            <div className="inv-modal__title">
              <span className="inv-modal__icon">
                <Triangle size={18} />
              </span>
              Stock Outward
            </div>
            <button onClick={onClose} className="inv-btn inv-btn-link inv-modal__close">
              ×
            </button>
          </div>
          <div className="inv-modal__product">
            <div className="inv-modal__product-icon">
              <Package size={22} />
            </div>
            <div>
              <div className="inv-modal__product-name">{item.productName || item.model || item.modelNo}</div>
              <div className="inv-text-muted">SKU: {item.modelNo}</div>
              <div className="inv-text-muted">Current Stock: {qtyOf(item)} units</div>
              <div className="inv-text-muted">Unit Price: {inr(unitPriceOf(item))}</div>
            </div>
          </div>
          <label className="inv-form__label">Quantity</label>
          <input
            className="inv-input"
            type="number"
            min={1}
            value={outQty}
            onChange={(e) => setOutQty(e.target.value)}
            placeholder="Enter quantity"
          />
          {formErr && <div className="inv-form__error">{formErr}</div>}
          <label className="inv-form__label">Reason (Optional)</label>
          <input
            className="inv-input"
            value={outReason}
            onChange={(e) => setOutReason(e.target.value)}
            placeholder="e.g., Damaged items, Transfer, etc."
          />
          <label className="inv-form__label">Reference (Optional)</label>
          <input
            className="inv-input"
            value={outRef}
            onChange={(e) => setOutRef(e.target.value)}
            placeholder="e.g., PO-12345, Invoice #"
          />
          <div className="inv-modal__actions">
            <button onClick={onSubmit} className="inv-btn inv-btn-danger">
              Remove Stock
            </button>
            <button onClick={onClose} className="inv-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ---------- cards & views ----------
  const StoreCard = ({ store, inventoryRows }) => {
    const agg = useMemo(
      () => aggregateForStore(inventoryRows, store),
      [inventoryRows, store]
    );

    const initials = (store.customerName || store.storeName || '?')
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div className="store-card" onClick={() => handleStoreClick(store)}>
        <div className="store-card__header">
          <div>
            <h3 className="store-card__name">{store.storeName}</h3>
            <p className="store-card__location">{store.address}</p>
          </div>
          <span className={`status-badge ${store.status ? 'status-badge--active' : 'status-badge--inactive'}`}>
            • {store.status ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="store-card__manager">
          <div className="store-card__avatar">
            {store.profilePicture ? (
              <img src={`${API.replace('/api', '')}/${store.profilePicture}`} alt="Profile" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <p className="store-card__manager-name">{store.customerName}</p>
            <p className="store-card__manager-title">{store.storeHandle}</p>
          </div>
        </div>

        {/* ✅ store-wise metrics (filtered by belongsToStore) */}
        {/* <div className="store-card__metrics">
          <div className="metric">
            <div className="metric__label">
              <span className="metric__dot metric__dot--blue" />
              <span>Total Price</span>
            </div>
            <span className="metric__value">{inr(agg.totalPrice)}</span>
          </div>
          <div className="metric">
            <div className="metric__label">
              <span className="metric__dot metric__dot--purple" />
              <span>Product Lines</span>
            </div>
            <span className="metric__value">{agg.productLines}</span>
          </div>
          <div className="metric">
            <div className="metric__label">
              <span className="metric__dot metric__dot--red" />
              <span>Low Stock Alerts</span>
            </div>
            <span className="metric__value metric__value--danger">{agg.lowStockAlerts}</span>
          </div>
        </div> */}

        <div className="store-card__phone">
          <p>
            <PhoneIcon style={{ fontSize: 14, verticalAlign: 'text-bottom' }} /> {store.phoneNo}
          </p>
        </div>
      </div>
    );
  };

  const StoreDetail = ({ store }) => {
    const filtered = dispatch.filter((d) =>
      (d.modelNo || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalItems = filtered.reduce((sum, r) => sum + qtyOf(r), 0);
    const totalPrice = filtered.reduce((sum, r) => sum + rowValue(r), 0);
    const productLines = filtered.length;
    const lowStockAlerts = filtered.filter((r) => {
      const q = qtyOf(r);
      return q > 0 && q <= 5;
    }).length;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div className="detail">
        <div className="detail__header">
          <div className="detail__header-inner">
            <div className="detail__header-left">
              <button onClick={handleBackToDashboard} className="inv-btn inv-btn-link back-btn">
                <ArrowLeft size={18} />
                <span>Back to Dashboard</span>
              </button>
              <div className="detail__store">
                <div className="avatar avatar--lg">
                  {(store.customerName || store.storeName || '?')
                    .split(' ')
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <h1 className="detail__title">{store.storeName}</h1>
                  <div className="detail__subtitle">
                    <span>{store.address}</span>
                    <span className="dot">•</span>
                    <span>{store.customerName}</span>
                    <span className={`status-badge ${store.status ? 'status-badge--active' : 'status-badge--inactive'}`}>
                      • {store.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="summary-grid">
            <div className="summary-card summary-card--blue">
              <div className="summary-card__content">
                <div>
                  <p className="summary-card__label summary-card__label--blue">Total Items</p>
                  <p className="summary-card__value summary-card__value--blue">{totalItems}</p>
                  <p className="summary-card__desc summary-card__desc--blue">Units in table</p>
                </div>
                <Package size={32} style={{ color: '#1e40af' }} />
              </div>
            </div>
            <div className="summary-card summary-card--green">
              <div className="summary-card__content">
                <div>
                  <p className="summary-card__label summary-card__label--green">Total Price</p>
                  <p className="summary-card__value summary-card__value--green">{inr(totalPrice)}</p>
                  <p className="summary-card__desc summary-card__desc--green">Sum of Value column</p>
                </div>
                <TrendingUp size={32} style={{ color: '#15803d' }} />
              </div>
            </div>
            <div className="summary-card summary-card--purple">
              <div className="summary-card__content">
                <div>
                  <p className="summary-card__label summary-card__label--purple">Product Lines</p>
                  <p className="summary-card__value summary-card__value--purple">{productLines}</p>
                  <p className="summary-card__desc summary-card__desc--purple">Rows in table</p>
                </div>
                <Package size={32} style={{ color: '#7c3aed' }} />
              </div>
            </div>
            <div className="summary-card summary-card--red">
              <div className="summary-card__content">
                <div>
                  <p className="summary-card__label summary-card__label--red">Low Stock Alerts</p>
                  <p className="summary-card__value summary-card__value--red">{lowStockAlerts}</p>
                </div>
                <Triangle size={32} style={{ color: '#b91c1c' }} />
              </div>
            </div>
          </div>

          <div className="content-grid">
            <div className="inventory">
              <div className="inventory__header">
                <h2 className="inventory__title">Dispatch Data</h2>
                <div className="search">
                  <Search size={16} className="search__icon" />
                  <input
                    className="search__input"
                    type="text"
                    placeholder="Search by Model No..."
                    value={searchTerm}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setSearchTerm(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead className="table__head">
                    <tr>
                      <th>Model No</th>
                      <th>Quantity</th>
                      <th>Value</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = dispatch.filter((d) =>
                        (d.modelNo || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
                      );
                      const totalPages = Math.ceil(filtered.length / itemsPerPage);
                      const indexOfLastItem = currentPage * itemsPerPage;
                      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                      const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

                      return (
                        <>
                          {currentItems.map((item, idx) => {
                            const qty = qtyOf(item);
                            const price = rowValue(item);
                            return (
                              <tr key={String(item._id ?? item.id ?? item.modelNo ?? idx)} className="table__row">
                                <td>
                                  <div className="product">
                                    <div className="product__name">{item.modelNo}</div>
                                    <div className="product__meta">{item.category || ''}</div>
                                  </div>
                                </td>
                                <td>
                                  <div className="qty">
                                    <span className={`qty__value ${qty <= 5 ? 'qty__value--low' : ''}`}>{qty}</span>
                                    {qty <= 5 && <Triangle size={14} className="qty__warn" />}
                                  </div>
                                </td>
                                <td>{inr(price)}</td>
                                <td>
                                  <div className="actions">
                                    <button
                                      className="inv-icon-btn inv-icon-btn--danger"
                                      onClick={() => {
                                        setOutwardItem(item);
                                        setIsOutwardOpen(true);
                                      }}
                                      title="Remove stock"
                                    >
                                      <Minus size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          {filtered.length === 0 && !loading && (
                            <tr>
                              <td colSpan={4} className="empty">No dispatch data to show.</td>
                            </tr>
                          )}
                          {loading && (
                            <tr>
                              <td colSpan={4} className="empty">Loading…</td>
                            </tr>
                          )}
                          {error && !loading && (
                            <tr>
                              <td colSpan={4} className="empty error">Error: {error}</td>
                            </tr>
                          )}

                          <tr>
                            <td colSpan={4}>
                              <Pagination currentPage={currentPage} totalPages={Math.ceil(filtered.length / itemsPerPage)} setCurrentPage={setCurrentPage} />
                            </td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="sidebar">
              <div className="sidebar__header">
                <h3 className="sidebar__title">Recent Transactions</h3>
                <RotateCcw size={18} className="muted" />
              </div>
              <ul className="tx-list">
                {recentTx.slice(0, 20).map((tx, i) => (
                  <li key={i} className="tx">
                    <div className="tx__icon">
                      <Triangle size={14} style={{color:'#ae0000'}} />
                    </div>
                    <div className="tx__body">
                      <div className="tx__name">{tx.productName || tx.modelNo}</div>
                      <div className="tx__meta">
                        {(tx.type || 'outward')} • {num(tx.quantity)} units
                      </div>
                    </div>
                    <div className="tx__date">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ''}</div>
                  </li>
                ))}
                {recentTx.length === 0 && !loading && <li className="empty">No recent transactions.</li>}
              </ul>
            </aside>
          </div>
        </div>

        <OutwardModal open={isOutwardOpen} onClose={() => setIsOutwardOpen(false)} item={outwardItem} store={store} />
      </div>
    );
  };

  if (selectedStore) return <StoreDetail store={selectedStore} />;

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1 className="header__title">Store Dashboard</h1>
          <p className="header__subtitle">Manage your inventory across all locations</p>
        </header>
        <div className="kpis">
          {cardData.map((c, i) => (
            <div key={i} className={`kpi ${c.bg}`}>
              <div className="kpi__content">
                <p className="kpi__title">{c.title}</p>
                <h2 className={`kpi__value ${c.danger ? 'kpi__value--danger' : ''}`}>{c.value}</h2>
              </div>
              <div className="kpi__icon">{c.icon}</div>
            </div>
          ))}
        </div>
        <div className="stores-grid">
          {customers.map((store) => (
            <StoreCard key={String(store._id ?? store.id)} store={store} inventoryRows={inventory} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
