import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Tooltip,
  Grid,
  Paper,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Chip,
} from '@mui/material';
import { Cancel as CancelIcon, Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const FILE_HOST = 'https://stockhandle.onrender.com';
const API_BASE = 'https://stockhandle.onrender.com/api';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '2.5rem', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' },
  subtitle: { fontSize: '1.1rem', color: '#6b7280', margin: 0 },
  scanCard: {
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '60px 40px',
    textAlign: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  scanIcon: { marginBottom: '24px' },
  iconCircle: {
    width: '80px',
    height: '80px',
    backgroundColor: '#e3f2fd',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 28px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
  },
  buttonIcon: { marginRight: '4px' },
};

// image url helper (same as Master)
const getImageUrl = (img) => {
  if (!img) return '/no-image.png';
  const file = String(img)
    .replace(/\\/g, '/')
    .replace(/^\/?uploads\/?/i, '')
    .split('/')
    .pop();
  return `${FILE_HOST}/uploads/${file}`;
};

const getStatusStyle = (status) => {
  if (status === 'In Stock') {
    return {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
    };
  } else if (status === 'Out of Stock') {
    return {
      backgroundColor: 'rgb(255 221 232)',
      color: 'rgb(186 13 13)',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
    };
  } else if (status === 'Low Stock') {
    return {
      backgroundColor: '#fff3cd',
      color: '#856404',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '500',
    };
  }
  return {};
};

const statusForQty = (qty) => {
  if (qty <= 0) return 'Out of Stock';
  if (qty > 0 && qty <= 5) return 'Low Stock';
  return 'In Stock';
};

function makeEmptyLine() {
  return {
    modelNo: '',
    salePerson: '',
    quantity: 0,
    price: 0,
    shd: '',
    scannedCodes: '',
    scannedList: [],
    isQuantityManual: false,
    lowStockWarning: '',
  };
}

const StockInward = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ location: '' });

  // masters
  const [productList, setProductList] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [salePersons, setSalePersons] = useState([]);

  // dynamic
  const [lines, setLines] = useState([makeEmptyLine()]);
  const [errors, setErrors] = useState({});
  const [lineErrors, setLineErrors] = useState({});
  const [globalScanned, setGlobalScanned] = useState(new Set());
  const shdRefs = useRef({});

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchProducts();
    fetchLocations();
    fetchSalePersons();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProductList(res.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      enqueueSnackbar('Error fetching products!', { variant: 'error' });
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/locations`);
      setLocationOptions(res.data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      enqueueSnackbar('Error fetching locations!', { variant: 'error' });
    }
  };

  const fetchSalePersons = async () => {
    try {
      const res = await axios.get(`${API_BASE}/salesPersons`);
      setSalePersons(res.data || []);
    } catch (error) {
      console.error('Error fetching sales persons:', error);
      enqueueSnackbar('Error fetching sales persons!', { variant: 'error' });
    }
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
    setLines([makeEmptyLine()]);
    setErrors({});
    setLineErrors({});
    setGlobalScanned(new Set());
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({ location: '' });
    setErrors({});
    setLineErrors({});
    setLines([makeEmptyLine()]);
    setGlobalScanned(new Set());
  };

  const handleTopChange = (event) => {
    const { name, value } = event.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  // sanitize + match helpers
  const sanitize = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const findModelMatchInBarcode = (model, barcode) => {
    const m = sanitize(model);
    const b = sanitize(barcode);
    if (!m || !b) return null;
    const lengths = [5, 4];
    for (const L of lengths) {
      if (m.length < L) continue;
      for (let i = 0; i <= m.length - L; i++) {
        const sub = m.slice(i, i + L);
        if (b.includes(sub)) return sub;
      }
    }
    return null;
  };

  // ---- helpers for quantity cap (NEW)
  const capForLine = (ln) => {
    const q = Number(ln.quantity);
    if (ln.isQuantityManual && Number.isFinite(q) && q > 0) return q;
    return Infinity; // no cap unless a positive manual qty is set
    };
  const remainingForLine = (ln) => {
    const cap = capForLine(ln);
    if (cap === Infinity) return Infinity;
    return Math.max(0, cap - (ln.scannedList?.length || 0));
  };

  // line helpers
  const setLineValue = (idx, field, value) => {
    setLines((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
    const key = `l${idx}_${field}`;
    if (lineErrors[key]) setLineErrors((e) => ({ ...e, [key]: '' }));
  };

  const recomputeLowStock = (idx, modelName) => {
    const p = productList.find((m) => m.model === modelName);
    const stock = p?.reorderLevel ?? 0;
    const text = stock <= 5 ? `Low stock: ${stock}` : '';
    setLineValue(idx, 'lowStockWarning', text);
  };

  const handleScanChange = (idx, val) => {
    setLineValue(idx, 'shd', val);
    if ((val || '').trim().length >= 8) {
      setTimeout(() => processBarcode(idx), 80);
    }
  };

  const processBarcode = (idx) => {
    const ln = lines[idx];
    const raw = (ln?.shd || '').trim();
    if (!raw) return;

    if (!ln.modelNo) {
      enqueueSnackbar('Select Model No for this row first', { variant: 'error' });
      setLineErrors((e) => ({ ...e, [`l${idx}_modelNo`]: 'Model No is required' }));
      return;
    }

    // Enforce cap BEFORE any other work (NEW)
    const cap = capForLine(ln);
    if (cap !== Infinity && (ln.scannedList?.length || 0) >= cap) {
      enqueueSnackbar(`Target reached: ${cap} scans for this row`, { variant: 'warning' });
      setLineValue(idx, 'shd', '');
      return;
    }

    if (globalScanned.has(raw)) {
      enqueueSnackbar('This barcode is already scanned in another row', { variant: 'error' });
      setLineValue(idx, 'shd', '');
      return;
    }

    const matched = findModelMatchInBarcode(ln.modelNo, raw);
    if (!matched) {
      enqueueSnackbar('Mismatch: No 5/4-char continuous segment from Model No found in barcode', { variant: 'error' });
      setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'Barcode mismatch with Model No' }));
      return;
    }

    // Ok to accept this code
    const nextGlobal = new Set(globalScanned);
    nextGlobal.add(raw);
    setGlobalScanned(nextGlobal);

    setLines((prev) => {
      const arr = [...prev];
      const L = { ...arr[idx] };

      // re-check cap with freshest row state (NEW)
      const _cap = capForLine(L);
      const currentLen = L.scannedList?.length || 0;
      if (_cap !== Infinity && currentLen >= _cap) {
        // cap reached in the meantime
        return arr;
      }

      const nextList = Array.from(new Set([...(L.scannedList || []), raw]));

      // If adding would exceed cap, ignore the add (NEW)
      if (_cap !== Infinity && nextList.length > _cap) {
        return arr;
      }

      L.scannedList = nextList;
      L.scannedCodes = nextList.join(', ');
      // Do NOT override manual quantity if user typed it (unchanged)
      if (!L.isQuantityManual) L.quantity = nextList.length;
      L.shd = '';

      arr[idx] = L;
      return arr;
    });

    const left = remainingForLine({ ...ln, scannedList: [...(ln.scannedList || []), raw] });
    enqueueSnackbar(
      left === Infinity ? `Accepted for ${ln.modelNo} (match: "${matched}")` :
      `Accepted (${ln.modelNo}). Remaining: ${left}`,
      { variant: 'success' }
    );
  };

  const validateForm = () => {
    const eTop = {};
    const eLine = {};
    let ok = true;

    if (!formData.location) {
      eTop.location = 'Location is required';
      ok = false;
    }

    if (lines.length === 0) {
      enqueueSnackbar('Add at least one model row', { variant: 'error' });
      ok = false;
    }

    lines.forEach((ln, i) => {
      const key = (f) => `l${i}_${f}`;
      if (!ln.modelNo) { eLine[key('modelNo')] = 'Model No is required'; ok = false; }
      // if (!ln.salePerson) { eLine[key('salePerson')] = 'Sales Person is required'; ok = false; }
      const qty = qtyForLine(ln);
      if (qty <= 0) {
        eLine[key('quantity')] = 'Enter a quantity > 0 or scan at least one code';
        ok = false;
      }
      // Optional strictness (commented): enforce scans == manual qty
      // if (ln.isQuantityManual && ln.quantity > 0 && (ln.scannedList?.length || 0) !== Number(ln.quantity)) {
      //   eLine[key('shd')] = `Please scan exactly ${ln.quantity} codes for this row`;
      //   ok = false;
      // }
    });

    setErrors(eTop);
    setLineErrors(eLine);
    return ok;
  };

  // ---- IMPORTANT: manual typed quantity always wins if > 0; else fall back to scans
  const qtyForLine = (ln) => {
    const manual = Number(ln.quantity);
    if (!Number.isNaN(manual) && manual > 0) return manual; // manual wins
    return ln.scannedList?.length || 0; // fallback to scans
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const fresh = await axios.get(`${API_BASE}/products`);
      const products = fresh.data || [];

      for (const ln of lines) {
        if (!ln.modelNo) continue;

        const product = products.find((p) => p.model === ln.modelNo);
        if (!product) continue;

        const qty = qtyForLine(ln);
        if (qty <= 0) continue;

        const updatedReorder = (product.reorderLevel || 0) + qty;
        const newStatus = statusForQty(updatedReorder);

        // update product stock + status (minimal payload)
        await axios.put(`${API_BASE}/products/${product._id}`, {
          reorderLevel: updatedReorder,
          stockStatus: newStatus,
        });

        // create inventory record
        await axios.post(`${API_BASE}/inventory`, {
          modelNo: ln.modelNo,
          location: formData.location,
          quantity: qty,
          scannedCodes: (ln.scannedList || []).join(','),
          brand: product.brand,
          dealerPrice: product.dealerPrice,
          mrp: product.mrp,
          model: product.model,
          subCategory: product.subCategory,
          category: product.category,
          currentStock: updatedReorder,
          pricePerUnit: Number(ln.price) || 0,
          salePerson: ln.salePerson,
        });
      }

      enqueueSnackbar('Stock inward recorded and stocks updated!', { variant: 'success' });
      handleDialogClose();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to submit stock inward', { variant: 'error' });
    }
  };

  // pick next unused model (based on productList order)
  const getNextModelForNewLine = (currentLines, products) => {
    if (!products.length) return '';
    const used = new Set(currentLines.map(l => l.modelNo).filter(Boolean));
    const lastModel = currentLines[currentLines.length - 1]?.modelNo || '';
    const baseIndex = products.findIndex(p => p.model === lastModel);

    for (let step = 1; step <= products.length; step++) {
      const idx = ((baseIndex >= 0 ? baseIndex : -1) + step) % products.length;
      const candidate = products[idx].model;
      if (!used.has(candidate)) return candidate;
    }
    return '';
  };

  const addLine = () => {
    setLines(prev => {
      const newIdx = prev.length;
      const nextLine = makeEmptyLine();
      const autoModel = getNextModelForNewLine(prev, productList);

      if (autoModel) {
        nextLine.modelNo = autoModel;
        const prod = productList.find(p => p.model === autoModel);
        const stock = prod?.reorderLevel ?? 0;
        nextLine.lowStockWarning = stock <= 5 ? `Low stock: ${stock}` : '';
      }

      const next = [...prev, nextLine];

      // focus scan field of new row
      setTimeout(() => {
        shdRefs.current?.[newIdx]?.focus?.();
      }, 0);

      return next;
    });
  };

  const removeLine = (idx) => {
    setLines((prev) => {
      const target = prev[idx];
      if (target?.scannedList?.length) {
        const ns = new Set(globalScanned);
        target.scannedList.forEach((c) => ns.delete(c));
        setGlobalScanned(ns);
      }
      const next = prev.slice(0, idx).concat(prev.slice(idx + 1));
      return next.length ? next : [makeEmptyLine()];
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Stock Inward</h1>
        <p style={styles.subtitle}>Scan products to add them to inventory</p>
      </div>

      <div style={styles.scanCard}>
        <div style={styles.scanIcon}>
          <div style={styles.iconCircle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.04.74 5.57 1.97" />
            </svg>
          </div>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' }}>Scan Product Barcode</h2>
        <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0 0 32px 0' }}>Use your camera or enter barcode manually</p>
        <button style={styles.startButton} onClick={handleDialogOpen}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={styles.buttonIcon}>
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.04.74 5.57 1.97" />
          </svg>
          Start Scanning
        </button>
      </div>

      <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Stock Inward
          <Tooltip title="Add Model">
            <IconButton color="primary" onClick={addLine}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent>
          {/* Top: Location */}
          <TextField
            select
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleTopChange}
            fullWidth
            error={!!errors.location}
            helperText={errors.location}
            margin="dense"
          >
            {locationOptions.map((location) => (
              <MenuItem key={location._id} value={location.locationName}>
                {location.locationName}
              </MenuItem>
            ))}
          </TextField>

          <Divider sx={{ my: 2 }} />

          {/* Dynamic rows */}
          <Stack spacing={2}>
            {lines.map((ln, idx) => {
              const product = productList.find((p) => p.model === ln.modelNo);
              const currentStock = product?.reorderLevel ?? 0;
              const incomingQty = qtyForLine(ln);
              const afterStock = currentStock + incomingQty;

              const remaining = remainingForLine(ln);
              const cap = capForLine(ln);

              return (
                <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography fontWeight={600}>Model #{idx + 1}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {ln.lowStockWarning && <Chip label={ln.lowStockWarning} color="warning" size="small" />}
                      <Tooltip title="Remove this row">
                        <span>
                          <IconButton color="error" onClick={() => removeLine(idx)} disabled={lines.length === 1}>
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} style={{ width: '34rem' }}>
                      <FormControl fullWidth error={!!lineErrors[`l${idx}_modelNo`]}>
                        <InputLabel>Model No *</InputLabel>
                        <Select
                          label="Model No *"
                          value={ln.modelNo}
                          onChange={(e) => {
                            setLineValue(idx, 'modelNo', e.target.value);
                            recomputeLowStock(idx, e.target.value);
                          }}
                        >
                          {productList.map((p) => (
                            <MenuItem key={p._id} value={p.model}>{p.model}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{lineErrors[`l${idx}_modelNo`]}</FormHelperText>
                      </FormControl>
                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        Current stock: {currentStock}
                      </Typography>
                    </Grid>

                    {/* Quantity with cap logic (UPDATED) */}
                    <Grid item xs={12} sm={6} md={6} style={{ width: '33rem' }}>
                      <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={ln.quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setLineValue(idx, 'isQuantityManual', true);
                          setLineValue(idx, 'quantity', e.target.value);

                          // Trim scanned list if user lowers the quantity cap (NEW)
                          setLines((prev) => {
                            const arr = [...prev];
                            const L = { ...arr[idx] };
                            const q = Number(val);
                            if (Number.isFinite(q) && q >= 0) {
                              const cur = L.scannedList || [];
                              if (cur.length > q) {
                                const kept = cur.slice(0, q);
                                const removed = cur.slice(q);

                                // Update global set to remove trimmed codes
                                const ns = new Set(globalScanned);
                                removed.forEach((c) => ns.delete(c));
                                setGlobalScanned(ns);

                                L.scannedList = kept;
                                L.scannedCodes = kept.join(', ');
                              }
                            }
                            arr[idx] = L;
                            return arr;
                          });
                        }}
                        error={!!lineErrors[`l${idx}_quantity`]}
                        helperText={lineErrors[`l${idx}_quantity`] || 'Typed value caps how many barcodes you can scan for this row'}
                      />
                      <div style={{display:'flex',justifyContent:'space-between'}}>
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        After inward: {afterStock} {incomingQty > 0 ? `( +${incomingQty} )` : ''}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        {cap === Infinity ? 'No scan limit (uses scanned count)' : `Remaining scans allowed: ${remaining}`}
                      </Typography>
                      </div>
                    </Grid>

                    <Grid item xs={12} md={8} style={{ width: '100%' }}>
                      <TextField
                        label="Scan barcode (auto)"
                        fullWidth
                        value={ln.shd}
                        onChange={(e) => handleScanChange(idx, e.target.value)}
                        error={!!lineErrors[`l${idx}_shd`]}
                        helperText={
                          lineErrors[`l${idx}_shd`]
                            || (cap === Infinity
                                  ? 'Barcode must include any continuous 5 or 4 chars from Model No'
                                  : `Allowed up to ${cap} scans for this row`)
                        }
                        inputRef={(el) => (shdRefs.current[idx] = el)}
                        disabled={remaining === 0} // disable when cap reached (NEW)
                      />
                    </Grid>

                    <Grid item xs={12} style={{ width: '100%' }}>
                      <TextField
                        label="Scanned Codes"
                        fullWidth
                        multiline
                        rows={3}
                        value={ln.scannedCodes}
                        InputProps={{ readOnly: true }}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        Total scanned: {ln.scannedList.length}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Stack>

          {/* Live preview matching Master card style */}
          <Divider sx={{ my: 3 }}>Selected Products Preview</Divider>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {lines
              .filter((ln) => ln.modelNo)
              .map((ln, i) => {
                const p = productList.find((x) => x.model === ln.modelNo);
                if (!p) return null;

                const current = p.reorderLevel ?? 0;
                const qty = qtyForLine(ln);
                const after = current + qty;
                const statusAfter = statusForQty(after);

                return (
                  <div
                    key={`${ln.modelNo}-${i}`}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 12,
                      padding: 24,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      border: '1px solid #f0f0f0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 17, color: '#1a1a1a', marginBottom: 4 }}>{p.brand || 'No Brand'}</h3>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <div style={{ fontSize: 13, color: '#6c757d' }}>Model:</div>
                          <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>{p.model || 'No Model'}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4 }}>Sub-Category:</div>
                          <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>{p.subCategory || '-'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        <span style={getStatusStyle(statusAfter)}>{statusAfter}</span>
                        <img
                          src={getImageUrl(p.productImage)}
                          alt="Product"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/no-image.png';
                          }}
                          style={{
                            width: 45,
                            height: 45,
                            objectFit: 'cover',
                            border: '1px solid #e9e9e9',
                            borderRadius: 4,
                            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 24 }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ fontSize: 13, color: '#1a1a1a', marginBottom: 4 }}>Category:</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{p.category || '-'}</div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', gap: 10, justifyContent: 'end' }}>
                        <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4 }}>EmailTo:</div>
                        <div style={{ fontSize: 13, color: '#1a1a1a' }}>{p.emailTo || '-'}</div>
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4 }}>Quantity:</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                          {current} → <span style={{ fontWeight: 700 }}>{after}</span> {qty > 0 ? `(+${qty})` : ''}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', gap: 10, justifyContent: 'end', alignItems: 'center' }}>
                        <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4 }}>Old Price:</div>
                        <div style={{ fontSize: 13, color: 'rgb(108 117 125)', textDecoration: 'line-through' }}>
                          ₹{Number(p.mrp || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4, marginLeft: 10 }}>Price:</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#28a745' }}>
                          ₹{Number(p.dealerPrice || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} startIcon={<CancelIcon />}>Cancel</Button>
          <Button onClick={handleSubmit} startIcon={<SaveIcon />} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StockInward;
