// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   TextField,
//   Typography,
//   MenuItem,
//   IconButton,
//   Tooltip,
//   Grid,
//   Paper,
//   Stack,
//   Divider,
//   FormControl,
//   InputLabel,
//   Select,
//   FormHelperText,
//   Chip,
// } from '@mui/material';
// import { Cancel as CancelIcon, Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
// import { useSnackbar } from 'notistack';
// import axios from 'axios';

// const FILE_HOST = 'https://stockhandle.onrender.com';
// const API_BASE = 'https://stockhandle.onrender.com/api';

// const styles = {
//   container: {
//     minHeight: '100vh',
//     backgroundColor: '#f8f9fa',
//     padding: '40px 20px',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//   },
//   header: { textAlign: 'center', marginBottom: '40px' },
//   title: { fontSize: '2.5rem', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' },
//   subtitle: { fontSize: '1.1rem', color: '#6b7280', margin: 0 },
//   scanCard: {
//     maxWidth: '500px',
//     margin: '0 auto',
//     backgroundColor: 'white',
//     borderRadius: '12px',
//     padding: '60px 40px',
//     textAlign: 'center',
//     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//     border: '1px solid #e5e7eb',
//   },
//   scanIcon: { marginBottom: '24px' },
//   iconCircle: {
//     width: '80px',
//     height: '80px',
//     backgroundColor: '#e3f2fd',
//     borderRadius: '50%',
//     display: 'inline-flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   startButton: {
//     backgroundColor: '#4285f4',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     padding: '14px 28px',
//     fontSize: '1rem',
//     fontWeight: '500',
//     cursor: 'pointer',
//     display: 'inline-flex',
//     alignItems: 'center',
//     gap: '8px',
//     transition: 'background-color 0.2s',
//   },
//   buttonIcon: { marginRight: '4px' },
// };

// // Helper: Image URL
// const getImageUrl = (img) => {
//   if (!img) return '/no-image.png';
//   const file = String(img)
//     .replace(/\\/g, '/')
//     .replace(/^\/?uploads\/?/i, '')
//     .split('/')
//     .pop();
//   return `${FILE_HOST}/uploads/${file}`;
// };

// // Helper: Status Style
// const getStatusStyle = (status) => {
//   if (status === 'In Stock') {
//     return {
//       backgroundColor: '#d4edda',
//       color: '#155724',
//       padding: '4px 12px',
//       borderRadius: '16px',
//       fontSize: '12px',
//       fontWeight: '500',
//     };
//   } else if (status === 'Out of Stock') {
//     return {
//       backgroundColor: 'rgb(255 221 232)',
//       color: 'rgb(186 13 13)',
//       padding: '4px 12px',
//       borderRadius: '16px',
//       fontSize: '12px',
//       fontWeight: '500',
//     };
//   } else if (status === 'Low Stock') {
//     return {
//       backgroundColor: '#fff3cd',
//       color: '#856404',
//       padding: '4px 12px',
//       borderRadius: '16px',
//       fontSize: '12px',
//       fontWeight: '500',
//     };
//   }
//   return {};
// };

// // Helper: Status for Quantity
// const statusForQty = (qty) => {
//   if (qty <= 0) return 'Out of Stock';
//   if (qty > 0 && qty <= 5) return 'Low Stock';
//   return 'In Stock';
// };

// // Helper: Empty Line
// function makeEmptyLine() {
//   return {
//     modelNo: '',
//     salePerson: '',
//     quantity: 0,
//     price: 0,
//     shd: '',
//     scannedCodes: '',
//     scannedList: [],
//     isQuantityManual: false,
//     lowStockWarning: '',
//   };
// }

// // Helper: Sanitize
// const sanitize = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

// // Helper: Find Model Match in Barcode
// const findModelMatchInBarcode = (model, barcode) => {
//   const m = sanitize(model);
//   const b = sanitize(barcode);
//   if (!m || !b) return null;
//   const lengths = [5, 4];
//   for (const L of lengths) {
//     if (m.length < L) continue;
//     for (let i = 0; i <= m.length - L; i++) {
//       const sub = m.slice(i, i + L);
//       if (b.includes(sub)) return sub;
//     }
//   }
//   return null;
// };

// // Helper: Cap for Line
// const capForLine = (ln) => {
//   const q = Number(ln.quantity);
//   if (ln.isQuantityManual && Number.isFinite(q) && q > 0) return q;
//   return Infinity;
// };

// // Helper: Remaining for Line
// const remainingForLine = (ln) => {
//   const cap = capForLine(ln);
//   if (cap === Infinity) return Infinity;
//   return Math.max(0, cap - (ln.scannedList?.length || 0));
// };

// // Helper: Quantity for Line
// const qtyForLine = (ln) => {
//   const manual = Number(ln.quantity);
//   if (!Number.isNaN(manual) && manual > 0) return manual;
//   return ln.scannedList?.length || 0;
// };

// const StockInward = () => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({ location: '' });
//   const [productList, setProductList] = useState([]);
//   const [locationOptions, setLocationOptions] = useState([]);
//   const [salePersons, setSalePersons] = useState([]);
//   const [lines, setLines] = useState([makeEmptyLine()]);
//   const [errors, setErrors] = useState({});
//   const [lineErrors, setLineErrors] = useState({});
//   const [globalScanned, setGlobalScanned] = useState(new Set());
//   const shdRefs = useRef({});
//   const scannerBuffers = useRef({});
//   const scannerTimers = useRef({});
//   const { enqueueSnackbar } = useSnackbar();

//   useEffect(() => {
//     fetchProducts();
//     fetchLocations();
//     fetchSalePersons();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/products`);
//       setProductList(res.data || []);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       enqueueSnackbar('Error fetching products!', { variant: 'error' });
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/locations`);
//       setLocationOptions(res.data || []);
//     } catch (error) {
//       console.error('Error fetching locations:', error);
//       enqueueSnackbar('Error fetching locations!', { variant: 'error' });
//     }
//   };

//   const fetchSalePersons = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/salesPersons`);
//       setSalePersons(res.data || []);
//     } catch (error) {
//       console.error('Error fetching sales persons:', error);
//       enqueueSnackbar('Error fetching sales persons!', { variant: 'error' });
//     }
//   };

//   const handleDialogOpen = () => {
//     setIsDialogOpen(true);
//     setLines([makeEmptyLine()]);
//     setErrors({});
//     setLineErrors({});
//     setGlobalScanned(new Set());
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     setFormData({ location: '' });
//     setErrors({});
//     setLineErrors({});
//     setLines([makeEmptyLine()]);
//     setGlobalScanned(new Set());
//   };

//   const handleTopChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//     if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
//   };

//   const setLineValue = (idx, field, value) => {
//     setLines((prev) => {
//       const next = [...prev];
//       next[idx] = { ...next[idx], [field]: value };
//       return next;
//     });
//     const key = `l${idx}_${field}`;
//     if (lineErrors[key]) setLineErrors((e) => ({ ...e, [key]: '' }));
//   };

//   const recomputeLowStock = (idx, modelName) => {
//     const p = productList.find((m) => m.model === modelName);
//     const stock = p?.reorderLevel ?? 0;
//     const text = stock <= 5 ? `Low stock: ${stock}` : '';
//     setLineValue(idx, 'lowStockWarning', text);
//   };

//   const handleScanKeyDown = (e, idx) => {
//     if (!scannerBuffers.current[idx]) scannerBuffers.current[idx] = '';
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       const code = scannerBuffers.current[idx];
//       if (code) {
//         setLineValue(idx, 'shd', code);
//         processBarcode(idx, code);
//       }
//       scannerBuffers.current[idx] = '';
//       return;
//     }
//     if (e.key.length === 1) {
//       scannerBuffers.current[idx] += e.key;
//     }
//     clearTimeout(scannerTimers.current[idx]);
//     scannerTimers.current[idx] = setTimeout(() => {
//       const code = scannerBuffers.current[idx];
//       if (code) {
//         setLineValue(idx, 'shd', code);
//         processBarcode(idx, code);
//       }
//       scannerBuffers.current[idx] = '';
//     }, 200);
//   };

//   const processBarcode = (idx, overrideRaw) => {
//     const ln = lines[idx];
//     if (!ln) return;
//     const raw = (overrideRaw || ln?.shd || '').trim();
//     if (!raw) return;
//     if (!ln.modelNo) {
//       enqueueSnackbar('Select Model No for this row first', { variant: 'error' });
//       setLineErrors((e) => ({ ...e, [`l${idx}_modelNo`]: 'Model No is required' }));
//       return;
//     }
//     const cap = capForLine(ln);
//     if (cap !== Infinity && (ln.scannedList?.length || 0) >= cap) {
//       enqueueSnackbar(`Target reached: ${cap} scans for this row`, { variant: 'warning' });
//       setLineValue(idx, 'shd', '');
//       return;
//     }
//     if (globalScanned.has(raw)) {
//       enqueueSnackbar('This barcode is already scanned in another row', { variant: 'error' });
//       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in another row' }));
//       setLineValue(idx, 'shd', '');
//       return;
//     }
//     const matched = findModelMatchInBarcode(ln.modelNo, raw);
//     if (!matched) {
//       enqueueSnackbar('Mismatch: No 5/4-char continuous segment from Model No found in barcode', { variant: 'error' });
//       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'Barcode mismatch with Model No' }));
//       return;
//     }
//     const nextGlobal = new Set(globalScanned);
//     nextGlobal.add(raw);
//     setGlobalScanned(nextGlobal);
//     setLines((prev) => {
//       const arr = [...prev];
//       const L = { ...arr[idx] };
//       const _cap = capForLine(L);
//       const currentLen = L.scannedList?.length || 0;
//       if (_cap !== Infinity && currentLen >= _cap) {
//         return arr;
//       }
//       const nextList = Array.from(new Set([...(L.scannedList || []), raw]));
//       if (_cap !== Infinity && nextList.length > _cap) {
//         return arr;
//       }
//       L.scannedList = nextList;
//       L.scannedCodes = nextList.join(', ');
//       if (!L.isQuantityManual) L.quantity = nextList.length;
//       L.shd = '';
//       arr[idx] = L;
//       return arr;
//     });
//     const left = remainingForLine({ ...ln, scannedList: [...(ln.scannedList || []), raw] });
//     enqueueSnackbar(
//       left === Infinity ? `Accepted for ${ln.modelNo} (match: "${matched}")` : `Accepted (${ln.modelNo}). Remaining: ${left}`,
//       { variant: 'success' }
//     );
//   };

//   const validateForm = () => {
//     const eTop = {};
//     const eLine = {};
//     let ok = true;

//     // Check if location is selected
//     if (!formData.location) {
//       eTop.location = 'Location is required';
//       ok = false;
//     }

//     // Check if at least one model row exists
//     if (lines.length === 0) {
//       enqueueSnackbar('Add at least one model row', { variant: 'error' });
//       ok = false;
//     }

//     // Validate each line
//     lines.forEach((ln, i) => {
//       const key = (f) => `l${i}_${f}`;

//       // Check if model is selected
//       if (!ln.modelNo) {
//         eLine[key('modelNo')] = 'Model No is required';
//         ok = false;
//       }

//       // Check if quantity is valid
//       const qty = qtyForLine(ln);
//       if (qty <= 0) {
//         eLine[key('quantity')] = 'Enter a quantity > 0 or scan at least one code';
//         ok = false;
//       }
//     });

//     setErrors(eTop);
//     setLineErrors(eLine);
//     return ok;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       enqueueSnackbar('Please fix the errors before submitting!', { variant: 'error' });
//       return;
//     }

//     try {
//       const fresh = await axios.get(`${API_BASE}/products`);
//       const products = fresh.data || [];

//       for (const ln of lines) {
//         if (!ln.modelNo) continue;
//         const product = products.find((p) => p.model === ln.modelNo);
//         if (!product) continue;

//         const qty = qtyForLine(ln);
//         if (qty <= 0) continue;

//         const updatedReorder = (product.reorderLevel || 0) + qty;
//         const newStatus = statusForQty(updatedReorder);

//         await axios.put(`${API_BASE}/products/${product._id}`, {
//           reorderLevel: updatedReorder,
//           stockStatus: newStatus,
//         });

//         await axios.post(`${API_BASE}/inventory`, {
//           modelNo: ln.modelNo,
//           location: formData.location,
//           quantity: qty,
//           scannedCodes: (ln.scannedList || []).join(','),
//           brand: product.brand,
//           dealerPrice: product.dealerPrice,
//           mrp: product.mrp,
//           model: product.model,
//           subCategory: product.subCategory,
//           category: product.category,
//           currentStock: updatedReorder,
//           pricePerUnit: Number(ln.price) || 0,
//           salePerson: ln.salePerson,
//         });
//       }

//       enqueueSnackbar('Stock inward recorded and stocks updated!', { variant: 'success' });
//       handleDialogClose();
//     } catch (err) {
//       console.error(err);
//       enqueueSnackbar('Failed to submit stock inward', { variant: 'error' });
//     }
//   };

//   const getNextModelForNewLine = (currentLines, products) => {
//     if (!products.length) return '';
//     const used = new Set(currentLines.map((l) => l.modelNo).filter(Boolean));
//     const lastModel = currentLines[currentLines.length - 1]?.modelNo || '';
//     const baseIndex = products.findIndex((p) => p.model === lastModel);
//     for (let step = 1; step <= products.length; step++) {
//       const idx = ((baseIndex >= 0 ? baseIndex : -1) + step) % products.length;
//       const candidate = products[idx].model;
//       if (!used.has(candidate)) return candidate;
//     }
//     return products[0]?.model || '';
//   };

//   const addLine = () => {
//     setLines((prev) => {
//       const newIdx = prev.length;
//       const nextLine = makeEmptyLine();
//       const autoModel = getNextModelForNewLine(prev, productList);
//       if (autoModel) {
//         nextLine.modelNo = autoModel;
//         const prod = productList.find((p) => p.model === autoModel);
//         const stock = prod?.reorderLevel ?? 0;
//         nextLine.lowStockWarning = stock <= 5 ? `Low stock: ${stock}` : '';
//       }
//       const next = [...prev, nextLine];
//       setTimeout(() => {
//         if (shdRefs.current[newIdx]) {
//           shdRefs.current[newIdx].focus();
//         }
//       }, 0);
//       return next;
//     });
//   };

//   const removeLine = (idx) => {
//     setLines((prev) => {
//       const target = prev[idx];
//       if (target?.scannedList?.length) {
//         const ns = new Set(globalScanned);
//         target.scannedList.forEach((c) => ns.delete(c));
//         setGlobalScanned(ns);
//       }
//       const next = prev.slice(0, idx).concat(prev.slice(idx + 1));
//       return next.length ? next : [makeEmptyLine()];
//     });
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.title}>Stock Inward</h1>
//         <p style={styles.subtitle}>Scan products to add them to inventory</p>
//       </div>
//       <div style={styles.scanCard}>
//         <div style={styles.scanIcon}>
//           <div style={styles.iconCircle}>
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2">
//               <path d="M9 12l2 2 4-4" />
//               <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.04.74 5.57 1.97" />
//             </svg>
//           </div>
//         </div>
//         <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' }}>Scan Product Barcode</h2>
//         <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0 0 32px 0' }}>Use your camera or enter barcode manually</p>
//         <button style={styles.startButton} onClick={handleDialogOpen}>
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={styles.buttonIcon}>
//             <path d="M9 12l2 2 4-4" />
//             <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.04.74 5.57 1.97" />
//           </svg>
//           Start Scanning
//         </button>
//       </div>


//       <Dialog
//         open={isDialogOpen}
// <<<<<<< HEAD
//         onClose={(event, reason) => {
//           if (reason === 'escapeKeyDown') {
//             handleDialogClose();
//           }
//         }}
// =======
//          onClose={(event, reason) => {
//     if (reason === 'escapeKeyDown') {
//       handleDialogClose();
//     }
//   }}
// >>>>>>> 31d76e31ea2ed9e2fc722a7f9133118915ac4b07
//         fullWidth
//         maxWidth="lg"
//       >
//         <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           Stock Inward
//           <Tooltip title="Add Model">
//             <IconButton color="primary" onClick={addLine}>
//               <AddIcon />
//             </IconButton>
//           </Tooltip>
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             select
//             label="Location *"
//             name="location"
//             value={formData.location}
//             onChange={handleTopChange}
//             fullWidth
//             error={!!errors.location}
//             helperText={errors.location}
//             margin="dense"
//           >
//             {locationOptions.map((location) => (
//               <MenuItem key={location._id} value={location.locationName}>
//                 {location.locationName}
//               </MenuItem>
//             ))}
//           </TextField>
//           <Divider sx={{ my: 2 }} />
//           <Stack spacing={2}>
//             {lines.map((ln, idx) => {
//               const product = productList.find((p) => p.model === ln.modelNo);
//               const currentStock = product?.reorderLevel ?? 0;
//               const incomingQty = qtyForLine(ln);
//               const afterStock = currentStock + incomingQty;
//               const remaining = remainingForLine(ln);
//               const cap = capForLine(ln);

//               return (
//                 <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
//                   <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
//                     <Typography fontWeight={600}>Model #{idx + 1}</Typography>
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       {ln.lowStockWarning && <Chip label={ln.lowStockWarning} color="warning" size="small" />}
//                       <Tooltip title="Remove this row">
//                         <span>
//                           <IconButton color="error" onClick={() => removeLine(idx)} disabled={lines.length === 1}>
//                             <DeleteIcon />
//                           </IconButton>
//                         </span>
//                       </Tooltip>
//                     </Stack>
//                   </Stack>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6} md={6} style={{ width: '34rem' }}>
//                       <FormControl fullWidth error={!!lineErrors[`l${idx}_modelNo`]}>
//                         <InputLabel>Model No *</InputLabel>
//                         <Select
//                           label="Model No *"
//                           value={ln.modelNo || ''}
//                           onChange={(e) => {
//                             setLineValue(idx, 'modelNo', e.target.value);
//                             recomputeLowStock(idx, e.target.value);
//                           }}
//                         >
//                           {productList.map((p) => (
//                             <MenuItem key={p._id} value={p.model}>
//                               {p.model}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                         <FormHelperText>{lineErrors[`l${idx}_modelNo`]}</FormHelperText>
//                       </FormControl>
//                       <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
//                         Current stock: {currentStock}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={6} style={{ width: '33rem' }}>
//                       <TextField
//                         label="Quantity *"
//                         type="number"
//                         fullWidth
//                         value={ln.quantity}
//                         onChange={(e) => {
//                           const val = Number(e.target.value);
//                           setLineValue(idx, 'isQuantityManual', true);
//                           setLineValue(idx, 'quantity', e.target.value);
//                           setLines((prev) => {
//                             const arr = [...prev];
//                             const L = { ...arr[idx] };
//                             const q = Number(val);
//                             if (Number.isFinite(q) && q >= 0) {
//                               const cur = L.scannedList || [];
//                               if (cur.length > q) {
//                                 const kept = cur.slice(0, q);
//                                 const removed = cur.slice(q);
//                                 const ns = new Set(globalScanned);
//                                 removed.forEach((c) => ns.delete(c));
//                                 setGlobalScanned(ns);
//                                 L.scannedList = kept;
//                                 L.scannedCodes = kept.join(', ');
//                               }
//                             }
//                             arr[idx] = L;
//                             return arr;
//                           });
//                         }}
//                         error={!!lineErrors[`l${idx}_quantity`]}
//                         helperText={lineErrors[`l${idx}_quantity`] || 'Typed value caps how many barcodes you can scan for this row'}
//                       />
//                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
//                           After inward: {afterStock} {incomingQty > 0 ? `( +${incomingQty} )` : ''}
//                         </Typography>
//                         <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
//                           {cap === Infinity ? 'No scan limit (uses scanned count)' : `Remaining scans allowed: ${remaining}`}
//                         </Typography>
//                       </div>
//                     </Grid>
//                     <Grid item xs={12} md={8} style={{ width: '100%' }}>
//                       <TextField
//                         label="Scan barcode"
//                         fullWidth
//                         value={ln.shd}
//                         onChange={(e) => setLineValue(idx, 'shd', e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             if (ln.shd.trim()) {
//                               processBarcode(idx, ln.shd.trim());
//                             }
//                           } else {
//                             handleScanKeyDown(e, idx);
//                           }
//                         }}
//                         error={!!lineErrors[`l${idx}_shd`]}
//                         helperText={
//                           lineErrors[`l${idx}_shd`] ||
//                           (cap === Infinity
//                             ? 'Barcode must include any continuous 5 or 4 chars from Model No'
//                             : `Allowed up to ${cap} scans for this row`)
//                         }
//                         inputRef={(el) => (shdRefs.current[idx] = el)}
//                         disabled={remaining === 0}
//                       />
//                     </Grid>
//                     <Grid item xs={12} style={{ width: '100%' }}>
//                       <TextField
//                         label="Scanned Codes"
//                         fullWidth
//                         multiline
//                         rows={3}
//                         value={ln.scannedCodes}
//                         InputProps={{ readOnly: true }}
//                       />
//                       <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
//                         Total scanned: {ln.scannedList.length}
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Paper>
//               );
//             })}
//           </Stack>
//           <Divider sx={{ my: 3 }}>Selected Products Preview</Divider>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
//             {lines
//               .filter((ln) => ln.modelNo)
//               .map((ln, i) => {
//                 const p = productList.find((x) => x.model === ln.modelNo);
//                 if (!p) return null;
//                 const current = p.reorderLevel ?? 0;
//                 const qty = qtyForLine(ln);
//                 const after = current + qty;
//                 const statusAfter = statusForQty(after);

//                 return (
//                   <div
//                     key={`${ln.modelNo}-${i}`}
//                     style={{
//                       backgroundColor: 'white',
//                       borderRadius: 12,
//                       padding: 24,
//                       boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//                       border: '1px solid #f0f0f0',
//                     }}
//                   >
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
//                       <div>
//                         <h3 style={{ margin: 0, fontSize: 17, color: '#1a1a1a', marginBottom: 4 }}>{p.brand || 'No Brand'}</h3>
//                         <div style={{ display: 'flex', gap: 10 }}>
//                           <div style={{ fontSize: 13, color: '#6c757d' }}>Model:</div>
//                           <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>{p.model || 'No Model'}</div>
//                         </div>
//                         <div style={{ display: 'flex', gap: 10 }}>
//                           <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4 }}>Sub-Category:</div>
//                           <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>{p.subCategory || '-'}</div>
//                         </div>
//                       </div>
//                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
//                         <span style={getStatusStyle(statusAfter)}>{statusAfter}</span>
//                         <img
//                           src={getImageUrl(p.productImage)}
//                           alt="Product"
//                           onError={(e) => {
//                             e.currentTarget.onerror = null;
//                             // e.currentTarget.src = '/no-image.png';
//                           }}
//                           style={{
//                             width: 45,
//                             height: 45,
//                             objectFit: 'cover',
//                             border: '1px solid #e9e9e9',
//                             borderRadius: 4,
//                             boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
//                           }}
//                         />
//                       </div>
//                     </div>
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 24 }}>
//                       <div style={{ display: 'flex', gap: 10 }}>
//                         <div style={{ fontSize: 13, color: '#1a1a1a', marginBottom: 4 }}>Category:</div>
//                         <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{p.category || '-'}</div>
//                       </div>
//                       <div style={{ textAlign: 'right', display: 'flex', gap: 10, justifyContent: 'end' }}>
//                         <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4 }}>EmailTo:</div>
//                         <div style={{ fontSize: 13, color: '#1a1a1a' }}>{p.emailTo || '-'}</div>
//                       </div>
//                       <div style={{ display: 'flex', gap: 10 }}>
//                         <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4 }}>Quantity:</div>
//                         <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
//                           {current} → <span style={{ fontWeight: 700 }}>{after}</span> {qty > 0 ? `(+${qty})` : ''}
//                         </div>
//                       </div>
//                       <div style={{ textAlign: 'right', display: 'flex', gap: 10, justifyContent: 'end', alignItems: 'center' }}>
//                         <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4 }}>Old Price:</div>
//                         <div style={{ fontSize: 13, color: 'rgb(108 117 125)', textDecoration: 'line-through' }}>₹{Number(p.mrp || 0).toLocaleString()}</div>
//                         <div style={{ fontSize: 13, color: '#6c757d', marginBottom: 4, marginLeft: 10 }}>Price:</div>
//                         <div style={{ fontSize: 13, fontWeight: 500, color: '#28a745' }}>₹{Number(p.dealerPrice || 0).toLocaleString()}</div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} startIcon={<CancelIcon />}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} startIcon={<SaveIcon />} color="primary">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default StockInward;


// src/Pages/StockInward.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const FILE_HOST = 'https://stockhandle-taxr.onrender.com';
const API_BASE = 'https://stockhandle-taxr.onrender.com/api';

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

// Helper: Image URL
const getImageUrl = (img) => {
  if (!img) return '/no-image.png';
  const file = String(img)
    .replace(/\\/g, '/')
    .replace(/^\/?uploads\/?/i, '')
    .split('/')
    .pop();
  return `${FILE_HOST}/uploads/${file}`;
};

// Helper: Status Style
const getStatusStyle = (status) => {
  if (status === 'In Stock') {
    return { backgroundColor: '#d4edda', color: '#155724', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' };
  } else if (status === 'Out of Stock') {
    return { backgroundColor: 'rgb(255 221 232)', color: 'rgb(186 13 13)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' };
  } else if (status === 'Low Stock') {
    return { backgroundColor: '#fff3cd', color: '#856404', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '500' };
  }
  return {};
};

// Helper: Status for Quantity
const statusForQty = (qty) => {
  if (qty <= 0) return 'Out of Stock';
  if (qty > 0 && qty <= 5) return 'Low Stock';
  return 'In Stock';
};

// Helper: Empty Line
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

// Helper: Sanitize
const sanitize = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

// Helper: split combined scanner strings
const splitBarcodes = (raw, modelNo) => {
  if (!raw) return [];
  // First split by commas, semicolons, newlines, tabs, and spaces
  const initialSegments = raw.split(/[,;\s\t\n]+/).map(s => s.trim()).filter(Boolean);
  
  const finalCodes = [];
  for (const seg of initialSegments) {
    // 1. Try universal pattern match first
    const matches = seg.match(/[A-Z]{2}-[A-Z0-9-_]+?\d{5,}/gi);
    if (matches && matches.length > 0) {
      finalCodes.push(...matches);
      continue;
    }

    // 2. Try dynamic repeating prefix detection
    let repeatPrefix = null;
    for (let len = 8; len >= 3; len--) {
      if (seg.length < len * 2) continue;
      const cand = seg.substring(0, len);
      // Ensure cand contains letters or numbers
      if (!/[A-Z0-9]/i.test(cand)) continue;
      const firstIdx = seg.indexOf(cand);
      const lastIdx = seg.lastIndexOf(cand);
      if (firstIdx === 0 && lastIdx > 0) {
        repeatPrefix = cand;
        break;
      }
    }

    if (repeatPrefix) {
      const escapedPrefix = repeatPrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?=${escapedPrefix})`, 'i');
      const subSegs = seg.split(regex).map(s => s.trim()).filter(Boolean);
      finalCodes.push(...subSegs);
    } else {
      // 3. Fallback to model-prefix lookahead or general XX-H- / XX-I- check
      let modelPrefix = '';
      if (modelNo) {
        const parts = modelNo.split('-');
        if (parts.length >= 2) {
          modelPrefix = parts.slice(0, 2).join('-');
        }
      }
      let subSegs = [seg];
      if (modelPrefix && seg.toLowerCase().indexOf(modelPrefix.toLowerCase()) !== seg.toLowerCase().lastIndexOf(modelPrefix.toLowerCase())) {
        const regex = new RegExp(`(?=${modelPrefix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'i');
        subSegs = seg.split(regex).map(s => s.trim()).filter(Boolean);
      } else if (/(?=([A-Z0-9]{2,4}-[A-Z0-9]{1,4}-))/i.test(seg)) {
        subSegs = seg.split(/(?=[A-Z0-9]{2,4}-[A-Z0-9]{1,4}-)/i).map(s => s.trim()).filter(Boolean);
      }
      finalCodes.push(...subSegs);
    }
  }
  return finalCodes.filter((code) => code.length >= 8);
};

// Helper: Cap for Line
const capForLine = (ln) => {
  const q = Number(ln.quantity);
  if (ln.isQuantityManual && Number.isFinite(q) && q > 0) return q;
  return Infinity;
};

// Helper: Remaining for Line
const remainingForLine = (ln) => {
  const cap = capForLine(ln);
  if (cap === Infinity) return Infinity;
  return Math.max(0, cap - (ln.scannedList?.length || 0));
};

// Helper: Quantity for Line
const qtyForLine = (ln) => {
  const manual = Number(ln.quantity);
  if (!Number.isNaN(manual) && manual > 0) return manual;
  return ln.scannedList?.length || 0;
};

const StockInward = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ location: '' });

  const [productList, setProductList] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [salePersons, setSalePersons] = useState([]);

  const [lines, setLines] = useState([makeEmptyLine()]);
  const [errors, setErrors] = useState({});
  const [lineErrors, setLineErrors] = useState({});

  const [globalScanned, setGlobalScanned] = useState(new Set());
  const [existingBarcodesMap, setExistingBarcodesMap] = useState({});

  const shdRefs = useRef({});
  const scannerBuffers = useRef({});
  const scannerTimers = useRef({});

  const { enqueueSnackbar } = useSnackbar();

  // ✅ useCallback to satisfy exhaustive-deps
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProductList(res.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      enqueueSnackbar('Error fetching products!', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/locations`);
      setLocationOptions(res.data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      enqueueSnackbar('Error fetching locations!', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const fetchSalePersons = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/salesPersons`);
      setSalePersons(res.data || []);
    } catch (error) {
      console.error('Error fetching sales persons:', error);
      enqueueSnackbar('Error fetching sales persons!', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchProducts();
    fetchLocations();
    fetchSalePersons();
  }, [fetchProducts, fetchLocations, fetchSalePersons]);

  const handleDialogOpen = async () => {
    setIsDialogOpen(true);
    setLines([makeEmptyLine()]);
    setErrors({});
    setLineErrors({});
    setGlobalScanned(new Set());
    setExistingBarcodesMap({});

    try {
      const [invRes, dispatchRes, storeInwardRes] = await Promise.all([
        axios.get(`${API_BASE}/inventory`),
        axios.get(`${API_BASE}/dispatch`),
        axios.get(`${API_BASE}/store-inward`)
      ]);

      const map = {};

      // 1. Process Admin Inventory
      (invRes.data || []).forEach((inv) => {
        if (inv.scannedCodes) {
          const codes = inv.scannedCodes.split(',').map((c) => c.trim()).filter(Boolean);
          codes.forEach((code) => {
            map[code] = inv.modelNo;
          });
        }
      });

      // 2. Process Admin Dispatch to stores
      (dispatchRes.data || []).forEach((disp) => {
        if (disp.barcodes) {
          const codes = Array.isArray(disp.barcodes)
            ? disp.barcodes
            : (typeof disp.barcodes === 'string' ? disp.barcodes.split(',').map(b => b.trim()).filter(Boolean) : []);
          codes.forEach((code) => {
            map[code] = disp.modelNo;
          });
        }
      });

      // 3. Process Store Inwards
      (storeInwardRes.data || []).forEach((storeInv) => {
        if (storeInv.scannedBarcode) {
          const codes = Array.isArray(storeInv.scannedBarcode)
            ? storeInv.scannedBarcode
            : (typeof storeInv.scannedBarcode === 'string' ? storeInv.scannedBarcode.split(',').map(b => b.trim()).filter(Boolean) : []);
          codes.forEach((code) => {
            map[code] = storeInv.modelNo;
          });
        }
      });

      setExistingBarcodesMap(map);
    } catch (err) {
      console.error('Error fetching existing inventory barcodes:', err);
    }
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

  const handleScanKeyDown = (e, idx) => {
    if (!scannerBuffers.current[idx]) scannerBuffers.current[idx] = '';

    if (e.key === 'Enter') {
      e.preventDefault();
      const code = scannerBuffers.current[idx];
      if (code) {
        setLineValue(idx, 'shd', code);
        processBarcode(idx, code);
      }
      scannerBuffers.current[idx] = '';
      return;
    }

    if (e.key.length === 1) {
      scannerBuffers.current[idx] += e.key;
    }

    clearTimeout(scannerTimers.current[idx]);
    scannerTimers.current[idx] = setTimeout(() => {
      const code = scannerBuffers.current[idx];
      if (code) {
        setLineValue(idx, 'shd', code);
        processBarcode(idx, code);
      }
      scannerBuffers.current[idx] = '';
    }, 200);
  };

  const processBarcode = (idx, overrideRaw) => {
    const ln = lines[idx];
    if (!ln) return;

    const rawInput = (overrideRaw || ln?.shd || '').trim();
    if (!rawInput) return;

    if (!ln.modelNo) {
      enqueueSnackbar('Select Model No for this row first', { variant: 'error' });
      setLineErrors((e) => ({ ...e, [`l${idx}_modelNo`]: 'Model No is required' }));
      return;
    }

    const barcodes = splitBarcodes(rawInput, ln.modelNo);
    if (barcodes.length === 0) return;

    setLines((prev) => {
      const arr = [...prev];
      const L = { ...arr[idx] };
      const currentList = L.scannedList || [];
      const nextList = [...currentList];
      const cap = capForLine(L);

      let addedCount = 0;
      const duplicateBarcodes = [];
      const dbExistBarcodes = [];
      let capReached = false;

      for (const code of barcodes) {
        if (cap !== Infinity && nextList.length >= cap) {
          capReached = true;
          break;
        }

        // Check if barcode already exists in database
        if (existingBarcodesMap[code]) {
          dbExistBarcodes.push({ code, modelNo: existingBarcodesMap[code] });
          continue;
        }

        // Duplicate check (both in current session and globally in this form)
        if (globalScanned.has(code) || nextList.includes(code)) {
          duplicateBarcodes.push(code);
          continue;
        }

        nextList.push(code);
        addedCount++;
        
        // Update global scanned set
        setGlobalScanned((prevSet) => {
          const ns = new Set(prevSet);
          ns.add(code);
          return ns;
        });
      }

      if (dbExistBarcodes.length > 0) {
        setTimeout(() => {
          const msg = `This Serial Number is Already Exist in ${dbExistBarcodes[0].modelNo}`;
          setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: msg }));
          dbExistBarcodes.forEach(({ code, modelNo }) => {
            enqueueSnackbar(`Already exists in ${modelNo}: ${code}`, { variant: 'error' });
          });
        }, 0);
      } else if (duplicateBarcodes.length > 0) {
        setTimeout(() => {
          setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned' }));
          duplicateBarcodes.forEach((code) => {
            enqueueSnackbar(`Already scanned: ${code}`, { variant: 'warning' });
          });
        }, 0);
      }

      if (capReached) {
        setTimeout(() => {
          enqueueSnackbar(`Target reached: ${cap} scans for this row`, { variant: 'warning' });
        }, 0);
      }

      if (addedCount > 0) {
        L.scannedList = nextList;
        L.scannedCodes = nextList.join(', ');
        if (!L.isQuantityManual) L.quantity = nextList.length;
        L.shd = '';
        arr[idx] = L;

        const left = remainingForLine(L);
        setTimeout(() => {
          enqueueSnackbar(
            left === Infinity ? `Accepted ${addedCount} barcode(s) for ${L.modelNo}` : `Accepted ${addedCount} barcode(s) (${L.modelNo}). Remaining: ${left}`,
            { variant: 'success' }
          );
        }, 0);
        return arr;
      } else {
        L.shd = '';
        arr[idx] = L;
        return arr;
      }
    });
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

      if (!ln.modelNo) {
        eLine[key('modelNo')] = 'Model No is required';
        ok = false;
      }

      const qty = qtyForLine(ln);
      if (qty <= 0) {
        eLine[key('quantity')] = 'Enter a quantity > 0 or scan at least one code';
        ok = false;
      }
    });

    setErrors(eTop);
    setLineErrors(eLine);
    return ok;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      enqueueSnackbar('Please fix the errors before submitting!', { variant: 'error' });
      return;
    }

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

        await axios.put(`${API_BASE}/products/${product._id}`, {
          reorderLevel: updatedReorder,
          stockStatus: newStatus,
        });

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
          salePerson: ln.salePerson, // ✅ now UI is provided
        });
      }

      enqueueSnackbar('Stock inward recorded and stocks updated!', { variant: 'success' });
      handleDialogClose();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to submit stock inward', { variant: 'error' });
    }
  };

  const getNextModelForNewLine = (currentLines, products) => {
    if (!products.length) return '';
    const used = new Set(currentLines.map((l) => l.modelNo).filter(Boolean));
    const lastModel = currentLines[currentLines.length - 1]?.modelNo || '';
    const baseIndex = products.findIndex((p) => p.model === lastModel);

    for (let step = 1; step <= products.length; step++) {
      const idx = ((baseIndex >= 0 ? baseIndex : -1) + step) % products.length;
      const candidate = products[idx].model;
      if (!used.has(candidate)) return candidate;
    }
    return products[0]?.model || '';
  };

  const addLine = () => {
    setLines((prev) => {
      const newIdx = prev.length;
      const nextLine = makeEmptyLine();

      const autoModel = getNextModelForNewLine(prev, productList);
      if (autoModel) {
        nextLine.modelNo = autoModel;
        const prod = productList.find((p) => p.model === autoModel);
        const stock = prod?.reorderLevel ?? 0;
        nextLine.lowStockWarning = stock <= 5 ? `Low stock: ${stock}` : '';
      }

      const next = [...prev, nextLine];

      setTimeout(() => {
        if (shdRefs.current[newIdx]) {
          shdRefs.current[newIdx].focus();
        }
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

        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a', margin: '0 0 12px 0' }}>
          Scan Product Barcode
        </h2>
        <p style={{ fontSize: '1rem', color: '#6b7280', margin: '0 0 32px 0' }}>
          Use your scanner or enter barcode manually
        </p>

        <button style={styles.startButton} onClick={handleDialogOpen}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={styles.buttonIcon}>
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.04.74 5.57 1.97" />
          </svg>
          Start Scanning
        </button>
      </div>

      <Dialog
        open={isDialogOpen}
        onClose={(event, reason) => {
          if (reason === 'escapeKeyDown' || reason === 'backdropClick') {
            handleDialogClose();
          }
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Stock Inward
          <Tooltip title="Add Model">
            <IconButton color="primary" onClick={addLine}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent>
          <TextField
            select
            label="Location *"
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
                    {/* Model */}
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth error={!!lineErrors[`l${idx}_modelNo`]}>
                        <InputLabel>Model No *</InputLabel>
                        <Select
                          label="Model No *"
                          value={ln.modelNo || ''}
                          onChange={(e) => {
                            setLineValue(idx, 'modelNo', e.target.value);
                            recomputeLowStock(idx, e.target.value);
                          }}
                        >
                          {productList.map((p) => (
                            <MenuItem key={p._id} value={p.model}>
                              {p.model}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{lineErrors[`l${idx}_modelNo`]}</FormHelperText>
                      </FormControl>
                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        Current stock: {currentStock}
                      </Typography>
                    </Grid>

                    {/* Sales Person ✅ uses salePersons state */}
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Sales Person</InputLabel>
                        <Select
                          label="Sales Person"
                          value={ln.salePerson || ''}
                          onChange={(e) => setLineValue(idx, 'salePerson', e.target.value)}
                        >
                          <MenuItem value="">None</MenuItem>
                          {salePersons.map((sp) => (
                            <MenuItem key={sp._id} value={sp.employeeName}>
                              {sp.employeeName} ({sp.location})
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>Select who brought/handled this inward</FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Quantity */}
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Quantity *"
                        type="number"
                        fullWidth
                        value={ln.quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setLineValue(idx, 'isQuantityManual', true);
                          setLineValue(idx, 'quantity', e.target.value);

                          setLines((prev) => {
                            const arr = [...prev];
                            const L = { ...arr[idx] };
                            const q = Number(val);

                            if (Number.isFinite(q) && q >= 0) {
                              const cur = L.scannedList || [];
                              if (cur.length > q) {
                                const kept = cur.slice(0, q);
                                const removed = cur.slice(q);

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
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          After inward: {afterStock} {incomingQty > 0 ? `( +${incomingQty} )` : ''}
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          {cap === Infinity ? 'No scan limit' : `Remaining scans: ${remaining}`}
                        </Typography>
                      </div>
                    </Grid>

                    {/* Scan */}
                    <Grid item xs={12}>
                      <TextField
                        label="Scan barcode"
                        fullWidth
                        value={ln.shd}
                        onChange={(e) => setLineValue(idx, 'shd', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (ln.shd.trim()) processBarcode(idx, ln.shd.trim());
                          } else {
                            handleScanKeyDown(e, idx);
                          }
                        }}
                        error={!!lineErrors[`l${idx}_shd`]}
                        helperText={
                          lineErrors[`l${idx}_shd`] ||
                          (cap === Infinity
                            ? 'Scan any barcode'
                            : `Allowed up to ${cap} scans for this row`)
                        }
                        inputRef={(el) => (shdRefs.current[idx] = el)}
                        disabled={remaining === 0}
                      />
                    </Grid>

                    {/* Scanned Codes */}
                    <Grid item xs={12}>
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
          <Button onClick={handleDialogClose} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} startIcon={<SaveIcon />} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StockInward;
