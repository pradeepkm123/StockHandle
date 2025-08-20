import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Divider,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const API_BASE = 'https://stockhandle.onrender.com/api';
const FILE_HOST = 'https://stockhandle.onrender.com';

// --- helpers to mirror Master cards ---
const getImageUrl = (img) => {
  if (!img) return '/no-image.png';
  const file = String(img)
    .replace(/\\/g, '/')
    .replace(/^\/?uploads\/?/i, '')
    .split('/')
    .pop();
  return `${FILE_HOST}/uploads/${file}`;
};

const statusForQty = (qty) => {
  if (qty <= 0) return 'Out of Stock';
  if (qty > 0 && qty <= 5) return 'Low Stock';
  return 'In Stock';
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

const StockOutward = () => {
  const { enqueueSnackbar } = useSnackbar();

  // Master reference data
  const [models, setModels] = useState([]);
  const [salePersons, setSalePersons] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Dialog / UI state
  const [openDialog, setOpenDialog] = useState(false);

  // Customer-selected details (read-only)
  const [customer, setCustomer] = useState({
    id: '',
    customerName: '',
    customerAddress: '',
    mailId: '',
    phoneNumber: '',
    storeName: '',
  });

  // Errors
  const [errors, setErrors] = useState({});

  // Global set of scanned barcodes to prevent duplicates across ALL lines
  const [globalScanned, setGlobalScanned] = useState(new Set());

  // Lines = multiple model rows
  const [lines, setLines] = useState([makeEmptyLine()]);

  const shdRefs = useRef({}); // option: focus scan input when adding a line

  // ---------- Fetch masters ----------
  useEffect(() => {
    fetchModels();
    fetchSalePersons();
    fetchCustomers();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setModels(res.data || []);
    } catch (e) {
      enqueueSnackbar('Failed to fetch models', { variant: 'error' });
    }
  };

  const fetchSalePersons = async () => {
    try {
      const res = await axios.get(`${API_BASE}/salesPersons`);
      setSalePersons(res.data || []);
    } catch (e) {
      enqueueSnackbar('Failed to fetch sales persons', { variant: 'error' });
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/customers`);
      setCustomers(res.data || []);
    } catch (e) {
      enqueueSnackbar('Failed to fetch customers', { variant: 'error' });
    }
  };

  // ---------- Dialog open/close ----------
  const openOutwardDialog = () => {
    setCustomer({
      id: '',
      customerName: '',
      customerAddress: '',
      mailId: '',
      phoneNumber: '',
      storeName: '',
    });
    setLines([makeEmptyLine()]);
    setErrors({});
    setGlobalScanned(new Set());
    setOpenDialog(true);
  };

  const closeDialog = () => setOpenDialog(false);

  // ---------- Customer change ----------
  const handleCustomerChange = (e) => {
    const id = e.target.value;
    const c = customers.find(x => x._id === id);
    setCustomer({
      id,
      customerName: c?.customerName || '',
      customerAddress: c?.address || '',
      mailId: c?.mailId || '',
      phoneNumber: c?.phoneNo || '',
      storeName: c?.storeName || '',
    });
    if (errors.customer) {
      setErrors(prev => ({ ...prev, customer: '' }));
    }
  };

  // ---------- Utility: choose next unused model on + ----------
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

  // ---------- Line helpers ----------
  const setLineValue = (index, field, value) => {
    setLines(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    if (errors[`line_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`line_${index}_${field}`]: '' }));
    }
  };

  const addLine = () => {
    setLines(prev => {
      const newIdx = prev.length;
      const nextLine = makeEmptyLine();
      const autoModel = getNextModelForNewLine(prev, models);

      if (autoModel) {
        nextLine.modelNo = autoModel;
        const p = models.find(m => m.model === autoModel);
        const stock = p?.reorderLevel ?? 0;
        nextLine.lowStockWarning = stock <= 5 ? `Low stock for ${autoModel}: ${stock}` : '';
      }

      const next = [...prev, nextLine];

      // focus the new scan field
      setTimeout(() => {
        shdRefs.current?.[newIdx]?.focus?.();
      }, 0);

      return next;
    });
  };

  const removeLine = (index) => {
    setLines(prev => {
      const line = prev[index];
      // free its scanned barcodes from global set
      if (line?.scannedList?.length) {
        const ns = new Set(globalScanned);
        line.scannedList.forEach(code => ns.delete(code));
        setGlobalScanned(ns);
      }
      const next = prev.slice(0, index).concat(prev.slice(index + 1));
      return next.length ? next : [makeEmptyLine()];
    });
  };

  // ---------- Sanitize & Matching ----------
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

  // ---------- Quantity cap helpers (NEW) ----------
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

  // ---------- Low stock indicator per line ----------
  const recomputeLowStockForLine = (index, modelName) => {
    const p = models.find(m => m.model === modelName);
    const stock = p?.reorderLevel ?? 0;
    const text = stock <= 5 ? `Low stock for ${modelName}: ${stock}` : '';
    setLineValue(index, 'lowStockWarning', text);
  };

  // ---------- When shd changes, process after tiny delay ----------
  const handleShdChange = (index, value) => {
    setLineValue(index, 'shd', value);
    if (value && value.trim().length >= 8) {
      setTimeout(() => processBarcode(index), 80);
    }
  };

  const processBarcode = (index) => {
    const line = lines[index];
    const barcodeRaw = (line.shd || '').trim();
    if (!barcodeRaw) return;

    // Basic validations
    if (!customer.id) {
      enqueueSnackbar('Please select a Customer first', { variant: 'error' });
      setErrors(prev => ({ ...prev, customer: 'Customer is required' }));
      return;
    }
    if (!line.modelNo) {
      enqueueSnackbar('Please select Model No for this line first', { variant: 'error' });
      setErrors(prev => ({ ...prev, [`line_${index}_modelNo`]: 'Model No is required' }));
      return;
    }

    // Enforce quantity cap BEFORE anything else (NEW)
    const cap = capForLine(line);
    if (cap !== Infinity && (line.scannedList?.length || 0) >= cap) {
      enqueueSnackbar(`Target reached: ${cap} scans for this row`, { variant: 'warning' });
      setLineValue(index, 'shd', '');
      return;
    }

    // Duplicate check across ALL lines
    if (globalScanned.has(barcodeRaw)) {
      enqueueSnackbar('This barcode is already scanned (any line)', { variant: 'error' });
      setLineValue(index, 'shd', '');
      return;
    }

    // Match 5/4 continuous chars from model
    const matched = findModelMatchInBarcode(line.modelNo, barcodeRaw);
    if (!matched) {
      enqueueSnackbar('Mismatch: No 5/4-char continuous segment from Model No found in barcode', { variant: 'error' });
      setErrors(prev => ({ ...prev, [`line_${index}_shd`]: 'Barcode mismatch with Model No' }));
      return;
    }

    // Accept barcode into this line
    setLines(prev => {
      const arr = [...prev];
      const L = { ...arr[index] };

      // Re-check cap with freshest row state (NEW)
      const _cap = capForLine(L);
      const currentLen = L.scannedList?.length || 0;
      if (_cap !== Infinity && currentLen >= _cap) {
        return arr; // already at cap
      }

      const nextList = Array.from(new Set([...(L.scannedList || []), barcodeRaw]));
      // If adding would exceed cap, ignore (NEW)
      if (_cap !== Infinity && nextList.length > _cap) {
        return arr;
      }

      L.scannedList = nextList;
      L.scannedCodes = nextList.join(', ');
      if (!L.isQuantityManual) {
        L.quantity = nextList.length; // auto-sync when no manual qty
      }
      L.shd = '';
      arr[index] = L;

      // Update global scanned only when we really added
      const ns = new Set(globalScanned);
      ns.add(barcodeRaw);
      setGlobalScanned(ns);

      // Success toast with remaining
      const left = remainingForLine(L);
      enqueueSnackbar(
        left === Infinity
          ? `Accepted for ${line.modelNo} (match: "${matched}")`
          : `Accepted (${line.modelNo}). Remaining: ${left}`,
        { variant: 'success' }
      );

      return arr;
    });
  };

  // ---------- Quantity rule: manual typed wins; else scans ----------
  const qtyForLine = (ln) => {
    const manual = Number(ln.quantity);
    if (!Number.isNaN(manual) && manual > 0) return manual; // manual wins (e.g., 13)
    return ln.scannedList?.length || 0;                      // fallback to scans
  };

  // ---------- Validate ----------
  const validateForm = () => {
    const e = {};
    let ok = true;

    if (!customer.id) {
      e.customer = 'Customer is required';
      ok = false;
    }

    lines.forEach((ln, i) => {
      if (!ln.modelNo) {
        e[`line_${i}_modelNo`] = 'Model No is required';
        ok = false;
      }
      if (!ln.salePerson) {
        e[`line_${i}_salePerson`] = 'Sales Person is required';
        ok = false;
      }

      const qty = qtyForLine(ln);
      if (qty <= 0) {
        e[`line_${i}_quantity`] = 'Enter a quantity > 0 or scan at least one code';
        ok = false;
      }

      const prod = models.find(m => m.model === ln.modelNo);
      const stock = prod?.reorderLevel || 0;
      if (qty > stock) {
        e[`line_${i}_quantity`] = `Quantity exceeds available stock (${stock})`;
        ok = false;
      }
    });

    setErrors(e);
    return ok;
  };

  // ---------- Submit ----------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // refresh products for freshest stock
      const res = await axios.get(`${API_BASE}/products`);
      const products = res.data || [];

      for (const ln of lines) {
        if (!ln.modelNo) continue;
        const qty = qtyForLine(ln);
        if (qty <= 0) continue;

        const product = products.find(p => p.model === ln.modelNo);
        if (!product) continue;

        // Dispatch record
        const payload = {
          modelNo: ln.modelNo,
          quantity: qty, // manual still wins
          price: Number(ln.price) || 0,
          salePerson: ln.salePerson,
          customerName: customer.customerName,
          barcodes: ln.scannedList || [],
          dispatchDate: new Date(),
          customerAddress: customer.customerAddress,
          mailId: customer.mailId,
          phoneNumber: customer.phoneNumber,
          storeName: customer.storeName,
        };

        await axios.post(`${API_BASE}/dispatch`, payload);

        // Update stock (subtract)
        const updatedReorder = Math.max(0, (product.reorderLevel || 0) - qty);
        const newStatus = statusForQty(updatedReorder);

        // minimal payload update
        await axios.put(`${API_BASE}/products/${product._id}`, {
          reorderLevel: updatedReorder,
          stockStatus: newStatus,
        });
      }

      enqueueSnackbar('Stock outward recorded and stocks updated!', { variant: 'success' });
      closeDialog();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to submit stock outward', { variant: 'error' });
    }
  };

  // ---------- UI ----------
  return (
    <Box sx={{ padding: '40px 20px' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4">Stock Outward</Typography>
        <Typography variant="body1">Scan products to remove them from inventory</Typography>
      </Box>

      <Box
        sx={{
          maxWidth: 500,
          mx: 'auto',
          bgcolor: 'white',
          borderRadius: 2,
          p: 6,
          textAlign: 'center',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#fee2e2',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.04.74 5.57 1.97" />
          </svg>
        </Box>
        <Typography variant="h6">Scan Product Barcode</Typography>
        <Typography variant="body2">Use your camera or enter barcode manually</Typography>
        <Button variant="contained" color="error" onClick={openOutwardDialog} sx={{ mt: 2 }}>
          Start Scanning
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={closeDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Stock Outward
          <Tooltip title="Add Model">
            <IconButton color="primary" onClick={addLine}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent>

          {/* Customer */}
          <FormControl fullWidth sx={{ mt: 1 }} error={!!errors.customer}>
            <InputLabel>Customer Name *</InputLabel>
            <Select name="customerId" value={customer.id} onChange={handleCustomerChange} label="Customer Name *">
              {customers.map(c => (
                <MenuItem key={c._id} value={c._id}>{c.customerName}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.customer}</FormHelperText>
          </FormControl>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} sx={{ width: '23%' }}>
              <TextField label="Address" fullWidth value={customer.customerAddress} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={6} sm={6} sx={{ width: '23%' }}>
              <TextField label="Email" fullWidth value={customer.mailId} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ width: '23%' }}>
              <TextField label="Phone" fullWidth value={customer.phoneNumber} InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ width: '26%' }}>
              <TextField label="Store Name" fullWidth value={customer.storeName} InputProps={{ readOnly: true }} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Lines */}
          <Stack spacing={2}>
            {lines.map((ln, idx) => {
              const product = models.find(m => m.model === ln.modelNo);
              const stock = product?.reorderLevel ?? 0;
              const qty = qtyForLine(ln);
              const afterStock = Math.max(0, stock - qty);

              // NEW: remaining + cap for UI
              const remaining = remainingForLine(ln);
              const cap = capForLine(ln);

              return (
                <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography fontWeight={600}>Model #{idx + 1}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {ln.lowStockWarning && <Chip label={ln.lowStockWarning} color="warning" size="small" />}
                      <Tooltip title="Remove model line">
                        <span>
                          <IconButton color="error" onClick={() => removeLine(idx)} disabled={lines.length === 1}>
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} sx={{ width: '20rem' }}>
                      <FormControl fullWidth error={!!errors[`line_${idx}_modelNo`]}>
                        <InputLabel>Model No *</InputLabel>
                        <Select
                          label="Model No *"
                          value={ln.modelNo}
                          onChange={(e) => {
                            setLineValue(idx, 'modelNo', e.target.value);
                            recomputeLowStockForLine(idx, e.target.value);
                          }}
                        >
                          {models.map((m) => (
                            <MenuItem key={m._id} value={m.model}>{m.model}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors[`line_${idx}_modelNo`]}</FormHelperText>
                      </FormControl>
                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        Current stock: {stock}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} sx={{ width: '20rem' }}>
                      <FormControl fullWidth error={!!errors[`line_${idx}_salePerson`]}>
                        <InputLabel>Sales Person *</InputLabel>
                        <Select
                          label="Sales Person *"
                          value={ln.salePerson}
                          onChange={(e) => setLineValue(idx, 'salePerson', e.target.value)}
                        >
                          {salePersons.map(p => (
                            <MenuItem key={p._id} value={p.employeeName}>{p.employeeName}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors[`line_${idx}_salePerson`]}</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} sx={{ width: '27rem' }}>
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
                        error={!!errors[`line_${idx}_quantity`]}
                        helperText={errors[`line_${idx}_quantity`] || 'Typed value caps how many barcodes you can scan for this row'}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        After outward: {afterStock} {qty > 0 ? `( -${qty} )` : ''}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        {cap === Infinity ? 'No scan limit (uses scanned count)' : `Remaining scans allowed: ${remaining}`}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} sx={{ width: '30rem' }}>
                      <TextField
                        label="Price per Unit"
                        type="number"
                        fullWidth
                        value={ln.price}
                        onChange={(e) => setLineValue(idx, 'price', e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} md={8} sx={{ width: '38rem' }}>
                      <TextField
                        label="Scan barcode (auto)"
                        fullWidth
                        value={ln.shd}
                        onChange={(e) => handleShdChange(idx, e.target.value)}
                        error={!!errors[`line_${idx}_shd`]}
                        helperText={
                          errors[`line_${idx}_shd`]
                            || (cap === Infinity
                                  ? 'Barcode must include any continuous 5 or 4 chars from Model No'
                                  : `Allowed up to ${cap} scans for this row`)
                        }
                        inputRef={(el) => (shdRefs.current[idx] = el)}
                        disabled={remaining === 0} // disable when cap reached (NEW)
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ width: '100%' }}>
                      <TextField
                        label="Scanned Codes"
                        fullWidth
                        multiline
                        rows={3}
                        value={ln.scannedCodes}
                        InputProps={{ readOnly: true }}
                        sx={{ width: '100%' }}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block', width: '100%' }}>
                        Total scanned: {ln.scannedList.length}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Stack>

          {/* ---- Live PREVIEW (same look as Master cards) ---- */}
          <Divider sx={{ my: 3 }}>Selected Products Preview</Divider>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {lines
              .filter((ln) => ln.modelNo)
              .map((ln, i) => {
                const p = models.find((x) => x.model === ln.modelNo);
                if (!p) return null;

                const current = p.reorderLevel ?? 0;
                const qty = qtyForLine(ln);
                const after = Math.max(0, current - qty);
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
                          {current} → <span style={{ fontWeight: 700 }}>{after}</span> {qty > 0 ? `(-${qty})` : ''}
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
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockOutward;
