// // import React, { useState, useEffect, useRef } from 'react';
// // import { useUser } from './UserContext';
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   IconButton,
// //   TextField,
// //   Typography,
// //   MenuItem,
// //   Grid,
// //   Paper,
// //   Stack,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   FormHelperText,
// // } from '@mui/material';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import AddIcon from '@mui/icons-material/Add';

// // const makeEmptyLine = () => ({
// //   modelNo: '',
// //   salePerson: '',
// //   quantity: 0,
// //   price: 0,
// //   shd: '',
// //   scannedCodes: '',
// //   scannedList: [],
// //   isQuantityManual: false,
// //   lowStockWarning: '',
// // });

// // const sanitize = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

// // const findModelMatchInBarcode = (model, barcode) => {
// //   const m = sanitize(model);
// //   const b = sanitize(barcode);
// //   if (!m || !b) return null;
// //   const lengths = [5, 4];
// //   for (const L of lengths) {
// //     if (m.length < L) continue;
// //     for (let i = 0; i <= m.length - L; i++) {
// //       const sub = m.slice(i, i + L);
// //       if (b.includes(sub)) return sub;
// //     }
// //   }
// //   return null;
// // };

// // const capForLine = (ln) => {
// //   const q = Number(ln.quantity);
// //   if (ln.isQuantityManual && Number.isFinite(q) && q > 0) return q;
// //   return Infinity;
// // };

// // const remainingForLine = (ln) => {
// //   const cap = capForLine(ln);
// //   if (cap === Infinity) return Infinity;
// //   return Math.max(0, cap - (ln.scannedList?.length || 0));
// // };

// // const qtyForLine = (ln) => {
// //   const manual = Number(ln.quantity);
// //   if (!Number.isNaN(manual) && manual > 0) return manual;
// //   return ln.scannedList?.length || 0;
// // };

// // const AlertDialog = ({ open, onClose, title, message, actions }) => {
// //   return (
// //     <Dialog open={open} onClose={onClose}>
// //       <DialogTitle>{title}</DialogTitle>
// //       <DialogContent>
// //         <Typography>{message}</Typography>
// //       </DialogContent>
// //       <DialogActions>
// //         {actions || (
// //           <Button onClick={onClose} color="primary" autoFocus>
// //             OK
// //           </Button>
// //         )}
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // function History() {
// //   const { user } = useUser();
// //   const [stockMovements, setStockMovements] = useState([]);
// //   const [filteredMovements, setFilteredMovements] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [deleteLoading, setDeleteLoading] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage] = useState(5);
// //   const [showOutwardDialog, setShowOutwardDialog] = useState(false);
// //   const [outwardError, setOutwardError] = useState('');
// //   const [lines, setLines] = useState([makeEmptyLine()]);
// //   const [lineErrors, setLineErrors] = useState({});
// //   const [globalScanned, setGlobalScanned] = useState(new Set());
// //   const [customerNames, setCustomerNames] = useState([]);
// //   const [loadingCustomers, setLoadingCustomers] = useState(false);
// //   const [availableModels, setAvailableModels] = useState([]);
// //   const [loadingModels, setLoadingModels] = useState(false);
// //   const [outwardFormData, setOutwardFormData] = useState({
// //     customerName: '',
// //     selectedCustomer: null,
// //     modelNo: '',
// //     quantity: 0,
// //     shd: '',
// //     scannedCodes: '',
// //     scannedList: [],
// //     price: 0,
// //     salePerson: '',
// //   });
// //   const [alertOpen, setAlertOpen] = useState(false);
// //   const [alertTitle, setAlertTitle] = useState('');
// //   const [alertMessage, setAlertMessage] = useState('');
// //   const [alertActions, setAlertActions] = useState(null);

// //   const shdRefs = useRef({});
// //   const scannerBuffers = useRef({});
// //   const scannerTimers = useRef({});

// //   const showAlert = (title, message, actions = null) => {
// //     setAlertTitle(title);
// //     setAlertMessage(message);
// //     setAlertActions(actions);
// //     setAlertOpen(true);
// //   };

// //   const showConfirm = (title, message, onConfirm) => {
// //     showAlert(
// //       title,
// //       message,
// //       <>
// //         <Button onClick={() => setAlertOpen(false)} color="primary">
// //           Cancel
// //         </Button>
// //         <Button
// //           onClick={() => {
// //             setAlertOpen(false);
// //             onConfirm();
// //           }}
// //           color="primary"
// //           autoFocus
// //         >
// //           OK
// //         </Button>
// //       </>
// //     );
// //   };

// //   useEffect(() => {
// //     fetchStockMovements();
// //   }, [user]);

// //   const fetchStockMovements = async () => {
// //     try {
// //       setLoading(true);
// //       const inwardResponse = await fetch('https://stockhandle.onrender.com/api/store-inward');
// //       if (!inwardResponse.ok) {
// //         throw new Error(`HTTP error! status: ${inwardResponse.status}`);
// //       }
// //       const inwardData = await inwardResponse.json();
// //       const inwardMovements = Array.isArray(inwardData) ? inwardData : (inwardData.movements || inwardData.data || []);
// //       const allMovements = inwardMovements.map(m => ({ ...m, type: 'inward' }));
// //       setStockMovements(allMovements);
// //       if (user?.role && user?.role !== 'admin') {
// //         const filtered = allMovements.filter(movement => movement.storeName?.toLowerCase() === user.role?.toLowerCase());
// //         setFilteredMovements(filtered);
// //       } else {
// //         setFilteredMovements(allMovements);
// //       }
// //     } catch (err) {
// //       setError(err.message);
// //       console.error('Error fetching stock movements:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchAvailableModels = async () => {
// //     if (!user?.role) return;
// //     setLoadingModels(true);
// //     try {
// //       let modelsData = [];
// //       if (stockMovements.length > 0) {
// //         modelsData = stockMovements;
// //       } else {
// //         const response = await fetch(`https://stockhandle.onrender.com/api/stock-inward`);
// //         if (!response.ok) throw new Error('Failed to fetch models');
// //         const data = await response.json();
// //         modelsData = Array.isArray(data) ? data : (data.movements || data.data || []);
// //       }
// //       let filteredMovements = modelsData;
// //       if (user?.role && user?.role !== 'admin') {
// //         filteredMovements = modelsData.filter(movement => movement.storeName?.toLowerCase() === user.role?.toLowerCase());
// //       }
// //       const modelMap = new Map();
// //       filteredMovements.forEach(movement => {
// //         const modelNo = movement.product || movement.modelNo;
// //         if (modelNo) {
// //           if (!modelMap.has(modelNo)) {
// //             modelMap.set(modelNo, {
// //               modelNo: modelNo,
// //               price: movement.pricePerUnit || movement.price || 0,
// //               quantity: movement.quantity || 0,
// //               storeName: movement.storeName || '',
// //               inwardId: movement._id
// //             });
// //           }
// //         }
// //       });
// //       const uniqueModels = Array.from(modelMap.values());
// //       setAvailableModels(uniqueModels);
// //     } catch (error) {
// //       console.error('Error fetching models:', error);
// //       setAvailableModels([]);
// //     } finally {
// //       setLoadingModels(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (showOutwardDialog) {
// //       fetchAvailableModels();
// //     }
// //   }, [showOutwardDialog, user?.role, stockMovements]);

// //   const handleDelete = async (movement) => {
// //     showConfirm(
// //       'Confirm Delete',
// //       `Are you sure you want to delete this stock inward record?\n\nModel: ${movement.modelNo || movement.product}\nQuantity: ${movement.quantity}\nStore: ${movement.storeName}`,
// //       async () => {
// //         try {
// //           setDeleteLoading(movement._id);
// //           const response = await fetch(`https://stockhandle.onrender.com/api/stock-inward/${movement._id}`, {
// //             method: 'DELETE',
// //             headers: {
// //               'Content-Type': 'application/json',
// //             },
// //           });
// //           if (!response.ok) {
// //             throw new Error(`HTTP error! status: ${response.status}`);
// //           }
// //           const result = await response.json();
// //           if (result.success) {
// //             setFilteredMovements(prev => prev.filter(item => item._id !== movement._id));
// //             setStockMovements(prev => prev.filter(item => item._id !== movement._id));
// //             showAlert('Success', 'Stock inward record deleted successfully!');
// //           } else {
// //             throw new Error(result.error || 'Failed to delete record');
// //           }
// //         } catch (err) {
// //           console.error('Error deleting stock movement:', err);
// //           showAlert('Error', `Error deleting record: ${err.message}`);
// //         } finally {
// //           setDeleteLoading(null);
// //         }
// //       }
// //     );
// //   };

// //   const updateStockInwardAfterOutward = async (modelNo, outwardQuantity, scannedBarcodes) => {
// //     try {
// //       const storeFilter = user?.role && user?.role !== 'admin' ? user.role.toLowerCase() : null;
// //       const inwardRecords = stockMovements.filter(movement => {
// //         const movementModelNo = movement.product || movement.modelNo;
// //         const storeMatch = storeFilter ? movement.storeName?.toLowerCase() === storeFilter : true;
// //         return movementModelNo === modelNo && storeMatch;
// //       });
// //       if (inwardRecords.length === 0) {
// //         console.warn(`No inward records found for model: ${modelNo}`);
// //         return;
// //       }
// //       let remainingQuantity = outwardQuantity;
// //       const barcodesToRemove = new Set(scannedBarcodes || []);
// //       const sortedInwardRecords = inwardRecords.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
// //       for (const record of sortedInwardRecords) {
// //         if (remainingQuantity <= 0 && barcodesToRemove.size === 0) break;
// //         const currentQuantity = record.quantity || 0;
// //         let currentBarcodes = [];
// //         if (record.scannedBarcode) {
// //           if (Array.isArray(record.scannedBarcode)) {
// //             currentBarcodes = [...record.scannedBarcode];
// //           } else if (typeof record.scannedBarcode === 'string') {
// //             currentBarcodes = record.scannedBarcode.split(',').map(b => b.trim()).filter(b => b);
// //           }
// //         }
// //         let updatedQuantity = currentQuantity;
// //         let updatedBarcodes = [...currentBarcodes];
// //         if (barcodesToRemove.size > 0) {
// //           const originalLength = updatedBarcodes.length;
// //           updatedBarcodes = updatedBarcodes.filter(barcode => !barcodesToRemove.has(barcode));
// //           const removedCount = originalLength - updatedBarcodes.length;
// //           if (removedCount > 0) {
// //             updatedQuantity = Math.max(0, updatedQuantity - removedCount);
// //             remainingQuantity = Math.max(0, remainingQuantity - removedCount);
// //           }
// //         }
// //         if (remainingQuantity > 0 && updatedQuantity > 0) {
// //           const quantityToReduce = Math.min(remainingQuantity, updatedQuantity);
// //           updatedQuantity = updatedQuantity - quantityToReduce;
// //           remainingQuantity = remainingQuantity - quantityToReduce;
// //         }
// //         const updateData = {
// //           quantity: updatedQuantity,
// //           scannedBarcode: updatedBarcodes.length > 0 ? updatedBarcodes : []
// //         };
// //         const updateResponse = await fetch(`https://stockhandle.onrender.com/api/stock-inward/${record._id}`, {
// //           method: 'PUT',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify(updateData),
// //         });
// //         if (!updateResponse.ok) {
// //           const errorText = await updateResponse.text();
// //           throw new Error(`Failed to update inward record: ${record._id} - ${errorText}`);
// //         }
// //       }
// //       await fetchStockMovements();
// //     } catch (error) {
// //       console.error('Error updating stock inward after outward:', error);
// //       throw error;
// //     }
// //   };

// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
// //   const paginate = (pageNumber) => setCurrentPage(pageNumber);

// //   const getBadgeStyle = (type) => ({
// //     padding: '4px 8px',
// //     borderRadius: '5px',
// //     fontSize: '12px',
// //     textTransform: 'uppercase',
// //     fontWeight: '500',
// //     textAlign: 'center',
// //     minWidth: '80px',
// //     display: 'inline-block',
// //     backgroundColor: '#dcfce7',
// //     color: '#166534'
// //   });

// //   const handleOutwardDialogOpen = () => {
// //     setShowOutwardDialog(true);
// //     setLines([makeEmptyLine()]);
// //     setLineErrors({});
// //     setGlobalScanned(new Set());
// //     setOutwardFormData({
// //       customerName: '',
// //       selectedCustomer: null,
// //       modelNo: '',
// //       quantity: 0,
// //       shd: '',
// //       scannedCodes: '',
// //       scannedList: [],
// //       price: 0,
// //       salePerson: '',
// //     });
// //   };

// //   const handleOutwardDialogClose = () => {
// //     setShowOutwardDialog(false);
// //     setOutwardError('');
// //   };

// //   const handleModelSelect = (idx, selectedModelNo) => {
// //     const selectedModel = availableModels.find(model => model.modelNo === selectedModelNo);
// //     if (selectedModel) {
// //       setLines(prev => {
// //         const next = [...prev];
// //         next[idx] = {
// //           ...next[idx],
// //           modelNo: selectedModel.modelNo,
// //           price: selectedModel.price,
// //           quantity: selectedModel.quantity,
// //           isQuantityManual: true
// //         };
// //         return next;
// //       });
// //     } else {
// //       setLines(prev => {
// //         const next = [...prev];
// //         next[idx] = {
// //           ...next[idx],
// //           modelNo: selectedModelNo,
// //           isQuantityManual: true
// //         };
// //         return next;
// //       });
// //     }
// //   };

// //   const setLineValue = (idx, field, value) => {
// //     setLines((prev) => {
// //       const next = [...prev];
// //       next[idx] = { ...next[idx], [field]: value };
// //       return next;
// //     });
// //     const key = `l${idx}_${field}`;
// //     if (lineErrors[key]) setLineErrors((e) => ({ ...e, [key]: '' }));
// //   };

// //   const handleScanKeyDown = (e, idx) => {
// //     if (!scannerBuffers.current[idx]) scannerBuffers.current[idx] = '';
// //     if (e.key === 'Enter') {
// //       e.preventDefault();
// //       const code = scannerBuffers.current[idx];
// //       if (code) {
// //         setLineValue(idx, 'shd', code);
// //         processBarcode(idx, code);
// //       }
// //       scannerBuffers.current[idx] = '';
// //       return;
// //     }
// //     if (e.key.length === 1) {
// //       scannerBuffers.current[idx] += e.key;
// //     }
// //     clearTimeout(scannerTimers.current[idx]);
// //     scannerTimers.current[idx] = setTimeout(() => {
// //       const code = scannerBuffers.current[idx];
// //       if (code) {
// //         setLineValue(idx, 'shd', code);
// //         processBarcode(idx, code);
// //       }
// //       scannerBuffers.current[idx] = '';
// //     }, 200);
// //   };

// //   const processBarcode = (idx, overrideRaw) => {
// //     const ln = lines[idx];
// //     if (!ln) return;
// //     const raw = (overrideRaw || ln?.shd || '').trim();
// //     if (!raw) return;
// //     if (!ln.modelNo) {
// //       showAlert('Error', 'Please select a Model No first');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_modelNo`]: 'Model No is required' }));
// //       return;
// //     }
// //     if (ln.scannedList?.includes(raw)) {
// //       showAlert('Error', 'This barcode is already scanned in this row');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in this row' }));
// //       setLineValue(idx, 'shd', '');
// //       return;
// //     }
// //     if (globalScanned.has(raw)) {
// //       showAlert('Error', 'This barcode is already scanned in another row');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in another row' }));
// //       setLineValue(idx, 'shd', '');
// //       return;
// //     }
// //     const cap = capForLine(ln);
// //     if (cap !== Infinity && (ln.scannedList?.length || 0) >= cap) {
// //       showAlert('Info', `Target reached: ${cap} scans for this row`);
// //       setLineValue(idx, 'shd', '');
// //       return;
// //     }
// //     const matched = findModelMatchInBarcode(ln.modelNo, raw);
// //     if (!matched) {
// //       showAlert('Error', 'Mismatch: No 5/4-char continuous segment from Model No found in barcode');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'Barcode mismatch with Model No' }));
// //       return;
// //     }
// //     const nextGlobal = new Set(globalScanned);
// //     nextGlobal.add(raw);
// //     setGlobalScanned(nextGlobal);
// //     setLines((prev) => {
// //       const arr = [...prev];
// //       const L = { ...arr[idx] };
// //       const _cap = capForLine(L);
// //       const currentLen = L.scannedList?.length || 0;
// //       if (_cap !== Infinity && currentLen >= _cap) {
// //         return arr;
// //       }
// //       const nextList = [...(L.scannedList || []), raw];
// //       if (_cap !== Infinity && nextList.length > _cap) {
// //         return arr;
// //       }
// //       L.scannedList = nextList;
// //       L.scannedCodes = nextList.join(', ');
// //       if (!L.isQuantityManual) L.quantity = nextList.length;
// //       L.shd = '';
// //       arr[idx] = L;
// //       return arr;
// //     });
// //     const left = remainingForLine({ ...ln, scannedList: [...(ln.scannedList || []), raw] });
// //     showAlert(
// //       'Success',
// //       left === Infinity
// //         ? `Accepted for ${ln.modelNo} (match: "${matched}")`
// //         : `Accepted (${ln.modelNo}). Remaining: ${left}`
// //     );
// //   };

// //   const validateForm = () => {
// //     const eLine = {};
// //     let ok = true;
// //     if (lines.length === 0) {
// //       showAlert('Error', 'Add at least one model row');
// //       ok = false;
// //     }
// //     lines.forEach((ln, i) => {
// //       const key = (f) => `l${i}_${f}`;
// //       if (!ln.modelNo) {
// //         eLine[key('modelNo')] = 'Model No is required';
// //         ok = false;
// //       }
// //       const qty = qtyForLine(ln);
// //       if (qty <= 0) {
// //         eLine[key('quantity')] = 'Enter a quantity > 0 or scan at least one code';
// //         ok = false;
// //       }
// //     });
// //     setLineErrors(eLine);
// //     return ok;
// //   };

// //   const handleOutwardSubmit = async () => {
// //     if (!validateForm()) {
// //       showAlert('Error', 'Please fix the errors before submitting!');
// //       return;
// //     }
// //     if (!outwardFormData.customerName || !outwardFormData.selectedCustomer) {
// //       showAlert('Error', 'Please select a customer!');
// //       return;
// //     }
// //     try {
// //       setLoading(true);
// //       const results = [];
// //       const inwardUpdates = [];
// //       for (const ln of lines) {
// //         if (!ln.modelNo || qtyForLine(ln) <= 0) continue;
// //         const outwardQuantity = qtyForLine(ln);
// //         const scannedBarcodes = ln.scannedList || [];
// //         const outwardData = {
// //           modelNo: ln.modelNo,
// //           quantity: outwardQuantity,
// //           reason: "Stock Outward",
// //           userId: user?.id || "unknown-user",
// //           storeName: user?.role || "JAIPUR",
// //           customerName: outwardFormData.customerName,
// //           customerMobile: outwardFormData.selectedCustomer?.phoneNo || "",
// //           customerAddress: outwardFormData.selectedCustomer?.address || "",
// //           scannedCodes: ln.scannedCodes || "",
// //           scannedList: ln.scannedList || [],
// //           price: ln.price || 0,
// //           salePerson: ln.salePerson || "",
// //         };
// //         const response = await fetch('https://stockhandle.onrender.com/api/stock-outward', {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify(outwardData),
// //         });
// //         const result = await response.json();
// //         results.push(result);
// //         if (result.success) {
// //           inwardUpdates.push({
// //             modelNo: ln.modelNo,
// //             quantity: outwardQuantity,
// //             scannedBarcodes: scannedBarcodes
// //           });
// //         }
// //       }
// //       const allSuccess = results.every(result => result.success);
// //       if (allSuccess) {
// //         try {
// //           for (const update of inwardUpdates) {
// //             await updateStockInwardAfterOutward(update.modelNo, update.quantity, update.scannedBarcodes);
// //           }
// //           showAlert('Success', 'Stock outward successful! Stock inward records updated.');
// //           handleOutwardDialogClose();
// //           await fetchStockMovements();
// //         } catch (updateError) {
// //           console.error('Error updating inward records:', updateError);
// //           showAlert('Warning', 'Stock outward saved but there was an error updating inward records. Please check stock levels manually.');
// //           handleOutwardDialogClose();
// //           await fetchStockMovements();
// //         }
// //       } else {
// //         const errors = results.filter(result => !result.success).map(r => r.error);
// //         setOutwardError(`Some items failed: ${errors.join(', ')}`);
// //         showAlert('Error', `Some items failed to save: ${errors.join(', ')}`);
// //       }
// //     } catch (err) {
// //       console.error('Error submitting stock outward:', err);
// //       setOutwardError(err.message);
// //       showAlert('Error', `Error submitting stock outward: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const addLine = () => {
// //     setLines((prev) => {
// //       const next = [...prev, makeEmptyLine()];
// //       return next;
// //     });
// //   };

// //   const removeLine = (idx) => {
// //     setLines((prev) => {
// //       const target = prev[idx];
// //       if (target?.scannedList?.length) {
// //         const ns = new Set(globalScanned);
// //         target.scannedList.forEach((c) => ns.delete(c));
// //         setGlobalScanned(ns);
// //       }
// //       const next = prev.slice(0, idx).concat(prev.slice(idx + 1));
// //       return next.length ? next : [makeEmptyLine()];
// //     });
// //   };

// //   useEffect(() => {
// //     const fetchCustomerNames = async () => {
// //       if (!user?.role) return;
// //       setLoadingCustomers(true);
// //       try {
// //         const response = await fetch(`https://stockhandle.onrender.com/api/storecustomers?storeName=${user.role}`);
// //         const data = await response.json();
// //         setCustomerNames(data.data || []);
// //       } catch (error) {
// //         console.error('Error fetching customer data:', error);
// //       } finally {
// //         setLoadingCustomers(false);
// //       }
// //     };
// //     fetchCustomerNames();
// //   }, [user?.role]);

// //   const styles = {
// //     container: {
// //       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
// //       backgroundColor: '#f8fafc',
// //       minHeight: '100vh',
// //       padding: '24px',
// //     },
// //     header: {
// //       display: 'flex',
// //       alignItems: 'center',
// //       gap: '12px',
// //       marginBottom: '8px',
// //     },
// //     headerIcon: {
// //       width: '32px',
// //       height: '32px',
// //       color: '#3b82f6',
// //     },
// //     title: {
// //       fontSize: '28px',
// //       fontWeight: '700',
// //       color: '#1f2937',
// //       margin: 0,
// //       padding: '20px'
// //     },
// //     subtitle: {
// //       fontSize: '16px',
// //       color: '#6b7280',
// //       margin: '0 0 32px 44px',
// //     },
// //     tableContainer: {
// //       backgroundColor: 'white',
// //       borderRadius: '12px',
// //       boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
// //       border: '1px solid #e5e7eb',
// //       overflow: 'hidden',
// //     },
// //     table: {
// //       width: '100%',
// //       borderCollapse: 'collapse',
// //       textAlign: 'center',
// //     },
// //     tableHeader: {
// //       borderBottom: '1px solid #e5e7eb',
// //       backgroundColor: '#f9fafb',
// //     },
// //     th: {
// //       padding: '16px 24px',
// //       fontSize: '12px',
// //       fontWeight: '500',
// //       color: '#6b7280',
// //       textTransform: 'uppercase',
// //       letterSpacing: '0.05em',
// //     },
// //     thLast: {
// //       position: 'relative',
// //     },
// //     sortIcon: {
// //       position: 'absolute',
// //       right: '24px',
// //       top: '50%',
// //       transform: 'translateY(-50%)',
// //       width: '12px',
// //       height: '20px',
// //       color: '#9ca3af',
// //     },
// //     emptyState: {
// //       textAlign: 'center',
// //       padding: '80px 24px',
// //     },
// //     emptyIcon: {
// //       width: '64px',
// //       height: '64px',
// //       color: '#d1d5db',
// //       margin: '0 auto 24px',
// //     },
// //     emptyText: {
// //       fontSize: '16px',
// //       color: '#6b7280',
// //       margin: 0,
// //     },
// //     td: {
// //       padding: '16px 24px',
// //       borderBottom: '1px solid #f3f4f6',
// //       fontSize: '14px',
// //       color: '#374151',
// //     },
// //     deleteButton: {
// //       background: 'none',
// //       border: 'none',
// //       cursor: 'pointer',
// //       padding: '8px',
// //       borderRadius: '4px',
// //       transition: 'background-color 0.2s',
// //     },
// //     deleteButtonHover: {
// //       backgroundColor: '#fef2f2',
// //     },
// //     deleteIcon: {
// //       width: '18px',
// //       height: '18px',
// //       color: '#dc2626',
// //     },
// //     loadingIcon: {
// //       width: '18px',
// //       height: '18px',
// //       color: '#6b7280',
// //       animation: 'spin 1s linear infinite',
// //     },
// //   };

// //   if (loading) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>
// //           Loading stock inward movements...
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#dc2626' }}>
// //           Error: {error}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={styles.container}>
// //       <AlertDialog
// //         open={alertOpen}
// //         onClose={() => setAlertOpen(false)}
// //         title={alertTitle}
// //         message={alertMessage}
// //         actions={alertActions}
// //       />
// //       <div style={styles.header}>
// //         <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //         </svg>
// //         <h1 style={styles.title}>Stock Inward Details</h1>
// //       </div>
// //       <p style={styles.subtitle}>
// //         {user?.role === 'admin'
// //           ? 'Showing all stock inward details'
// //           : `Showing stock inward details for ${user?.role}`}
// //       </p>
// //       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end' }}>
// //         <button
// //           onClick={handleOutwardDialogOpen}
// //           style={{
// //             padding: '8px 16px',
// //             backgroundColor: '#ef4444',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: 'pointer',
// //             display: 'flex',
// //             alignItems: 'center',
// //             gap: '8px',
// //           }}
// //         >
// //           <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
// //           </svg>
// //           Stock Outward
// //         </button>
// //       </div>
// //       <div style={styles.tableContainer}>
// //         <h1 style={styles.title}>Stock Inward table</h1>
// //         {filteredMovements.length > 0 ? (
// //           <>
// //             <table style={styles.table}>
// //               <thead style={styles.tableHeader}>
// //                 <tr>
// //                   <th style={styles.th}>USER ID</th>
// //                   <th style={styles.th}>MODEL NO</th>
// //                   <th style={styles.th}>QUANTITY</th>
// //                   <th style={styles.th}>STORE NAME</th>
// //                   <th style={styles.th}>BARCODE</th>
// //                   <th style={styles.th}>PER UNIT PRICE</th>
// //                   <th style={styles.th}>DATE</th>
// //                   <th style={styles.th}>ACTIVITY</th>
// //                   <th style={styles.th}>ACTION</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {currentItems.map((movement, index) => (
// //                   <tr key={movement._id || index}>
// //                     <td style={styles.td}>{movement.userId || 'N/A'}</td>
// //                     <td style={styles.td}>{movement.product || movement.modelNo || 'N/A'}</td>
// //                     <td style={styles.td}>{movement.quantity || 'N/A'}</td>
// //                     <td style={styles.td}>{movement.storeName || 'N/A'}</td>
// //                     <td style={styles.td}>
// //                       {Array.isArray(movement.scannedBarcode)
// //                         ? movement.scannedBarcode.join(', ')
// //                         : movement.scannedBarcode || 'N/A'
// //                       }
// //                     </td>
// //                     <td style={styles.td}>{movement.pricePerUnit || 'N/A'}</td>
// //                     <td style={styles.td}>
// //                       {movement.createdAt ? new Date(movement.createdAt).toLocaleString() : 'N/A'}
// //                     </td>
// //                     <td style={styles.td}>
// //                       <span style={getBadgeStyle(movement.type)}>
// //                         STORE INWARD
// //                       </span>
// //                     </td>
// //                     <td style={styles.td}>
// //                       <button
// //                         onClick={() => handleDelete(movement)}
// //                         disabled={deleteLoading === movement._id}
// //                         style={{
// //                           ...styles.deleteButton,
// //                           ...(deleteLoading === movement._id ? {} : styles.deleteButtonHover)
// //                         }}
// //                         title="Delete this record"
// //                       >
// //                         {deleteLoading === movement._id ? (
// //                           <svg style={styles.loadingIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2m15.364-7.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-12.728l2.828 2.828m9.168 9.168l2.828 2.828" />
// //                           </svg>
// //                         ) : (
// //                           <svg style={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// //                           </svg>
// //                         )}
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
// //               <div style={{ fontSize: '14px', color: '#6b7280' }}>
// //                 Showing {filteredMovements.length} record{filteredMovements.length !== 1 ? 's' : ''}
// //               </div>
// //               <div style={{ display: 'flex', gap: '8px' }}>
// //                 {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((number) => (
// //                   <button
// //                     key={number}
// //                     onClick={() => paginate(number)}
// //                     style={{
// //                       padding: '8px 12px',
// //                       border: '1px solid #e5e7eb',
// //                       backgroundColor: currentPage === number ? '#3b82f6' : 'white',
// //                       color: currentPage === number ? 'white' : '#374151',
// //                       borderRadius: '4px',
// //                       cursor: 'pointer',
// //                     }}
// //                   >
// //                     {number}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           </>
// //         ) : (
// //           <div style={styles.emptyState}>
// //             <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //             </svg>
// //             <p style={styles.emptyText}>
// //               {user?.role === 'admin'
// //                 ? 'No stock inward details recorded'
// //                 : `No stock inward details recorded for ${user?.role}`}
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //       <Dialog open={showOutwardDialog} onClose={handleOutwardDialogClose} fullWidth maxWidth="md">
// //         <DialogTitle>Stock Outward</DialogTitle>
// //         <DialogContent>
// //           <Stack spacing={2} sx={{ mt: 2 }}>
// //             <FormControl fullWidth>
// //               <InputLabel>Customer Name *</InputLabel>
// //               <Select
// //                 value={outwardFormData.customerName}
// //                 onChange={(e) => {
// //                   const selectedCustomer = customerNames.find(c => c.customerName === e.target.value);
// //                   setOutwardFormData({
// //                     ...outwardFormData,
// //                     customerName: e.target.value,
// //                     selectedCustomer: selectedCustomer || null,
// //                   });
// //                 }}
// //                 label="Customer Name *"
// //                 disabled={loadingCustomers}
// //               >
// //                 {loadingCustomers ? (
// //                   <MenuItem disabled>Loading customers...</MenuItem>
// //                 ) : customerNames.length > 0 ? (
// //                   customerNames.map((customer, index) => (
// //                     <MenuItem key={index} value={customer.customerName}>
// //                       {customer.customerName} ({customer.phoneNo})
// //                     </MenuItem>
// //                   ))
// //                 ) : (
// //                   <MenuItem disabled>No customers found</MenuItem>
// //                 )}
// //               </Select>
// //             </FormControl>
// //             {outwardFormData.selectedCustomer && (
// //               <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
// //                 <Typography variant="subtitle1" fontWeight="bold">
// //                   Customer Details
// //                 </Typography>
// //                 <Typography variant="body2">
// //                   <strong>Mobile:</strong> {outwardFormData.selectedCustomer.phoneNo}
// //                 </Typography>
// //                 <Typography variant="body2">
// //                   <strong>Address:</strong> {outwardFormData.selectedCustomer.address}
// //                 </Typography>
// //               </Paper>
// //             )}
// //             {lines.map((ln, idx) => (
// //               <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
// //                 <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
// //                   <Typography fontWeight={600}>Model #{idx + 1}</Typography>
// //                   <IconButton color="error" onClick={() => removeLine(idx)} disabled={lines.length === 1}>
// //                     <DeleteIcon />
// //                   </IconButton>
// //                 </Stack>
// //                 <Grid container spacing={2}>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <FormControl fullWidth error={!!lineErrors[`l${idx}_modelNo`]}>
// //                       <InputLabel>Model No *</InputLabel>
// //                       <Select
// //                         value={ln.modelNo || ''}
// //                         onChange={(e) => handleModelSelect(idx, e.target.value)}
// //                         label="Model No *"
// //                         disabled={loadingModels}
// //                       >
// //                         {loadingModels ? (
// //                           <MenuItem disabled>Loading models...</MenuItem>
// //                         ) : availableModels.length > 0 ? (
// //                           availableModels.map((model, modelIndex) => (
// //                             <MenuItem key={modelIndex} value={model.modelNo}>
// //                               {model.modelNo}
// //                               {model.price > 0 && ` (Price: ${model.price})`}
// //                               {model.quantity > 0 && ` (Qty: ${model.quantity})`}
// //                             </MenuItem>
// //                           ))
// //                         ) : (
// //                           <MenuItem disabled>
// //                             {filteredMovements.length > 0
// //                               ? 'No models found in current store'
// //                               : 'No models available'
// //                             }
// //                           </MenuItem>
// //                         )}
// //                       </Select>
// //                       {lineErrors[`l${idx}_modelNo`] && (
// //                         <FormHelperText>{lineErrors[`l${idx}_modelNo`]}</FormHelperText>
// //                       )}
// //                       {!loadingModels && availableModels.length === 0 && (
// //                         <FormHelperText>
// //                           {filteredMovements.length > 0
// //                             ? 'No models found for your store. Check if models have proper product/modelNo fields.'
// //                             : 'No stock inward data available.'
// //                           }
// //                         </FormHelperText>
// //                       )}
// //                     </FormControl>
// //                   </Grid>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <TextField
// //                       label="Quantity *"
// //                       type="number"
// //                       fullWidth
// //                       value={ln.quantity}
// //                       onChange={(e) => {
// //                         const val = Number(e.target.value);
// //                         setLineValue(idx, 'isQuantityManual', true);
// //                         setLineValue(idx, 'quantity', e.target.value);
// //                       }}
// //                       error={!!lineErrors[`l${idx}_quantity`]}
// //                       helperText={lineErrors[`l${idx}_quantity`] || 'Typed value caps how many barcodes you can scan for this row'}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <TextField
// //                       label="Price"
// //                       type="number"
// //                       fullWidth
// //                       value={ln.price || ''}
// //                       onChange={(e) => setLineValue(idx, 'price', e.target.value)}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <TextField
// //                       label="Sale Person"
// //                       fullWidth
// //                       value={ln.salePerson || ''}
// //                       onChange={(e) => setLineValue(idx, 'salePerson', e.target.value)}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12} md={8}>
// //                     <TextField
// //                       label="Scan barcode"
// //                       fullWidth
// //                       value={ln.shd}
// //                       onChange={(e) => setLineValue(idx, 'shd', e.target.value)}
// //                       onKeyDown={(e) => handleScanKeyDown(e, idx)}
// //                       error={!!lineErrors[`l${idx}_shd`]}
// //                       helperText={
// //                         lineErrors[`l${idx}_shd`] ||
// //                         'Barcode must include any continuous 5 or 4 chars from Model No'
// //                       }
// //                       inputRef={(el) => (shdRefs.current[idx] = el)}
// //                       disabled={remainingForLine(ln) === 0}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12}>
// //                     <TextField
// //                       label="Scanned Codes"
// //                       fullWidth
// //                       multiline
// //                       rows={3}
// //                       value={ln.scannedCodes}
// //                       InputProps={{ readOnly: true }}
// //                     />
// //                     <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
// //                       Total scanned: {ln.scannedList.length}
// //                       {remainingForLine(ln) !== Infinity && ` | Remaining: ${remainingForLine(ln)}`}
// //                     </Typography>
// //                   </Grid>
// //                 </Grid>
// //               </Paper>
// //             ))}
// //             <Button
// //               variant="outlined"
// //               startIcon={<AddIcon />}
// //               onClick={addLine}
// //               color="primary"
// //             >
// //               Add Model
// //             </Button>
// //           </Stack>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleOutwardDialogClose} color="primary">
// //             Cancel
// //           </Button>
// //           <Button onClick={handleOutwardSubmit} color="primary" disabled={loading}>
// //             {loading ? 'Processing...' : 'Submit'}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </div>
// //   );
// // }

// // export default History;










// // import React, { useState, useEffect, useRef } from 'react';
// // import { useUser } from './UserContext';
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   IconButton,
// //   TextField,
// //   Typography,
// //   MenuItem,
// //   Grid,
// //   Paper,
// //   Stack,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   FormHelperText,
// // } from '@mui/material';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import AddIcon from '@mui/icons-material/Add';

// // const makeEmptyLine = () => ({
// //   modelNo: '',
// //   salePerson: '',
// //   quantity: 0,
// //   price: 0,
// //   shd: '',
// //   scannedCodes: '',
// //   scannedList: [],
// //   isQuantityManual: false,
// //   lowStockWarning: '',
// // });

// // const sanitize = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

// // const findModelMatchInBarcode = (model, barcode) => {
// //   const m = sanitize(model);
// //   const b = sanitize(barcode);
// //   if (!m || !b) return null;
// //   const lengths = [5, 4];
// //   for (const L of lengths) {
// //     if (m.length < L) continue;
// //     for (let i = 0; i <= m.length - L; i++) {
// //       const sub = m.slice(i, i + L);
// //       if (b.includes(sub)) return sub;
// //     }
// //   }
// //   return null;
// // };

// // const capForLine = (ln) => {
// //   const q = Number(ln.quantity);
// //   if (ln.isQuantityManual && Number.isFinite(q) && q > 0) return q;
// //   return Infinity;
// // };

// // const remainingForLine = (ln) => {
// //   const cap = capForLine(ln);
// //   if (cap === Infinity) return Infinity;
// //   return Math.max(0, cap - (ln.scannedList?.length || 0));
// // };

// // const qtyForLine = (ln) => {
// //   const manual = Number(ln.quantity);
// //   if (!Number.isNaN(manual) && manual > 0) return manual;
// //   return ln.scannedList?.length || 0;
// // };

// // const AlertDialog = ({ open, onClose, title, message, actions }) => {
// //   return (
// //     <Dialog open={open} onClose={onClose}>
// //       <DialogTitle>{title}</DialogTitle>
// //       <DialogContent>
// //         <Typography>{message}</Typography>
// //       </DialogContent>
// //       <DialogActions>
// //         {actions || (
// //           <Button onClick={onClose} color="primary" autoFocus>
// //             OK
// //           </Button>
// //         )}
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // function History() {
// //   const { user } = useUser();
// //   const [stockMovements, setStockMovements] = useState([]);
// //   const [filteredMovements, setFilteredMovements] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [deleteLoading, setDeleteLoading] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage] = useState(5);
// //   const [showOutwardDialog, setShowOutwardDialog] = useState(false);
// //   const [outwardError, setOutwardError] = useState('');
// //   const [lines, setLines] = useState([makeEmptyLine()]);
// //   const [lineErrors, setLineErrors] = useState({});
// //   const [globalScanned, setGlobalScanned] = useState(new Set());
// //   const [customerNames, setCustomerNames] = useState([]);
// //   const [loadingCustomers, setLoadingCustomers] = useState(false);
// //   const [availableModels, setAvailableModels] = useState([]);
// //   const [loadingModels, setLoadingModels] = useState(false);
// //   const [outwardFormData, setOutwardFormData] = useState({
// //     customerName: '',
// //     selectedCustomer: null,
// //     modelNo: '',
// //     quantity: 0,
// //     shd: '',
// //     scannedCodes: '',
// //     scannedList: [],
// //     price: 0,
// //     salePerson: '',
// //   });
// //   const [alertOpen, setAlertOpen] = useState(false);
// //   const [alertTitle, setAlertTitle] = useState('');
// //   const [alertMessage, setAlertMessage] = useState('');
// //   const [alertActions, setAlertActions] = useState(null);

// //   const shdRefs = useRef({});
// //   const scannerBuffers = useRef({});
// //   const scannerTimers = useRef({});

// //   const showAlert = (title, message, actions = null) => {
// //     setAlertTitle(title);
// //     setAlertMessage(message);
// //     setAlertActions(actions);
// //     setAlertOpen(true);
// //   };

// //   const showConfirm = (title, message, onConfirm) => {
// //     showAlert(
// //       title,
// //       message,
// //       <>
// //         <Button onClick={() => setAlertOpen(false)} color="primary">
// //           Cancel
// //         </Button>
// //         <Button
// //           onClick={() => {
// //             setAlertOpen(false);
// //             onConfirm();
// //           }}
// //           color="primary"
// //           autoFocus
// //         >
// //           OK
// //         </Button>
// //       </>
// //     );
// //   };

// //   useEffect(() => {
// //     fetchStockMovements();
// //   }, [user]);

// //   const fetchStockMovements = async () => {
// //     try {
// //       setLoading(true);
// //       const inwardResponse = await fetch('https://stockhandle.onrender.com/api/store-inward');
// //       if (!inwardResponse.ok) {
// //         throw new Error(`HTTP error! status: ${inwardResponse.status}`);
// //       }
// //       const inwardData = await inwardResponse.json();
// //       const inwardMovements = Array.isArray(inwardData) ? inwardData : (inwardData.movements || inwardData.data || []);
// //       const allMovements = inwardMovements.map(m => ({ ...m, type: 'inward' }));
// //       setStockMovements(allMovements);
// //       if (user?.role && user?.role !== 'admin') {
// //         const filtered = allMovements.filter(movement => movement.storeName?.toLowerCase() === user.role?.toLowerCase());
// //         setFilteredMovements(filtered);
// //       } else {
// //         setFilteredMovements(allMovements);
// //       }
// //     } catch (err) {
// //       setError(err.message);
// //       console.error('Error fetching stock movements:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchAvailableModels = async () => {
// //     if (!user?.role) return;
// //     setLoadingModels(true);
// //     try {
// //       let modelsData = [];
// //       if (stockMovements.length > 0) {
// //         modelsData = stockMovements;
// //       } else {
// //         const response = await fetch(`https://stockhandle.onrender.com/api/stock-inward`);
// //         if (!response.ok) throw new Error('Failed to fetch models');
// //         const data = await response.json();
// //         modelsData = Array.isArray(data) ? data : (data.movements || data.data || []);
// //       }
// //       let filteredMovements = modelsData;
// //       if (user?.role && user?.role !== 'admin') {
// //         filteredMovements = modelsData.filter(movement => movement.storeName?.toLowerCase() === user.role?.toLowerCase());
// //       }
// //       const modelMap = new Map();
// //       filteredMovements.forEach(movement => {
// //         const modelNo = movement.product || movement.modelNo;
// //         if (modelNo) {
// //           if (!modelMap.has(modelNo)) {
// //             modelMap.set(modelNo, {
// //               modelNo: modelNo,
// //               price: movement.pricePerUnit || movement.price || 0,
// //               quantity: movement.quantity || 0,
// //               storeName: movement.storeName || '',
// //               inwardId: movement._id
// //             });
// //           }
// //         }
// //       });
// //       const uniqueModels = Array.from(modelMap.values());
// //       setAvailableModels(uniqueModels);
// //     } catch (error) {
// //       console.error('Error fetching models:', error);
// //       setAvailableModels([]);
// //     } finally {
// //       setLoadingModels(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (showOutwardDialog) {
// //       fetchAvailableModels();
// //     }
// //   }, [showOutwardDialog, user?.role, stockMovements]);

// //   const handleDelete = async (movement) => {
// //     showConfirm(
// //       'Confirm Delete',
// //       `Are you sure you want to delete this stock inward record?\n\nModel: ${movement.modelNo || movement.product}\nQuantity: ${movement.quantity}\nStore: ${movement.storeName}`,
// //       async () => {
// //         try {
// //           setDeleteLoading(movement._id);
// //           const response = await fetch(`https://stockhandle.onrender.com/api/stock-inward/${movement._id}`, {
// //             method: 'DELETE',
// //             headers: {
// //               'Content-Type': 'application/json',
// //             },
// //           });
// //           if (!response.ok) {
// //             throw new Error(`HTTP error! status: ${response.status}`);
// //           }
// //           const result = await response.json();
// //           if (result.success) {
// //             setFilteredMovements(prev => prev.filter(item => item._id !== movement._id));
// //             setStockMovements(prev => prev.filter(item => item._id !== movement._id));
// //             showAlert('Success', 'Stock inward record deleted successfully!');
// //           } else {
// //             throw new Error(result.error || 'Failed to delete record');
// //           }
// //         } catch (err) {
// //           console.error('Error deleting stock movement:', err);
// //           showAlert('Error', `Error deleting record: ${err.message}`);
// //         } finally {
// //           setDeleteLoading(null);
// //         }
// //       }
// //     );
// //   };

// //   const updateStockInwardAfterOutward = async (modelNo, outwardQuantity, scannedBarcodes) => {
// //     try {
// //       const storeFilter = user?.role && user?.role !== 'admin' ? user.role.toLowerCase() : null;
// //       const inwardRecords = stockMovements.filter(movement => {
// //         const movementModelNo = movement.product || movement.modelNo;
// //         const storeMatch = storeFilter ? movement.storeName?.toLowerCase() === storeFilter : true;
// //         return movementModelNo === modelNo && storeMatch;
// //       });
// //       if (inwardRecords.length === 0) {
// //         console.warn(`No inward records found for model: ${modelNo}`);
// //         return;
// //       }
// //       let remainingQuantity = outwardQuantity;
// //       const barcodesToRemove = new Set(scannedBarcodes || []);
// //       const sortedInwardRecords = inwardRecords.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
// //       for (const record of sortedInwardRecords) {
// //         if (remainingQuantity <= 0 && barcodesToRemove.size === 0) break;
// //         const currentQuantity = record.quantity || 0;
// //         let currentBarcodes = [];
// //         if (record.scannedBarcode) {
// //           if (Array.isArray(record.scannedBarcode)) {
// //             currentBarcodes = [...record.scannedBarcode];
// //           } else if (typeof record.scannedBarcode === 'string') {
// //             currentBarcodes = record.scannedBarcode.split(',').map(b => b.trim()).filter(b => b);
// //           }
// //         }
// //         let updatedQuantity = currentQuantity;
// //         let updatedBarcodes = [...currentBarcodes];
// //         if (barcodesToRemove.size > 0) {
// //           const originalLength = updatedBarcodes.length;
// //           updatedBarcodes = updatedBarcodes.filter(barcode => !barcodesToRemove.has(barcode));
// //           const removedCount = originalLength - updatedBarcodes.length;
// //           if (removedCount > 0) {
// //             updatedQuantity = Math.max(0, updatedQuantity - removedCount);
// //             remainingQuantity = Math.max(0, remainingQuantity - removedCount);
// //           }
// //         }
// //         if (remainingQuantity > 0 && updatedQuantity > 0) {
// //           const quantityToReduce = Math.min(remainingQuantity, updatedQuantity);
// //           updatedQuantity = updatedQuantity - quantityToReduce;
// //           remainingQuantity = remainingQuantity - quantityToReduce;
// //         }
// //         const updateData = {
// //           quantity: updatedQuantity,
// //           scannedBarcode: updatedBarcodes.length > 0 ? updatedBarcodes : []
// //         };
// //         const updateResponse = await fetch(`https://stockhandle.onrender.com/api/stock-inward/${record._id}`, {
// //           method: 'PUT',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify(updateData),
// //         });
// //         if (!updateResponse.ok) {
// //           const errorText = await updateResponse.text();
// //           throw new Error(`Failed to update inward record: ${record._id} - ${errorText}`);
// //         }
// //       }
// //       await fetchStockMovements();
// //     } catch (error) {
// //       console.error('Error updating stock inward after outward:', error);
// //       throw error;
// //     }
// //   };

// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
// //   const paginate = (pageNumber) => setCurrentPage(pageNumber);

// //   const stats = React.useMemo(() => {
// //     const productMap = new Map();
// //     filteredMovements.forEach(item => {
// //       const model = item.product || item.modelNo;
// //       if (!model) return;
// //       const qty = Number(item.quantity) || 0;
// //       productMap.set(model, (productMap.get(model) || 0) + qty);
// //     });

// //     let totalItems = 0;
// //     let lowStock = 0;
// //     let outOfStock = 0;
// //     const totalProducts = productMap.size;

// //     for (const qty of productMap.values()) {
// //       totalItems += qty;
// //       if (qty === 0) outOfStock++;
// //       else if (qty < 5) lowStock++;
// //     }
// //     return { totalItems, totalProducts, lowStock, outOfStock };
// //   }, [filteredMovements]);

// //   const getBadgeStyle = (type) => ({
// //     padding: '4px 8px',
// //     borderRadius: '5px',
// //     fontSize: '12px',
// //     textTransform: 'uppercase',
// //     fontWeight: '500',
// //     textAlign: 'center',
// //     minWidth: '80px',
// //     display: 'inline-block',
// //     backgroundColor: '#dcfce7',
// //     color: '#166534'
// //   });

// //   const handleOutwardDialogOpen = () => {
// //     setShowOutwardDialog(true);
// //     setLines([makeEmptyLine()]);
// //     setLineErrors({});
// //     setGlobalScanned(new Set());
// //     setOutwardFormData({
// //       customerName: '',
// //       selectedCustomer: null,
// //       modelNo: '',
// //       quantity: 0,
// //       shd: '',
// //       scannedCodes: '',
// //       scannedList: [],
// //       price: 0,
// //       salePerson: '',
// //     });
// //   };

// //   const handleOutwardDialogClose = () => {
// //     setShowOutwardDialog(false);
// //     setOutwardError('');
// //   };

// //   const handleModelSelect = (idx, selectedModelNo) => {
// //     const selectedModel = availableModels.find(model => model.modelNo === selectedModelNo);
// //     if (selectedModel) {
// //       setLines(prev => {
// //         const next = [...prev];
// //         next[idx] = {
// //           ...next[idx],
// //           modelNo: selectedModel.modelNo,
// //           price: selectedModel.price,
// //           quantity: selectedModel.quantity,
// //           isQuantityManual: true
// //         };
// //         return next;
// //       });
// //     } else {
// //       setLines(prev => {
// //         const next = [...prev];
// //         next[idx] = {
// //           ...next[idx],
// //           modelNo: selectedModelNo,
// //           isQuantityManual: true
// //         };
// //         return next;
// //       });
// //     }
// //   };

// //   const setLineValue = (idx, field, value) => {
// //     setLines((prev) => {
// //       const next = [...prev];
// //       next[idx] = { ...next[idx], [field]: value };
// //       return next;
// //     });
// //     const key = `l${idx}_${field}`;
// //     if (lineErrors[key]) setLineErrors((e) => ({ ...e, [key]: '' }));
// //   };

// //   const handleScanKeyDown = (e, idx) => {
// //     if (!scannerBuffers.current[idx]) scannerBuffers.current[idx] = '';
// //     if (e.key === 'Enter') {
// //       e.preventDefault();
// //       const code = scannerBuffers.current[idx];
// //       if (code) {
// //         setLineValue(idx, 'shd', code);
// //         processBarcode(idx, code);
// //       }
// //       scannerBuffers.current[idx] = '';
// //       return;
// //     }
// //     if (e.key.length === 1) {
// //       scannerBuffers.current[idx] += e.key;
// //     }
// //     clearTimeout(scannerTimers.current[idx]);
// //     scannerTimers.current[idx] = setTimeout(() => {
// //       const code = scannerBuffers.current[idx];
// //       if (code) {
// //         setLineValue(idx, 'shd', code);
// //         processBarcode(idx, code);
// //       }
// //       scannerBuffers.current[idx] = '';
// //     }, 200);
// //   };

// //   const processBarcode = (idx, overrideRaw) => {
// //     const ln = lines[idx];
// //     if (!ln) return;
// //     const raw = (overrideRaw || ln?.shd || '').trim();
// //     if (!raw) return;
// //     if (!ln.modelNo) {
// //       showAlert('Error', 'Please select a Model No first');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_modelNo`]: 'Model No is required' }));
// //       return;
// //     }
// //     if (ln.scannedList?.includes(raw)) {
// //       showAlert('Error', 'This barcode is already scanned in this row');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in this row' }));
// //       setLineValue(idx, 'shd', '');
// //       return;
// //     }
// //     if (globalScanned.has(raw)) {
// //       showAlert('Error', 'This barcode is already scanned in another row');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in another row' }));
// //       setLineValue(idx, 'shd', '');
// //       return;
// //     }
// //     const cap = capForLine(ln);
// //     if (cap !== Infinity && (ln.scannedList?.length || 0) >= cap) {
// //       showAlert('Info', `Target reached: ${cap} scans for this row`);
// //       setLineValue(idx, 'shd', '');
// //       return;
// //     }
// //     const matched = findModelMatchInBarcode(ln.modelNo, raw);
// //     if (!matched) {
// //       showAlert('Error', 'Mismatch: No 5/4-char continuous segment from Model No found in barcode');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'Barcode mismatch with Model No' }));
// //       return;
// //     }
// //     const nextGlobal = new Set(globalScanned);
// //     nextGlobal.add(raw);
// //     setGlobalScanned(nextGlobal);
// //     setLines((prev) => {
// //       const arr = [...prev];
// //       const L = { ...arr[idx] };
// //       const _cap = capForLine(L);
// //       const currentLen = L.scannedList?.length || 0;
// //       if (_cap !== Infinity && currentLen >= _cap) {
// //         return arr;
// //       }
// //       const nextList = [...(L.scannedList || []), raw];
// //       if (_cap !== Infinity && nextList.length > _cap) {
// //         return arr;
// //       }
// //       L.scannedList = nextList;
// //       L.scannedCodes = nextList.join(', ');
// //       if (!L.isQuantityManual) L.quantity = nextList.length;
// //       L.shd = '';
// //       arr[idx] = L;
// //       return arr;
// //     });
// //     const left = remainingForLine({ ...ln, scannedList: [...(ln.scannedList || []), raw] });
// //     showAlert(
// //       'Success',
// //       left === Infinity
// //         ? `Accepted for ${ln.modelNo} (match: "${matched}")`
// //         : `Accepted (${ln.modelNo}). Remaining: ${left}`
// //     );
// //   };

// //   const validateForm = () => {
// //     const eLine = {};
// //     let ok = true;
// //     if (lines.length === 0) {
// //       showAlert('Error', 'Add at least one model row');
// //       ok = false;
// //     }
// //     lines.forEach((ln, i) => {
// //       const key = (f) => `l${i}_${f}`;
// //       if (!ln.modelNo) {
// //         eLine[key('modelNo')] = 'Model No is required';
// //         ok = false;
// //       }
// //       const qty = qtyForLine(ln);
// //       if (qty <= 0) {
// //         eLine[key('quantity')] = 'Enter a quantity > 0 or scan at least one code';
// //         ok = false;
// //       }
// //     });
// //     setLineErrors(eLine);
// //     return ok;
// //   };

// //   const handleOutwardSubmit = async () => {
// //     if (!validateForm()) {
// //       showAlert('Error', 'Please fix the errors before submitting!');
// //       return;
// //     }
// //     if (!outwardFormData.customerName || !outwardFormData.selectedCustomer) {
// //       showAlert('Error', 'Please select a customer!');
// //       return;
// //     }
// //     try {
// //       setLoading(true);
// //       const results = [];
// //       const inwardUpdates = [];
// //       for (const ln of lines) {
// //         if (!ln.modelNo || qtyForLine(ln) <= 0) continue;
// //         const outwardQuantity = qtyForLine(ln);
// //         const scannedBarcodes = ln.scannedList || [];
// //         const outwardData = {
// //           modelNo: ln.modelNo,
// //           quantity: outwardQuantity,
// //           reason: "Stock Outward",
// //           userId: user?.id || "unknown-user",
// //           storeName: user?.role || "JAIPUR",
// //           customerName: outwardFormData.customerName,
// //           customerMobile: outwardFormData.selectedCustomer?.phoneNo || "",
// //           customerAddress: outwardFormData.selectedCustomer?.address || "",
// //           scannedCodes: ln.scannedCodes || "",
// //           scannedList: ln.scannedList || [],
// //           price: ln.price || 0,
// //           salePerson: ln.salePerson || "",
// //         };
// //         const response = await fetch('https://stockhandle.onrender.com/api/stock-outward', {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify(outwardData),
// //         });
// //         const result = await response.json();
// //         results.push(result);
// //         if (result.success) {
// //           inwardUpdates.push({
// //             modelNo: ln.modelNo,
// //             quantity: outwardQuantity,
// //             scannedBarcodes: scannedBarcodes
// //           });
// //         }
// //       }
// //       const allSuccess = results.every(result => result.success);
// //       if (allSuccess) {
// //         try {
// //           for (const update of inwardUpdates) {
// //             await updateStockInwardAfterOutward(update.modelNo, update.quantity, update.scannedBarcodes);
// //           }
// //           showAlert('Success', 'Stock outward successful! Stock inward records updated.');
// //           handleOutwardDialogClose();
// //           await fetchStockMovements();
// //         } catch (updateError) {
// //           console.error('Error updating inward records:', updateError);
// //           showAlert('Warning', 'Stock outward saved but there was an error updating inward records. Please check stock levels manually.');
// //           handleOutwardDialogClose();
// //           await fetchStockMovements();
// //         }
// //       } else {
// //         const errors = results.filter(result => !result.success).map(r => r.error);
// //         setOutwardError(`Some items failed: ${errors.join(', ')}`);
// //         showAlert('Error', `Some items failed to save: ${errors.join(', ')}`);
// //       }
// //     } catch (err) {
// //       console.error('Error submitting stock outward:', err);
// //       setOutwardError(err.message);
// //       showAlert('Error', `Error submitting stock outward: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const addLine = () => {
// //     setLines((prev) => {
// //       const next = [...prev, makeEmptyLine()];
// //       return next;
// //     });
// //   };

// //   const removeLine = (idx) => {
// //     setLines((prev) => {
// //       const target = prev[idx];
// //       if (target?.scannedList?.length) {
// //         const ns = new Set(globalScanned);
// //         target.scannedList.forEach((c) => ns.delete(c));
// //         setGlobalScanned(ns);
// //       }
// //       const next = prev.slice(0, idx).concat(prev.slice(idx + 1));
// //       return next.length ? next : [makeEmptyLine()];
// //     });
// //   };

// //   useEffect(() => {
// //     const fetchCustomerNames = async () => {
// //       if (!user?.role) return;
// //       setLoadingCustomers(true);
// //       try {
// //         const response = await fetch(`https://stockhandle.onrender.com/api/storecustomers?storeName=${user.role}`);
// //         const data = await response.json();
// //         setCustomerNames(data.data || []);
// //       } catch (error) {
// //         console.error('Error fetching customer data:', error);
// //       } finally {
// //         setLoadingCustomers(false);
// //       }
// //     };
// //     fetchCustomerNames();
// //   }, [user?.role]);

// //   const styles = {
// //     container: {
// //       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
// //       backgroundColor: '#f8fafc',
// //       minHeight: '100vh',
// //       padding: '24px',
// //     },
// //     header: {
// //       display: 'flex',
// //       alignItems: 'center',
// //       gap: '12px',
// //       marginBottom: '8px',
// //     },
// //     headerIcon: {
// //       width: '32px',
// //       height: '32px',
// //       color: '#3b82f6',
// //     },
// //     title: {
// //       fontSize: '28px',
// //       fontWeight: '700',
// //       color: '#1f2937',
// //       margin: 0,
// //       padding: '20px'
// //     },
// //     subtitle: {
// //       fontSize: '16px',
// //       color: '#6b7280',
// //       margin: '0 0 32px 44px',
// //     },
// //     tableContainer: {
// //       backgroundColor: 'white',
// //       borderRadius: '12px',
// //       boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
// //       border: '1px solid #e5e7eb',
// //       overflow: 'hidden',
// //     },
// //     table: {
// //       width: '100%',
// //       borderCollapse: 'collapse',
// //       textAlign: 'center',
// //     },
// //     tableHeader: {
// //       borderBottom: '1px solid #e5e7eb',
// //       backgroundColor: '#f9fafb',
// //     },
// //     th: {
// //       padding: '16px 24px',
// //       fontSize: '12px',
// //       fontWeight: '500',
// //       color: '#6b7280',
// //       textTransform: 'uppercase',
// //       letterSpacing: '0.05em',
// //     },
// //     thLast: {
// //       position: 'relative',
// //     },
// //     sortIcon: {
// //       position: 'absolute',
// //       right: '24px',
// //       top: '50%',
// //       transform: 'translateY(-50%)',
// //       width: '12px',
// //       height: '20px',
// //       color: '#9ca3af',
// //     },
// //     emptyState: {
// //       textAlign: 'center',
// //       padding: '80px 24px',
// //     },
// //     emptyIcon: {
// //       width: '64px',
// //       height: '64px',
// //       color: '#d1d5db',
// //       margin: '0 auto 24px',
// //     },
// //     emptyText: {
// //       fontSize: '16px',
// //       color: '#6b7280',
// //       margin: 0,
// //     },
// //     td: {
// //       padding: '16px 24px',
// //       borderBottom: '1px solid #f3f4f6',
// //       fontSize: '14px',
// //       color: '#374151',
// //     },
// //     deleteButton: {
// //       background: 'none',
// //       border: 'none',
// //       cursor: 'pointer',
// //       padding: '8px',
// //       borderRadius: '4px',
// //       transition: 'background-color 0.2s',
// //     },
// //     deleteButtonHover: {
// //       backgroundColor: '#fef2f2',
// //     },
// //     deleteIcon: {
// //       width: '18px',
// //       height: '18px',
// //       color: '#dc2626',
// //     },
// //     loadingIcon: {
// //       width: '18px',
// //       height: '18px',
// //       color: '#6b7280',
// //       animation: 'spin 1s linear infinite',
// //     },
// //   };

// //   if (loading) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>
// //           Loading stock inward movements...
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#dc2626' }}>
// //           Error: {error}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={styles.container}>
// //       <AlertDialog
// //         open={alertOpen}
// //         onClose={() => setAlertOpen(false)}
// //         title={alertTitle}
// //         message={alertMessage}
// //         actions={alertActions}
// //       />
// //       <div style={styles.header}>
// //         <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //         </svg>
// //         <h1 style={styles.title}>Stock Inward Details</h1>
// //       </div>
// //       <p style={styles.subtitle}>
// //         {user?.role === 'admin'
// //           ? 'Showing all stock inward details'
// //           : `Showing stock inward details for ${user?.role}`}
// //       </p>
// //       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end' }}>
// //         <button
// //           onClick={handleOutwardDialogOpen}
// //           style={{
// //             padding: '8px 16px',
// //             backgroundColor: '#ef4444',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: 'pointer',
// //             display: 'flex',
// //             alignItems: 'center',
// //             gap: '8px',
// //           }}
// //         >
// //           <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
// //           </svg>
// //           Stock Outward
// //         </button>
// //       </div>

// //       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
// //         {/* Total Items */}
// //         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
// //             <svg style={{ width: '24px', height: '24px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
// //               <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
// //               <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
// //               <line x1="12" y1="22.08" x2="12" y2="12" />
// //             </svg>
// //             <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Total Items</h3>
// //           </div>
// //           <p style={{ fontSize: '36px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.totalItems}</p>
// //         </div>

// //         {/* Low Stock */}
// //         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
// //             <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="#dc2626" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L3.34 16.5c-.77.833.192 2.5 1.742 2.5z" />
// //             </svg>
// //             <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Low Stock</h3>
// //           </div>
// //           <p style={{ fontSize: '36px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.lowStock}</p>
// //         </div>

// //         {/* Products */}
// //         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
// //             <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
// //             </svg>
// //             <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Products</h3>
// //           </div>
// //           <p style={{ fontSize: '36px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.totalProducts}</p>
// //         </div>

// //         {/* Out of Stock */}
// //         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
// //             <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
// //               {/* Currency/Rupee symbol generic representation or use the user's icon if possible. I'll use a generic coin stack or similar if I can't match exactly. The Image had a Rupee symbol actually. I'll use a Rupee icon. */}
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
// //             </svg>
// //             <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Out of Stock</h3>
// //           </div>
// //           <p style={{ fontSize: '36px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.outOfStock}</p>
// //         </div>
// //       </div>
// //       <div style={styles.tableContainer}>
// //         <h1 style={styles.title}>Stock Inward table</h1>
// //         {filteredMovements.length > 0 ? (
// //           <>
// //             <table style={styles.table}>
// //               <thead style={styles.tableHeader}>
// //                 <tr>
// //                   <th style={styles.th}>USER ID</th>
// //                   <th style={styles.th}>MODEL NO</th>
// //                   <th style={styles.th}>QUANTITY</th>
// //                   <th style={styles.th}>STORE NAME</th>
// //                   <th style={styles.th}>BARCODE</th>
// //                   <th style={styles.th}>PER UNIT PRICE</th>
// //                   <th style={styles.th}>DATE</th>
// //                   <th style={styles.th}>ACTIVITY</th>
// //                   <th style={styles.th}>ACTION</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {currentItems.map((movement, index) => (
// //                   <tr key={movement._id || index}>
// //                     <td style={styles.td}>{movement.userId || 'N/A'}</td>
// //                     <td style={styles.td}>{movement.product || movement.modelNo || 'N/A'}</td>
// //                     <td style={styles.td}>{movement.quantity || 'N/A'}</td>
// //                     <td style={styles.td}>{movement.storeName || 'N/A'}</td>
// //                     <td style={styles.td}>
// //                       {Array.isArray(movement.scannedBarcode)
// //                         ? movement.scannedBarcode.join(', ')
// //                         : movement.scannedBarcode || 'N/A'
// //                       }
// //                     </td>
// //                     <td style={styles.td}>{movement.pricePerUnit || 'N/A'}</td>
// //                     <td style={styles.td}>
// //                       {movement.createdAt ? new Date(movement.createdAt).toLocaleString() : 'N/A'}
// //                     </td>
// //                     <td style={styles.td}>
// //                       <span style={getBadgeStyle(movement.type)}>
// //                         STORE INWARD
// //                       </span>
// //                     </td>
// //                     <td style={styles.td}>
// //                       <button
// //                         onClick={() => handleDelete(movement)}
// //                         disabled={deleteLoading === movement._id}
// //                         style={{
// //                           ...styles.deleteButton,
// //                           ...(deleteLoading === movement._id ? {} : styles.deleteButtonHover)
// //                         }}
// //                         title="Delete this record"
// //                       >
// //                         {deleteLoading === movement._id ? (
// //                           <svg style={styles.loadingIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2m15.364-7.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-12.728l2.828 2.828m9.168 9.168l2.828 2.828" />
// //                           </svg>
// //                         ) : (
// //                           <svg style={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// //                           </svg>
// //                         )}
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
// //               <div style={{ fontSize: '14px', color: '#6b7280' }}>
// //                 Showing {filteredMovements.length} record{filteredMovements.length !== 1 ? 's' : ''}
// //               </div>
// //               <div style={{ display: 'flex', gap: '8px' }}>
// //                 {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((number) => (
// //                   <button
// //                     key={number}
// //                     onClick={() => paginate(number)}
// //                     style={{
// //                       padding: '8px 12px',
// //                       border: '1px solid #e5e7eb',
// //                       backgroundColor: currentPage === number ? '#3b82f6' : 'white',
// //                       color: currentPage === number ? 'white' : '#374151',
// //                       borderRadius: '4px',
// //                       cursor: 'pointer',
// //                     }}
// //                   >
// //                     {number}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           </>
// //         ) : (
// //           <div style={styles.emptyState}>
// //             <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //             </svg>
// //             <p style={styles.emptyText}>
// //               {user?.role === 'admin'
// //                 ? 'No stock inward details recorded'
// //                 : `No stock inward details recorded for ${user?.role}`}
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //       <Dialog open={showOutwardDialog} onClose={handleOutwardDialogClose} fullWidth maxWidth="md">
// //         <DialogTitle>Stock Outward</DialogTitle>
// //         <DialogContent>
// //           <Stack spacing={2} sx={{ mt: 2 }}>
// //             <FormControl fullWidth>
// //               <InputLabel>Customer Name *</InputLabel>
// //               <Select
// //                 value={outwardFormData.customerName}
// //                 onChange={(e) => {
// //                   const selectedCustomer = customerNames.find(c => c.customerName === e.target.value);
// //                   setOutwardFormData({
// //                     ...outwardFormData,
// //                     customerName: e.target.value,
// //                     selectedCustomer: selectedCustomer || null,
// //                   });
// //                 }}
// //                 label="Customer Name *"
// //                 disabled={loadingCustomers}
// //               >
// //                 {loadingCustomers ? (
// //                   <MenuItem disabled>Loading customers...</MenuItem>
// //                 ) : customerNames.length > 0 ? (
// //                   customerNames.map((customer, index) => (
// //                     <MenuItem key={index} value={customer.customerName}>
// //                       {customer.customerName} ({customer.phoneNo})
// //                     </MenuItem>
// //                   ))
// //                 ) : (
// //                   <MenuItem disabled>No customers found</MenuItem>
// //                 )}
// //               </Select>
// //             </FormControl>
// //             {outwardFormData.selectedCustomer && (
// //               <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
// //                 <Typography variant="subtitle1" fontWeight="bold">
// //                   Customer Details
// //                 </Typography>
// //                 <Typography variant="body2">
// //                   <strong>Mobile:</strong> {outwardFormData.selectedCustomer.phoneNo}
// //                 </Typography>
// //                 <Typography variant="body2">
// //                   <strong>Address:</strong> {outwardFormData.selectedCustomer.address}
// //                 </Typography>
// //               </Paper>
// //             )}
// //             {lines.map((ln, idx) => (
// //               <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
// //                 <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
// //                   <Typography fontWeight={600}>Model #{idx + 1}</Typography>
// //                   <IconButton color="error" onClick={() => removeLine(idx)} disabled={lines.length === 1}>
// //                     <DeleteIcon />
// //                   </IconButton>
// //                 </Stack>
// //                 <Grid container spacing={2}>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <FormControl fullWidth error={!!lineErrors[`l${idx}_modelNo`]}>
// //                       <InputLabel>Model No *</InputLabel>
// //                       <Select
// //                         value={ln.modelNo || ''}
// //                         onChange={(e) => handleModelSelect(idx, e.target.value)}
// //                         label="Model No *"
// //                         disabled={loadingModels}
// //                       >
// //                         {loadingModels ? (
// //                           <MenuItem disabled>Loading models...</MenuItem>
// //                         ) : availableModels.length > 0 ? (
// //                           availableModels.map((model, modelIndex) => (
// //                             <MenuItem key={modelIndex} value={model.modelNo}>
// //                               {model.modelNo}
// //                               {model.price > 0 && ` (Price: ${model.price})`}
// //                               {model.quantity > 0 && ` (Qty: ${model.quantity})`}
// //                             </MenuItem>
// //                           ))
// //                         ) : (
// //                           <MenuItem disabled>
// //                             {filteredMovements.length > 0
// //                               ? 'No models found in current store'
// //                               : 'No models available'
// //                             }
// //                           </MenuItem>
// //                         )}
// //                       </Select>
// //                       {lineErrors[`l${idx}_modelNo`] && (
// //                         <FormHelperText>{lineErrors[`l${idx}_modelNo`]}</FormHelperText>
// //                       )}
// //                       {!loadingModels && availableModels.length === 0 && (
// //                         <FormHelperText>
// //                           {filteredMovements.length > 0
// //                             ? 'No models found for your store. Check if models have proper product/modelNo fields.'
// //                             : 'No stock inward data available.'
// //                           }
// //                         </FormHelperText>
// //                       )}
// //                     </FormControl>
// //                   </Grid>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <TextField
// //                       label="Quantity *"
// //                       type="number"
// //                       fullWidth
// //                       value={ln.quantity}
// //                       onChange={(e) => {
// //                         const val = Number(e.target.value);
// //                         setLineValue(idx, 'isQuantityManual', true);
// //                         setLineValue(idx, 'quantity', e.target.value);
// //                       }}
// //                       error={!!lineErrors[`l${idx}_quantity`]}
// //                       helperText={lineErrors[`l${idx}_quantity`] || 'Typed value caps how many barcodes you can scan for this row'}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <TextField
// //                       label="Price"
// //                       type="number"
// //                       fullWidth
// //                       value={ln.price || ''}
// //                       onChange={(e) => setLineValue(idx, 'price', e.target.value)}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <TextField
// //                       label="Sale Person"
// //                       fullWidth
// //                       value={ln.salePerson || ''}
// //                       onChange={(e) => setLineValue(idx, 'salePerson', e.target.value)}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12} md={8}>
// //                     <TextField
// //                       label="Scan barcode"
// //                       fullWidth
// //                       value={ln.shd}
// //                       onChange={(e) => setLineValue(idx, 'shd', e.target.value)}
// //                       onKeyDown={(e) => handleScanKeyDown(e, idx)}
// //                       error={!!lineErrors[`l${idx}_shd`]}
// //                       helperText={
// //                         lineErrors[`l${idx}_shd`] ||
// //                         'Barcode must include any continuous 5 or 4 chars from Model No'
// //                       }
// //                       inputRef={(el) => (shdRefs.current[idx] = el)}
// //                       disabled={remainingForLine(ln) === 0}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12}>
// //                     <TextField
// //                       label="Scanned Codes"
// //                       fullWidth
// //                       multiline
// //                       rows={3}
// //                       value={ln.scannedCodes}
// //                       InputProps={{ readOnly: true }}
// //                     />
// //                     <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
// //                       Total scanned: {ln.scannedList.length}
// //                       {remainingForLine(ln) !== Infinity && ` | Remaining: ${remainingForLine(ln)}`}
// //                     </Typography>
// //                   </Grid>
// //                 </Grid>
// //               </Paper>
// //             ))}
// //             <Button
// //               variant="outlined"
// //               startIcon={<AddIcon />}
// //               onClick={addLine}
// //               color="primary"
// //             >
// //               Add Model
// //             </Button>
// //           </Stack>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleOutwardDialogClose} color="primary">
// //             Cancel
// //           </Button>
// //           <Button onClick={handleOutwardSubmit} color="primary" disabled={loading}>
// //             {loading ? 'Processing...' : 'Submit'}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </div>
// //   );
// // }

// // export default History;





// // import React, { useState, useEffect, useRef } from 'react';
// // import { useUser } from './UserContext';
// // import {
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   IconButton,
// //   TextField,
// //   Typography,
// //   MenuItem,
// //   Grid,
// //   Paper,
// //   Stack,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   FormHelperText,
// // } from '@mui/material';
// // import DeleteIcon from '@mui/icons-material/Delete';
// // import AddIcon from '@mui/icons-material/Add';

// // const makeEmptyLine = () => ({
// //   modelNo: '',
// //   salePerson: '',
// //   quantity: 0,
// //   price: 0,
// //   shd: '',
// //   scannedCodes: '',
// //   scannedList: [],
// //   isQuantityManual: false,
// //   lowStockWarning: '',
// // });

// // const sanitize = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

// // const findModelMatchInBarcode = (model, barcode) => {
// //   const m = sanitize(model);
// //   const b = sanitize(barcode);
// //   if (!m || !b) return null;
// //   const lengths = [5, 4];
// //   for (const L of lengths) {
// //     if (m.length < L) continue;
// //     for (let i = 0; i <= m.length - L; i++) {
// //       const sub = m.slice(i, i + L);
// //       if (b.includes(sub)) return sub;
// //     }
// //   }
// //   return null;
// // };

// // const capForLine = (ln) => {
// //   const q = Number(ln.quantity);
// //   if (ln.isQuantityManual && Number.isFinite(q) && q > 0) return q;
// //   return Infinity;
// // };

// // const remainingForLine = (ln) => {
// //   const cap = capForLine(ln);
// //   if (cap === Infinity) return Infinity;
// //   return Math.max(0, cap - (ln.scannedList?.length || 0));
// // };

// // const qtyForLine = (ln) => {
// //   const manual = Number(ln.quantity);
// //   if (!Number.isNaN(manual) && manual > 0) return manual;
// //   return ln.scannedList?.length || 0;
// // };

// // const AlertDialog = ({ open, onClose, title, message, actions }) => {
// //   return (
// //     <Dialog open={open} onClose={onClose}>
// //       <DialogTitle>{title}</DialogTitle>
// //       <DialogContent>
// //         <Typography>{message}</Typography>
// //       </DialogContent>
// //       <DialogActions>
// //         {actions || (
// //           <Button onClick={onClose} color="primary" autoFocus>
// //             OK
// //           </Button>
// //         )}
// //       </DialogActions>
// //     </Dialog>
// //   );
// // };

// // function History() {
// //   const { user } = useUser();
// //   const [stockMovements, setStockMovements] = useState([]);
// //   const [filteredMovements, setFilteredMovements] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [deleteLoading, setDeleteLoading] = useState(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage] = useState(5);
// //   const [showOutwardDialog, setShowOutwardDialog] = useState(false);
// //   const [outwardError, setOutwardError] = useState('');
// //   const [lines, setLines] = useState([makeEmptyLine()]);
// //   const [lineErrors, setLineErrors] = useState({});
// //   const [globalScanned, setGlobalScanned] = useState(new Set());
// //   const [customerNames, setCustomerNames] = useState([]);
// //   const [loadingCustomers, setLoadingCustomers] = useState(false);
// //   const [availableModels, setAvailableModels] = useState([]);
// //   const [loadingModels, setLoadingModels] = useState(false);
// //   const [outwardFormData, setOutwardFormData] = useState({
// //     customerName: '',
// //     selectedCustomer: null,
// //     modelNo: '',
// //     quantity: 0,
// //     shd: '',
// //     scannedCodes: '',
// //     scannedList: [],
// //     price: 0,
// //     salePerson: '',
// //   });
// //   const [alertOpen, setAlertOpen] = useState(false);
// //   const [alertTitle, setAlertTitle] = useState('');
// //   const [alertMessage, setAlertMessage] = useState('');
// //   const [alertActions, setAlertActions] = useState(null);

// //   const shdRefs = useRef({});
// //   const scannerBuffers = useRef({});
// //   const scannerTimers = useRef({});

// //   const showAlert = (title, message, actions = null) => {
// //     setAlertTitle(title);
// //     setAlertMessage(message);
// //     setAlertActions(actions);
// //     setAlertOpen(true);
// //   };

// //   const showConfirm = (title, message, onConfirm) => {
// //     showAlert(
// //       title,
// //       message,
// //       <>
// //         <Button onClick={() => setAlertOpen(false)} color="primary">
// //           Cancel
// //         </Button>
// //         <Button
// //           onClick={() => {
// //             setAlertOpen(false);
// //             onConfirm();
// //           }}
// //           color="primary"
// //           autoFocus
// //         >
// //           OK
// //         </Button>
// //       </>
// //     );
// //   };

// //   useEffect(() => {
// //     fetchStockMovements();
// //   }, [user]);

// //   const fetchStockMovements = async () => {
// //     try {
// //       setLoading(true);
// //       const inwardResponse = await fetch('https://stockhandle.onrender.com/api/store-inward');
// //       if (!inwardResponse.ok) {
// //         throw new Error(`HTTP error! status: ${inwardResponse.status}`);
// //       }
// //       const inwardData = await inwardResponse.json();
// //       const inwardMovements = Array.isArray(inwardData) ? inwardData : (inwardData.movements || inwardData.data || []);
// //       const allMovements = inwardMovements.map(m => ({ ...m, type: 'inward' }));
// //       setStockMovements(allMovements);
// //       if (user?.role && user?.role !== 'admin') {
// //         const filtered = allMovements.filter(movement => movement.storeName?.toLowerCase() === user.role?.toLowerCase());
// //         setFilteredMovements(filtered);
// //       } else {
// //         setFilteredMovements(allMovements);
// //       }
// //     } catch (err) {
// //       setError(err.message);
// //       console.error('Error fetching stock movements:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchAvailableModels = async () => {
// //     if (!user?.role) return;
// //     setLoadingModels(true);
// //     try {
// //       let modelsData = [];
// //       if (stockMovements.length > 0) {
// //         modelsData = stockMovements;
// //       } else {
// //         const response = await fetch(`https://stockhandle.onrender.com/api/store-inward`);
// //         if (!response.ok) throw new Error('Failed to fetch models');
// //         const data = await response.json();
// //         modelsData = Array.isArray(data) ? data : (data.movements || data.data || []);
// //       }
// //       let filteredMovements = modelsData;
// //       if (user?.role && user?.role !== 'admin') {
// //         filteredMovements = modelsData.filter(movement => movement.storeName?.toLowerCase() === user.role?.toLowerCase());
// //       }
// //       const modelMap = new Map();
// //       filteredMovements.forEach(movement => {
// //         const modelNo = movement.product || movement.modelNo;
// //         if (modelNo) {
// //           if (!modelMap.has(modelNo)) {
// //             modelMap.set(modelNo, {
// //               modelNo: modelNo,
// //               price: movement.pricePerUnit || movement.price || 0,
// //               quantity: movement.quantity || 0,
// //               storeName: movement.storeName || '',
// //               inwardId: movement._id
// //             });
// //           }
// //         }
// //       });
// //       const uniqueModels = Array.from(modelMap.values());
// //       setAvailableModels(uniqueModels);
// //     } catch (error) {
// //       console.error('Error fetching models:', error);
// //       setAvailableModels([]);
// //     } finally {
// //       setLoadingModels(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (showOutwardDialog) {
// //       fetchAvailableModels();
// //     }
// //   }, [showOutwardDialog, user?.role, stockMovements]);

// //   const handleDelete = async (movement) => {
// //     showConfirm(
// //       'Confirm Delete',
// //       `Are you sure you want to delete this stock inward record?\n\nModel: ${movement.modelNo || movement.product}\nQuantity: ${movement.quantity}\nStore: ${movement.storeName}`,
// //       async () => {
// //         try {
// //           setDeleteLoading(movement._id);
// //           const response = await fetch(`https://stockhandle.onrender.com/api/store-inward/${movement._id}`, {
// //             method: 'DELETE',
// //             headers: {
// //               'Content-Type': 'application/json',
// //             },
// //           });
// //           if (!response.ok) {
// //             throw new Error(`HTTP error! status: ${response.status}`);
// //           }
// //           const result = await response.json();
// //           if (result.success) {
// //             setFilteredMovements(prev => prev.filter(item => item._id !== movement._id));
// //             setStockMovements(prev => prev.filter(item => item._id !== movement._id));
// //             showAlert('Success', 'Stock inward record deleted successfully!');
// //           } else {
// //             throw new Error(result.error || 'Failed to delete record');
// //           }
// //         } catch (err) {
// //           console.error('Error deleting stock movement:', err);
// //           showAlert('Error', `Error deleting record: ${err.message}`);
// //         } finally {
// //           setDeleteLoading(null);
// //         }
// //       }
// //     );
// //   };

// //   const updateStockInwardAfterOutward = async (modelNo, outwardQuantity, scannedBarcodes) => {
// //     try {
// //       const storeFilter = user?.role && user?.role !== 'admin' ? user.role.toLowerCase() : null;
// //       const inwardRecords = stockMovements.filter(movement => {
// //         const movementModelNo = movement.product || movement.modelNo;
// //         const storeMatch = storeFilter ? movement.storeName?.toLowerCase() === storeFilter : true;
// //         return movementModelNo === modelNo && storeMatch;
// //       });
// //       if (inwardRecords.length === 0) {
// //         console.warn(`No inward records found for model: ${modelNo}`);
// //         return;
// //       }
// //       let remainingQuantity = outwardQuantity;
// //       const barcodesToRemove = new Set(scannedBarcodes || []);
// //       const sortedInwardRecords = inwardRecords.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
// //       for (const record of sortedInwardRecords) {
// //         if (remainingQuantity <= 0 && barcodesToRemove.size === 0) break;
// //         const currentQuantity = record.quantity || 0;
// //         let currentBarcodes = [];
// //         if (record.scannedBarcode) {
// //           if (Array.isArray(record.scannedBarcode)) {
// //             currentBarcodes = [...record.scannedBarcode];
// //           } else if (typeof record.scannedBarcode === 'string') {
// //             currentBarcodes = record.scannedBarcode.split(',').map(b => b.trim()).filter(b => b);
// //           }
// //         }
// //         let updatedQuantity = currentQuantity;
// //         let updatedBarcodes = [...currentBarcodes];
// //         if (barcodesToRemove.size > 0) {
// //           const originalLength = updatedBarcodes.length;
// //           updatedBarcodes = updatedBarcodes.filter(barcode => !barcodesToRemove.has(barcode));
// //           const removedCount = originalLength - updatedBarcodes.length;
// //           if (removedCount > 0) {
// //             updatedQuantity = Math.max(0, updatedQuantity - removedCount);
// //             remainingQuantity = Math.max(0, remainingQuantity - removedCount);
// //           }
// //         }
// //         if (remainingQuantity > 0 && updatedQuantity > 0) {
// //           const quantityToReduce = Math.min(remainingQuantity, updatedQuantity);
// //           updatedQuantity = updatedQuantity - quantityToReduce;
// //           remainingQuantity = remainingQuantity - quantityToReduce;
// //         }
// //         const updateData = {
// //           quantity: updatedQuantity,
// //           scannedBarcode: updatedBarcodes.length > 0 ? updatedBarcodes : []
// //         };
// // The endpoint is mounted at / api / store - inward, and the route is / stock - inward /:id inside it
// //         const updateResponse = await fetch(`https://stockhandle.onrender.com/api/store-inward/stock-inward/${record._id}`, {
// //           method: 'PUT',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify(updateData),
// //         });
// //         if (!updateResponse.ok) {
// //           const errorText = await updateResponse.text();
// //           throw new Error(`Failed to update inward record: ${record._id} - ${errorText}`);
// //         }
// //       }
// //       await fetchStockMovements();
// //     } catch (error) {
// //       console.error('Error updating stock inward after outward:', error);
// //       throw error;
// //     }
// //   };

// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
// //   const paginate = (pageNumber) => setCurrentPage(pageNumber);

// //   const stats = React.useMemo(() => {
// //     const productMap = new Map();
// //     filteredMovements.forEach(item => {
// //       const model = item.product || item.modelNo;
// //       if (!model) return;
// //       const qty = Number(item.quantity) || 0;
// //       productMap.set(model, (productMap.get(model) || 0) + qty);
// //     });

// //     let totalItems = 0;
// //     let lowStock = 0;
// //     let outOfStock = 0;
// //     const totalProducts = productMap.size;

// //     for (const qty of productMap.values()) {
// //       totalItems += qty;
// //       if (qty === 0) outOfStock++;
// //       else if (qty < 5) lowStock++;
// //     }
// //     return { totalItems, totalProducts, lowStock, outOfStock };
// //   }, [filteredMovements]);

// //   const getBadgeStyle = (type) => ({
// //     padding: '4px 8px',
// //     borderRadius: '5px',
// //     fontSize: '12px',
// //     textTransform: 'uppercase',
// //     fontWeight: '500',
// //     textAlign: 'center',
// //     minWidth: '80px',
// //     display: 'inline-block',
// //     backgroundColor: '#dcfce7',
// //     color: '#166534'
// //   });

// //   const handleOutwardDialogOpen = () => {
// //     setShowOutwardDialog(true);
// //     setLines([makeEmptyLine()]);
// //     setLineErrors({});
// //     setGlobalScanned(new Set());
// //     setOutwardFormData({
// //       customerName: '',
// //       selectedCustomer: null,
// //       modelNo: '',
// //       quantity: 0,
// //       shd: '',
// //       scannedCodes: '',
// //       scannedList: [],
// //       price: 0,
// //       salePerson: '',
// //     });
// //   };

// //   const handleOutwardDialogClose = () => {
// //     setShowOutwardDialog(false);
// //     setOutwardError('');
// //   };

// //   const handleModelSelect = (idx, selectedModelNo) => {
// //     const selectedModel = availableModels.find(model => model.modelNo === selectedModelNo);
// //     if (selectedModel) {
// //       setLines(prev => {
// //         const next = [...prev];
// //         next[idx] = {
// //           ...next[idx],
// //           modelNo: selectedModel.modelNo,
// //           price: selectedModel.price,
// //           quantity: selectedModel.quantity,
// //           isQuantityManual: true
// //         };
// //         return next;
// //       });
// //     } else {
// //       setLines(prev => {
// //         const next = [...prev];
// //         next[idx] = {
// //           ...next[idx],
// //           modelNo: selectedModelNo,
// //           isQuantityManual: true
// //         };
// //         return next;
// //       });
// //     }
// //   };

// //   const setLineValue = (idx, field, value) => {
// //     setLines((prev) => {
// //       const next = [...prev];
// //       next[idx] = { ...next[idx], [field]: value };
// //       return next;
// //     });
// //     const key = `l${idx}_${field}`;
// //     if (lineErrors[key]) setLineErrors((e) => ({ ...e, [key]: '' }));
// //   };

// //   const handleScanKeyDown = (e, idx) => {
// //     if (!scannerBuffers.current[idx]) scannerBuffers.current[idx] = '';
// //     if (e.key === 'Enter') {
// //       e.preventDefault();
// //       const code = scannerBuffers.current[idx];
// //       if (code) {
// //         setLineValue(idx, 'shd', code);
// //         processBarcode(idx, code);
// //       }
// //       scannerBuffers.current[idx] = '';
// //       return;
// //     }
// //     if (e.key.length === 1) {
// //       scannerBuffers.current[idx] += e.key;
// //     }
// //     clearTimeout(scannerTimers.current[idx]);
// //     scannerTimers.current[idx] = setTimeout(() => {
// //       const code = scannerBuffers.current[idx];
// //       if (code) {
// //         setLineValue(idx, 'shd', code);
// //         processBarcode(idx, code);
// //       }
// //       scannerBuffers.current[idx] = '';
// //     }, 200);
// //   };

// //   const processBarcode = (idx, overrideRaw) => {
// //     const ln = lines[idx];
// //     if (!ln) return;
// //     const raw = (overrideRaw || ln?.shd || '').trim();
// //     if (!raw) return;
// //     if (!ln.modelNo) {
// //       showAlert('Error', 'Please select a Model No first');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_modelNo`]: 'Model No is required' }));
// //       return;
// //     }
// //     if (ln.scannedList?.includes(raw)) {
// //       showAlert('Error', 'This barcode is already scanned in this row');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in this row' }));
// //       setLineValue(idx, 'shd', '');
// //       return;
// //     }
// //     if (globalScanned.has(raw)) {
// //       showAlert('Error', 'This barcode is already scanned in another row');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in another row' }));
// //       setLineValue(idx, 'shd', '');
// //       return;
// //     }
// //     const cap = capForLine(ln);
// //     if (cap !== Infinity && (ln.scannedList?.length || 0) >= cap) {
// //       showAlert('Info', `Target reached: ${cap} scans for this row`);
// //       setLineValue(idx, 'shd', '');
// //       return;
// //     }
// //     const matched = findModelMatchInBarcode(ln.modelNo, raw);
// //     if (!matched) {
// //       showAlert('Error', 'Mismatch: No 5/4-char continuous segment from Model No found in barcode');
// //       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'Barcode mismatch with Model No' }));
// //       return;
// //     }
// //     const nextGlobal = new Set(globalScanned);
// //     nextGlobal.add(raw);
// //     setGlobalScanned(nextGlobal);
// //     setLines((prev) => {
// //       const arr = [...prev];
// //       const L = { ...arr[idx] };
// //       const _cap = capForLine(L);
// //       const currentLen = L.scannedList?.length || 0;
// //       if (_cap !== Infinity && currentLen >= _cap) {
// //         return arr;
// //       }
// //       const nextList = [...(L.scannedList || []), raw];
// //       if (_cap !== Infinity && nextList.length > _cap) {
// //         return arr;
// //       }
// //       L.scannedList = nextList;
// //       L.scannedCodes = nextList.join(', ');
// //       if (!L.isQuantityManual) L.quantity = nextList.length;
// //       L.shd = '';
// //       arr[idx] = L;
// //       return arr;
// //     });
// //     const left = remainingForLine({ ...ln, scannedList: [...(ln.scannedList || []), raw] });
// //     showAlert(
// //       'Success',
// //       left === Infinity
// //         ? `Accepted for ${ln.modelNo} (match: "${matched}")`
// //         : `Accepted (${ln.modelNo}). Remaining: ${left}`
// //     );
// //   };

// //   const validateForm = () => {
// //     const eLine = {};
// //     let ok = true;
// //     if (lines.length === 0) {
// //       showAlert('Error', 'Add at least one model row');
// //       ok = false;
// //     }
// //     lines.forEach((ln, i) => {
// //       const key = (f) => `l${i}_${f}`;
// //       if (!ln.modelNo) {
// //         eLine[key('modelNo')] = 'Model No is required';
// //         ok = false;
// //       }
// //       const qty = qtyForLine(ln);
// //       if (qty <= 0) {
// //         eLine[key('quantity')] = 'Enter a quantity > 0 or scan at least one code';
// //         ok = false;
// //       }
// //     });
// //     setLineErrors(eLine);
// //     return ok;
// //   };

// //   const handleOutwardSubmit = async () => {
// //     if (!validateForm()) {
// //       showAlert('Error', 'Please fix the errors before submitting!');
// //       return;
// //     }
// //     if (!outwardFormData.customerName || !outwardFormData.selectedCustomer) {
// //       showAlert('Error', 'Please select a customer!');
// //       return;
// //     }
// //     try {
// //       setLoading(true);
// //       const results = [];
// //       const inwardUpdates = [];

// //       console.log("Submitting Stock Outward...");

// //       for (const ln of lines) {
// //         if (!ln.modelNo || qtyForLine(ln) <= 0) continue;
// //         const outwardQuantity = qtyForLine(ln);
// //         const scannedBarcodes = ln.scannedList || [];

// //         const outwardData = {
// //           modelNo: ln.modelNo,
// //           quantity: outwardQuantity,
// //           reason: "Store Inward",
// //           userId: user?.id || "unknown-user",
// //           storeName: user?.role || "JAIPUR",
// //           customerName: outwardFormData.customerName,
// //           customerMobile: outwardFormData.selectedCustomer?.phoneNo || "",
// //           customerAddress: outwardFormData.selectedCustomer?.address || "",
// //           scannedCodes: ln.scannedCodes || "",
// //           scannedList: ln.scannedList || [],
// //           price: Number(ln.price) || 0,
// //           salePerson: ln.salePerson || "",
// //         };

// //         console.log("Payload:", outwardData);

// // Targeting LOCAL backend because the new 'stores-outward' route is not yet on the live server
// //         const response = await fetch('https://stockhandle.onrender.com/api/stores-outward', {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify(outwardData),
// //         });

// //         const result = await response.json();
// //         console.log("Response:", result);

// //         results.push(result);
// //         if (result.success) {
// //           inwardUpdates.push({
// //             modelNo: ln.modelNo,
// //             quantity: outwardQuantity,
// //             scannedBarcodes: scannedBarcodes
// //           });
// //         }
// //       }

// //       const allSuccess = results.every(result => result.success);
// //       if (allSuccess) {
// //         try {
// //           for (const update of inwardUpdates) {
// //             await updateStockInwardAfterOutward(update.modelNo, update.quantity, update.scannedBarcodes);
// //           }
// //           showAlert('Success', 'Stock outward successful! Stock inward records updated.');
// //           handleOutwardDialogClose();
// //           await fetchStockMovements();
// //         } catch (updateError) {
// //           console.error('Error updating inward records:', updateError);
// //           showAlert('Warning', 'Stock outward saved but there was an error updating inward records. Please check stock levels manually.');
// //           handleOutwardDialogClose();
// //           await fetchStockMovements();
// //         }
// //       } else {
// //         const errors = results.filter(result => !result.success).map(r => r.error);
// //         setOutwardError(`Some items failed: ${errors.join(', ')}`);
// //         showAlert('Error', `Some items failed to save: ${errors.join(', ')}`);
// //       }
// //     } catch (err) {
// //       console.error('Error submitting stock outward:', err);
// //       setOutwardError(err.message);
// //       showAlert('Error', `Error submitting stock outward: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const addLine = () => {
// //     setLines((prev) => {
// //       const next = [...prev, makeEmptyLine()];
// //       return next;
// //     });
// //   };

// //   const removeLine = (idx) => {
// //     setLines((prev) => {
// //       const target = prev[idx];
// //       if (target?.scannedList?.length) {
// //         const ns = new Set(globalScanned);
// //         target.scannedList.forEach((c) => ns.delete(c));
// //         setGlobalScanned(ns);
// //       }
// //       const next = prev.slice(0, idx).concat(prev.slice(idx + 1));
// //       return next.length ? next : [makeEmptyLine()];
// //     });
// //   };

// //   useEffect(() => {
// //     const fetchCustomerNames = async () => {
// //       if (!user?.role) return;
// //       setLoadingCustomers(true);
// //       try {
// //         const response = await fetch(`https://stockhandle.onrender.com/api/storecustomers?storeName=${user.role}`);
// //         const data = await response.json();
// //         setCustomerNames(data.data || []);
// //       } catch (error) {
// //         console.error('Error fetching customer data:', error);
// //       } finally {
// //         setLoadingCustomers(false);
// //       }
// //     };
// //     fetchCustomerNames();
// //   }, [user?.role]);

// //   const styles = {
// //     container: {
// //       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
// //       backgroundColor: '#f8fafc',
// //       minHeight: '100vh',
// //       padding: '24px',
// //     },
// //     header: {
// //       display: 'flex',
// //       alignItems: 'center',
// //       gap: '12px',
// //       marginBottom: '8px',
// //     },
// //     headerIcon: {
// //       width: '32px',
// //       height: '32px',
// //       color: '#3b82f6',
// //     },
// //     title: {
// //       fontSize: '28px',
// //       fontWeight: '700',
// //       color: '#1f2937',
// //       margin: 0,
// //       padding: '20px'
// //     },
// //     subtitle: {
// //       fontSize: '16px',
// //       color: '#6b7280',
// //       margin: '0 0 32px 44px',
// //     },
// //     tableContainer: {
// //       backgroundColor: 'white',
// //       borderRadius: '12px',
// //       boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
// //       border: '1px solid #e5e7eb',
// //       overflow: 'hidden',
// //     },
// //     table: {
// //       width: '100%',
// //       borderCollapse: 'collapse',
// //       textAlign: 'center',
// //     },
// //     tableHeader: {
// //       borderBottom: '1px solid #e5e7eb',
// //       backgroundColor: '#f9fafb',
// //     },
// //     th: {
// //       padding: '16px 24px',
// //       fontSize: '12px',
// //       fontWeight: '500',
// //       color: '#6b7280',
// //       textTransform: 'uppercase',
// //       letterSpacing: '0.05em',
// //     },
// //     thLast: {
// //       position: 'relative',
// //     },
// //     sortIcon: {
// //       position: 'absolute',
// //       right: '24px',
// //       top: '50%',
// //       transform: 'translateY(-50%)',
// //       width: '12px',
// //       height: '20px',
// //       color: '#9ca3af',
// //     },
// //     emptyState: {
// //       textAlign: 'center',
// //       padding: '80px 24px',
// //     },
// //     emptyIcon: {
// //       width: '64px',
// //       height: '64px',
// //       color: '#d1d5db',
// //       margin: '0 auto 24px',
// //     },
// //     emptyText: {
// //       fontSize: '16px',
// //       color: '#6b7280',
// //       margin: 0,
// //     },
// //     td: {
// //       padding: '16px 24px',
// //       borderBottom: '1px solid #f3f4f6',
// //       fontSize: '14px',
// //       color: '#374151',
// //     },
// //     deleteButton: {
// //       background: 'none',
// //       border: 'none',
// //       cursor: 'pointer',
// //       padding: '8px',
// //       borderRadius: '4px',
// //       transition: 'background-color 0.2s',
// //     },
// //     deleteButtonHover: {
// //       backgroundColor: '#fef2f2',
// //     },
// //     deleteIcon: {
// //       width: '18px',
// //       height: '18px',
// //       color: '#dc2626',
// //     },
// //     loadingIcon: {
// //       width: '18px',
// //       height: '18px',
// //       color: '#6b7280',
// //       animation: 'spin 1s linear infinite',
// //     },
// //   };

// //   if (loading) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>
// //           Loading stock inward movements...
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={styles.container}>
// //         <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#dc2626' }}>
// //           Error: {error}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={styles.container}>
// //       <AlertDialog
// //         open={alertOpen}
// //         onClose={() => setAlertOpen(false)}
// //         title={alertTitle}
// //         message={alertMessage}
// //         actions={alertActions}
// //       />
// //       <div style={styles.header}>
// //         <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //         </svg>
// //         <h1 style={styles.title}>Stock Inward Details</h1>
// //       </div>
// //       <p style={styles.subtitle}>
// //         {user?.role === 'admin'
// //           ? 'Showing all stock inward details'
// //           : `Showing stock inward details for ${user?.role}`}
// //       </p>
// //       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end' }}>
// //         <button
// //           onClick={handleOutwardDialogOpen}
// //           style={{
// //             padding: '8px 16px',
// //             backgroundColor: '#ef4444',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: 'pointer',
// //             display: 'flex',
// //             alignItems: 'center',
// //             gap: '8px',
// //           }}
// //         >
// //           <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
// //           </svg>
// //           Stock Outward
// //         </button>
// //       </div>

// //       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
// //         {/* Total Items */}
// //         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
// //             <svg style={{ width: '24px', height: '24px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
// //               <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
// //               <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
// //               <line x1="12" y1="22.08" x2="12" y2="12" />
// //             </svg>
// //             <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Total Items</h3>
// //           </div>
// //           <p style={{ fontSize: '36px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.totalItems}</p>
// //         </div>

// //         {/* Low Stock */}
// //         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
// //             <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="#dc2626" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L3.34 16.5c-.77.833.192 2.5 1.742 2.5z" />
// //             </svg>
// //             <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Low Stock</h3>
// //           </div>
// //           <p style={{ fontSize: '36px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.lowStock}</p>
// //         </div>

// //         {/* Products */}
// //         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
// //             <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
// //             </svg>
// //             <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Products</h3>
// //           </div>
// //           <p style={{ fontSize: '36px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.totalProducts}</p>
// //         </div>

// //         {/* Out of Stock */}
// //         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
// //             <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="#f59e0b" viewBox="0 0 24 24">
// //               {/* Currency/Rupee symbol generic representation or use the user's icon if possible. I'll use a generic coin stack or similar if I can't match exactly. The Image had a Rupee symbol actually. I'll use a Rupee icon. */}
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
// //             </svg>
// //             <h3 style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', margin: 0 }}>Out of Stock</h3>
// //           </div>
// //           <p style={{ fontSize: '36px', fontWeight: '700', color: '#1f2937', margin: 0 }}>{stats.outOfStock}</p>
// //         </div>
// //       </div>
// //       <div style={styles.tableContainer}>
// //         <h1 style={styles.title}>Stock Inward table</h1>
// //         {filteredMovements.length > 0 ? (
// //           <>
// //             <table style={styles.table}>
// //               <thead style={styles.tableHeader}>
// //                 <tr>
// //                   <th style={styles.th}>USER ID</th>
// //                   <th style={styles.th}>MODEL NO</th>
// //                   <th style={styles.th}>QUANTITY</th>
// //                   <th style={styles.th}>STORE NAME</th>
// //                   <th style={styles.th}>BARCODE</th>
// //                   <th style={styles.th}>PER UNIT PRICE</th>
// //                   <th style={styles.th}>DATE</th>
// //                   <th style={styles.th}>ACTIVITY</th>
// //                   <th style={styles.th}>ACTION</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {currentItems.map((movement, index) => (
// //                   <tr key={movement._id || index}>
// //                     <td style={styles.td}>{movement.userId || 'N/A'}</td>
// //                     <td style={styles.td}>{movement.product || movement.modelNo || 'N/A'}</td>
// //                     <td style={styles.td}>{movement.quantity || 'N/A'}</td>
// //                     <td style={styles.td}>{movement.storeName || 'N/A'}</td>
// //                     <td style={styles.td}>
// //                       {Array.isArray(movement.scannedBarcode)
// //                         ? movement.scannedBarcode.join(', ')
// //                         : movement.scannedBarcode || 'N/A'
// //                       }
// //                     </td>
// //                     <td style={styles.td}>{movement.pricePerUnit || 'N/A'}</td>
// //                     <td style={styles.td}>
// //                       {movement.createdAt ? new Date(movement.createdAt).toLocaleString() : 'N/A'}
// //                     </td>
// //                     <td style={styles.td}>
// //                       <span style={getBadgeStyle(movement.type)}>
// //                         STORE INWARD
// //                       </span>
// //                     </td>
// //                     <td style={styles.td}>
// //                       <button
// //                         onClick={() => handleDelete(movement)}
// //                         disabled={deleteLoading === movement._id}
// //                         style={{
// //                           ...styles.deleteButton,
// //                           ...(deleteLoading === movement._id ? {} : styles.deleteButtonHover)
// //                         }}
// //                         title="Delete this record"
// //                       >
// //                         {deleteLoading === movement._id ? (
// //                           <svg style={styles.loadingIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2m15.364-7.364l-2.828 2.828M7.464 17.536l-2.828 2.828m0-12.728l2.828 2.828m9.168 9.168l2.828 2.828" />
// //                           </svg>
// //                         ) : (
// //                           <svg style={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// //                           </svg>
// //                         )}
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
// //               <div style={{ fontSize: '14px', color: '#6b7280' }}>
// //                 Showing {filteredMovements.length} record{filteredMovements.length !== 1 ? 's' : ''}
// //               </div>
// //               <div style={{ display: 'flex', gap: '8px' }}>
// //                 {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((number) => (
// //                   <button
// //                     key={number}
// //                     onClick={() => paginate(number)}
// //                     style={{
// //                       padding: '8px 12px',
// //                       border: '1px solid #e5e7eb',
// //                       backgroundColor: currentPage === number ? '#3b82f6' : 'white',
// //                       color: currentPage === number ? 'white' : '#374151',
// //                       borderRadius: '4px',
// //                       cursor: 'pointer',
// //                     }}
// //                   >
// //                     {number}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           </>
// //         ) : (
// //           <div style={styles.emptyState}>
// //             <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //             </svg>
// //             <p style={styles.emptyText}>
// //               {user?.role === 'admin'
// //                 ? 'No stock inward details recorded'
// //                 : `No stock inward details recorded for ${user?.role}`}
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //       <Dialog open={showOutwardDialog} onClose={handleOutwardDialogClose} fullWidth maxWidth="md">
// //         <DialogTitle>Stock Outward</DialogTitle>
// //         <DialogContent>
// //           <Stack spacing={2} sx={{ mt: 2 }}>
// //             <FormControl fullWidth>
// //               <InputLabel>Customer Name *</InputLabel>
// //               <Select
// //                 value={outwardFormData.customerName}
// //                 onChange={(e) => {
// //                   const selectedCustomer = customerNames.find(c => c.customerName === e.target.value);
// //                   setOutwardFormData({
// //                     ...outwardFormData,
// //                     customerName: e.target.value,
// //                     selectedCustomer: selectedCustomer || null,
// //                   });
// //                 }}
// //                 label="Customer Name *"
// //                 disabled={loadingCustomers}
// //               >
// //                 {loadingCustomers ? (
// //                   <MenuItem disabled>Loading customers...</MenuItem>
// //                 ) : customerNames.length > 0 ? (
// //                   customerNames.map((customer, index) => (
// //                     <MenuItem key={index} value={customer.customerName}>
// //                       {customer.customerName} ({customer.phoneNo})
// //                     </MenuItem>
// //                   ))
// //                 ) : (
// //                   <MenuItem disabled>No customers found</MenuItem>
// //                 )}
// //               </Select>
// //             </FormControl>
// //             {outwardFormData.selectedCustomer && (
// //               <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
// //                 <Typography variant="subtitle1" fontWeight="bold">
// //                   Customer Details
// //                 </Typography>
// //                 <Typography variant="body2">
// //                   <strong>Mobile:</strong> {outwardFormData.selectedCustomer.phoneNo}
// //                 </Typography>
// //                 <Typography variant="body2">
// //                   <strong>Address:</strong> {outwardFormData.selectedCustomer.address}
// //                 </Typography>
// //               </Paper>
// //             )}
// //             {lines.map((ln, idx) => (
// //               <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
// //                 <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
// //                   <Typography fontWeight={600}>Model #{idx + 1}</Typography>
// //                   <IconButton color="error" onClick={() => removeLine(idx)} disabled={lines.length === 1}>
// //                     <DeleteIcon />
// //                   </IconButton>
// //                 </Stack>
// //                 <Grid container spacing={2}>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <FormControl fullWidth error={!!lineErrors[`l${idx}_modelNo`]}>
// //                       <InputLabel>Model No *</InputLabel>
// //                       <Select
// //                         value={ln.modelNo || ''}
// //                         onChange={(e) => handleModelSelect(idx, e.target.value)}
// //                         label="Model No *"
// //                         disabled={loadingModels}
// //                       >
// //                         {loadingModels ? (
// //                           <MenuItem disabled>Loading models...</MenuItem>
// //                         ) : availableModels.length > 0 ? (
// //                           availableModels.map((model, modelIndex) => (
// //                             <MenuItem key={modelIndex} value={model.modelNo}>
// //                               {model.modelNo}
// //                               {model.price > 0 && ` (Price: ${model.price})`}
// //                               {model.quantity > 0 && ` (Qty: ${model.quantity})`}
// //                             </MenuItem>
// //                           ))
// //                         ) : (
// //                           <MenuItem disabled>
// //                             {filteredMovements.length > 0
// //                               ? 'No models found in current store'
// //                               : 'No models available'
// //                             }
// //                           </MenuItem>
// //                         )}
// //                       </Select>
// //                       {lineErrors[`l${idx}_modelNo`] && (
// //                         <FormHelperText>{lineErrors[`l${idx}_modelNo`]}</FormHelperText>
// //                       )}
// //                       {!loadingModels && availableModels.length === 0 && (
// //                         <FormHelperText>
// //                           {filteredMovements.length > 0
// //                             ? 'No models found for your store. Check if models have proper product/modelNo fields.'
// //                             : 'No stock inward data available.'
// //                           }
// //                         </FormHelperText>
// //                       )}
// //                     </FormControl>
// //                   </Grid>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <TextField
// //                       label="Quantity *"
// //                       type="number"
// //                       fullWidth
// //                       value={ln.quantity}
// //                       onChange={(e) => {
// //                         const val = Number(e.target.value);
// //                         setLineValue(idx, 'isQuantityManual', true);
// //                         setLineValue(idx, 'quantity', e.target.value);
// //                       }}
// //                       error={!!lineErrors[`l${idx}_quantity`]}
// //                       helperText={lineErrors[`l${idx}_quantity`] || 'Typed value caps how many barcodes you can scan for this row'}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <TextField
// //                       label="Price"
// //                       type="number"
// //                       fullWidth
// //                       value={ln.price || ''}
// //                       onChange={(e) => setLineValue(idx, 'price', e.target.value)}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12} sm={6} md={6}>
// //                     <TextField
// //                       label="Sale Person"
// //                       fullWidth
// //                       value={ln.salePerson || ''}
// //                       onChange={(e) => setLineValue(idx, 'salePerson', e.target.value)}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12} md={8}>
// //                     <TextField
// //                       label="Scan barcode"
// //                       fullWidth
// //                       value={ln.shd}
// //                       onChange={(e) => setLineValue(idx, 'shd', e.target.value)}
// //                       onKeyDown={(e) => handleScanKeyDown(e, idx)}
// //                       error={!!lineErrors[`l${idx}_shd`]}
// //                       helperText={
// //                         lineErrors[`l${idx}_shd`] ||
// //                         'Barcode must include any continuous 5 or 4 chars from Model No'
// //                       }
// //                       inputRef={(el) => (shdRefs.current[idx] = el)}
// //                       disabled={remainingForLine(ln) === 0}
// //                     />
// //                   </Grid>
// //                   <Grid item xs={12}>
// //                     <TextField
// //                       label="Scanned Codes"
// //                       fullWidth
// //                       multiline
// //                       rows={3}
// //                       value={ln.scannedCodes}
// //                       InputProps={{ readOnly: true }}
// //                     />
// //                     <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
// //                       Total scanned: {ln.scannedList.length}
// //                       {remainingForLine(ln) !== Infinity && ` | Remaining: ${remainingForLine(ln)}`}
// //                     </Typography>
// //                   </Grid>
// //                 </Grid>
// //               </Paper>
// //             ))}
// //             <Button
// //               variant="outlined"
// //               startIcon={<AddIcon />}
// //               onClick={addLine}
// //               color="primary"
// //             >
// //               Add Model
// //             </Button>
// //           </Stack>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleOutwardDialogClose} color="primary">
// //             Cancel
// //           </Button>
// //           <Button onClick={handleOutwardSubmit} color="primary" disabled={loading}>
// //             {loading ? 'Processing...' : 'Submit'}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </div>
// //   );
// // }

// // export default History;


// // src/Pages/StoreInward.js
// import React, { useState, useEffect, useRef } from 'react';
// import { useUser } from './UserContext';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   IconButton,
//   TextField,
//   Typography,
//   MenuItem,
//   Grid,
//   Paper,
//   Stack,
//   FormControl,
//   InputLabel,
//   Select,
//   FormHelperText,
//   Pagination,
// } from '@mui/material';

// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import SyncAltIcon from '@mui/icons-material/SyncAlt';
// import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search';

// const API_BASE = 'https://stockhandle.onrender.com/api';

// const makeEmptyLine = () => ({
//   modelNo: '',
//   salePerson: '',
//   quantity: 0,
//   price: 0,
//   shd: '',
//   scannedCodes: '',
//   scannedList: [],
//   isQuantityManual: false,
//   lowStockWarning: '',
//   category: '',
//   subCategory: '',
//   availableBarcodes: [],
// });

// const sanitize = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

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

// const capForLine = (ln) => {
//   const q = Number(ln.quantity);
//   if (ln.isQuantityManual && Number.isFinite(q) && q > 0) return q;
//   return Infinity;
// };

// const remainingForLine = (ln) => {
//   const cap = capForLine(ln);
//   if (cap === Infinity) return Infinity;
//   return Math.max(0, cap - (ln.scannedList?.length || 0));
// };

// const qtyForLine = (ln) => {
//   const manual = Number(ln.quantity);
//   if (!Number.isNaN(manual) && manual > 0) return manual;
//   return ln.scannedList?.length || 0;
// };

// const AlertDialog = ({ open, onClose, title, message, actions }) => (
//   <Dialog open={open} onClose={onClose}>
//     <DialogTitle>{title}</DialogTitle>
//     <DialogContent>
//       <Typography>{message}</Typography>
//     </DialogContent>
//     <DialogActions>
//       {actions || (
//         <Button onClick={onClose} color="primary" autoFocus>
//           OK
//         </Button>
//       )}
//     </DialogActions>
//   </Dialog>
// );

// function History() {
//   const { user } = useUser();

//   const [stockMovements, setStockMovements] = useState([]);
//   const [filteredMovements, setFilteredMovements] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [deleteLoading, setDeleteLoading] = useState(null);

//   // pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // outward dialog
//   const [showOutwardDialog, setShowOutwardDialog] = useState(false);
//   const [outwardError, setOutwardError] = useState('');
//   const [lines, setLines] = useState([makeEmptyLine()]);
//   const [lineErrors, setLineErrors] = useState({});
//   const [globalScanned, setGlobalScanned] = useState(new Set());

//   // customers/models
//   const [customerNames, setCustomerNames] = useState([]);
//   const [loadingCustomers, setLoadingCustomers] = useState(false);

//   const [availableModels, setAvailableModels] = useState([]);
//   const [loadingModels, setLoadingModels] = useState(false);

//   // edit/transfer
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [showTransferDialog, setShowTransferDialog] = useState(false);

//   const [transferFormData, setTransferFormData] = useState({
//     inwardId: '',
//     modelNo: '',
//     fromOwner: '',
//     toOwner: '',
//     quantity: 0,
//     transferMethod: '',
//     description: '',
//     category: '',
//     subCategory: '',
//     productPrice: 0,
//     scannedList: [],
//     scannedBarcode: '',
//     availableBarcodes: [],
//   });

//   const [editFormData, setEditFormData] = useState({
//     id: '',
//     modelNo: '',
//     quantity: 0,
//     scannedBarcode: '',
//     category: '',
//     subCategory: '',
//     owner: '',
//   });

//   const [outwardFormData, setOutwardFormData] = useState({
//     customerName: '',
//     selectedCustomer: null,
//   });

//   // alert popup
//   const [alertOpen, setAlertOpen] = useState(false);
//   const [alertTitle, setAlertTitle] = useState('');
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertActions, setAlertActions] = useState(null);

//   // filters/search
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchCategoryQuery, setSearchCategoryQuery] = useState('');
//   const [ownerFilter, setOwnerFilter] = useState('');

//   // search model popup
//   const [searchResult, setSearchResult] = useState(null);
//   const [showSearchDialog, setShowSearchDialog] = useState(false);

//   // categories
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);

//   // scanner buffers
//   const shdRefs = useRef({});
//   const scannerBuffers = useRef({});
//   const scannerTimers = useRef({});
//   const transferScannerBuffer = useRef('');
//   const transferScannerTimer = useRef(null);

//   const showAlert = (title, message, actions = null) => {
//     setAlertTitle(title);
//     setAlertMessage(message);
//     setAlertActions(actions);
//     setAlertOpen(true);
//   };

//   const showConfirm = (title, message, onConfirm) => {
//     showAlert(
//       title,
//       message,
//       <>
//         <Button onClick={() => setAlertOpen(false)} color="primary">
//           Cancel
//         </Button>
//         <Button
//           onClick={() => {
//             setAlertOpen(false);
//             onConfirm();
//           }}
//           color="primary"
//           autoFocus
//         >
//           OK
//         </Button>
//       </>
//     );
//   };

//   // ===== API calls =====
//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/categories`);
//       const data = await response.json();
//       setCategories(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error('Error fetching categories:', e);
//       setCategories([]);
//     }
//   };

//   const fetchSubCategories = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/subcategories`);
//       const data = await response.json();
//       setSubCategories(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error('Error fetching subcategories:', e);
//       setSubCategories([]);
//     }
//   };

//   const fetchStockMovements = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const inwardResponse = await fetch(`${API_BASE}/store-inward`);
//       if (!inwardResponse.ok) {
//         throw new Error(`HTTP error! status: ${inwardResponse.status}`);
//       }

//       const inwardData = await inwardResponse.json();
//       const inwardMovements = Array.isArray(inwardData)
//         ? inwardData
//         : inwardData?.movements || inwardData?.data || [];

//       const allMovements = inwardMovements.map((m) => ({ ...m, type: 'inward' }));

//       setStockMovements(allMovements);

//       // filter by role
//       if (user?.role && user?.role !== 'admin') {
//         const filtered = allMovements.filter(
//           (mv) => mv.storeName?.toLowerCase() === user.role?.toLowerCase()
//         );
//         setFilteredMovements(filtered);
//       } else {
//         setFilteredMovements(allMovements);
//       }
//     } catch (err) {
//       setError(err?.message || 'Failed to fetch stock inward');
//       console.error('Error fetching stock movements:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableModels = async () => {
//     if (!user?.role) return;

//     setLoadingModels(true);
//     try {
//       // use already fetched movements
//       let modelsData = stockMovements;

//       // if empty, fetch again
//       if (!modelsData || modelsData.length === 0) {
//         const response = await fetch(`${API_BASE}/store-inward`);
//         if (!response.ok) throw new Error('Failed to fetch models');
//         const data = await response.json();
//         modelsData = Array.isArray(data) ? data : data?.movements || data?.data || [];
//       }

//       let filtered = modelsData;
//       if (user?.role && user?.role !== 'admin') {
//         filtered = modelsData.filter(
//           (m) => m.storeName?.toLowerCase() === user.role?.toLowerCase()
//         );
//       }

//       const modelMap = new Map();

//       filtered.forEach((movement) => {
//         const modelNo = movement.product || movement.modelNo;
//         if (!modelNo) return;

//         if (!modelMap.has(modelNo)) {
//           modelMap.set(modelNo, {
//             modelNo,
//             price: movement.pricePerUnit || movement.price || 0,
//             quantity: movement.quantity || 0,
//             storeName: movement.storeName || '',
//             inwardId: movement._id,
//             category: movement.category || '',
//             subCategory: movement.subCategory || '',
//             scannedBarcode: movement.scannedBarcode || [],
//           });
//         }
//       });

//       setAvailableModels(Array.from(modelMap.values()));
//     } catch (e) {
//       console.error('Error fetching models:', e);
//       setAvailableModels([]);
//     } finally {
//       setLoadingModels(false);
//     }
//   };

//   // ===== initial load =====
//   useEffect(() => {
//     if (user?._id || user?.id) {
//       fetchStockMovements();
//       fetchCategories();
//       fetchSubCategories();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?._id, user?.id, user?.role]);

//   // ===== filter logic =====
//   useEffect(() => {
//     if (!stockMovements) return;

//     let filtered = [...stockMovements];

//     // role filter
//     if (user?.role && user?.role !== 'admin') {
//       filtered = filtered.filter(
//         (mv) => mv.storeName?.toLowerCase() === user.role?.toLowerCase()
//       );
//     }

//     // model search
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       filtered = filtered.filter((m) =>
//         (m.product || m.modelNo || '').toLowerCase().includes(q)
//       );
//     }

//     // category search
//     if (searchCategoryQuery) {
//       const q = searchCategoryQuery.toLowerCase();
//       filtered = filtered.filter((m) => (m.category || '').toLowerCase().includes(q));
//     }

//     // owner filter
//     if (ownerFilter) {
//       const q = ownerFilter.toLowerCase();
//       filtered = filtered.filter((m) => (m.owner || '').toLowerCase().includes(q));
//     }

//     setFilteredMovements(filtered);
//     setCurrentPage(1);
//   }, [stockMovements, searchQuery, searchCategoryQuery, ownerFilter, user?.role]);

//   // ===== customers load =====
//   useEffect(() => {
//     const fetchCustomerNames = async () => {
//       if (!user?.role) return;

//       setLoadingCustomers(true);
//       try {
//         const response = await fetch(
//           `${API_BASE}/storecustomers?storeName=${encodeURIComponent(user.role)}`
//         );
//         const data = await response.json();
//         setCustomerNames(data?.data || []);
//       } catch (e) {
//         console.error('Error fetching customer data:', e);
//         setCustomerNames([]);
//       } finally {
//         setLoadingCustomers(false);
//       }
//     };

//     fetchCustomerNames();
//   }, [user?.role]);

//   // refresh models when outward dialog opens
//   useEffect(() => {
//     if (showOutwardDialog) fetchAvailableModels();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [showOutwardDialog]);

//   // ===== stats =====
//   const stats = React.useMemo(() => {
//     const productMap = new Map();
//     filteredMovements.forEach((item) => {
//       const model = item.product || item.modelNo;
//       if (!model) return;
//       const qty = Number(item.quantity) || 0;
//       productMap.set(model, (productMap.get(model) || 0) + qty);
//     });

//     let totalItems = 0;
//     let lowStock = 0;
//     let outOfStock = 0;
//     const totalProducts = productMap.size;

//     for (const qty of productMap.values()) {
//       totalItems += qty;
//       if (qty === 0) outOfStock++;
//       else if (qty < 5) lowStock++;
//     }

//     return { totalItems, totalProducts, lowStock, outOfStock };
//   }, [filteredMovements]);

//   const getBadgeStyle = () => ({
//     padding: '4px 8px',
//     borderRadius: '5px',
//     fontSize: '12px',
//     textTransform: 'uppercase',
//     fontWeight: '500',
//     textAlign: 'center',
//     minWidth: '80px',
//     display: 'inline-block',
//     backgroundColor: '#dcfce7',
//     color: '#166534',
//   });

//   // ===== paging =====
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.max(1, Math.ceil(filteredMovements.length / itemsPerPage));
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // ===== actions =====
//   const handleOutwardDialogOpen = () => {
//     setShowOutwardDialog(true);
//     setLines([makeEmptyLine()]);
//     setLineErrors({});
//     setGlobalScanned(new Set());
//     setOutwardError('');
//     setOutwardFormData({ customerName: '', selectedCustomer: null });
//   };

//   const handleOutwardDialogClose = () => {
//     setShowOutwardDialog(false);
//     setOutwardError('');
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

//   const handleModelSelect = (idx, selectedModelNo) => {
//     const selectedModel = availableModels.find((m) => m.modelNo === selectedModelNo);

//     setLines((prev) => {
//       const next = [...prev];
//       if (selectedModel) {
//         const availableBarcodes = Array.isArray(selectedModel.scannedBarcode)
//           ? selectedModel.scannedBarcode.map((b) => String(b).trim()).filter(Boolean)
//           : typeof selectedModel.scannedBarcode === 'string'
//             ? selectedModel.scannedBarcode.split(',').map((b) => b.trim()).filter(Boolean)
//             : [];

//         next[idx] = {
//           ...next[idx],
//           modelNo: selectedModel.modelNo,
//           price: selectedModel.price,
//           quantity: selectedModel.quantity,
//           category: selectedModel.category,
//           subCategory: selectedModel.subCategory,
//           isQuantityManual: true,
//           availableBarcodes,
//         };
//       } else {
//         next[idx] = { ...next[idx], modelNo: selectedModelNo, isQuantityManual: true };
//       }
//       return next;
//     });
//   };

//   const addLine = () => {
//     setLines((prev) => [...prev, makeEmptyLine()]);
//   };

//   const removeLine = (idx) => {
//     setLines((prev) => {
//       const target = prev[idx];
//       if (target?.scannedList?.length) {
//         setGlobalScanned((gs) => {
//           const ns = new Set(gs);
//           target.scannedList.forEach((c) => ns.delete(c));
//           return ns;
//         });
//       }
//       const next = prev.slice(0, idx).concat(prev.slice(idx + 1));
//       return next.length ? next : [makeEmptyLine()];
//     });
//   };

//   const handleSearchModel = () => {
//     if (!searchQuery.trim()) return;
//     const query = searchQuery.trim().toLowerCase();

//     const matches = filteredMovements.filter((item) => {
//       const p = (item.product || item.modelNo || '').toLowerCase();
//       return p === query;
//     });

//     const totalQty = matches.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

//     setSearchResult({
//       model: searchQuery,
//       count: matches.length,
//       totalQuantity: totalQty,
//     });
//     setShowSearchDialog(true);
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
//       showAlert('Error', 'Please select a Model No first');
//       setLineErrors((e) => ({ ...e, [`l${idx}_modelNo`]: 'Model No is required' }));
//       return;
//     }

//     if (ln.scannedList?.includes(raw)) {
//       showAlert('Error', 'This barcode is already scanned in this row');
//       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in this row' }));
//       setLineValue(idx, 'shd', '');
//       return;
//     }

//     if (globalScanned.has(raw)) {
//       showAlert('Error', 'This barcode is already scanned in another row');
//       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in another row' }));
//       setLineValue(idx, 'shd', '');
//       return;
//     }

//     const cap = capForLine(ln);
//     if (cap !== Infinity && (ln.scannedList?.length || 0) >= cap) {
//       showAlert('Info', `Target reached: ${cap} scans for this row`);
//       setLineValue(idx, 'shd', '');
//       return;
//     }

//     // check exists in available stock
//     if (ln.availableBarcodes && ln.availableBarcodes.length > 0) {
//       if (!ln.availableBarcodes.includes(raw)) {
//         showAlert('Error', "Scanned barcode not found in this product's available stock");
//         setLineValue(idx, 'shd', '');
//         return;
//       }
//     }

//     const matched = findModelMatchInBarcode(ln.modelNo, raw);
//     if (!matched) {
//       showAlert('Error', 'Mismatch: No 5/4-char continuous segment from Model No found in barcode');
//       setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'Barcode mismatch with Model No' }));
//       return;
//     }

//     setGlobalScanned((gs) => {
//       const ns = new Set(gs);
//       ns.add(raw);
//       return ns;
//     });

//     setLines((prev) => {
//       const arr = [...prev];
//       const L = { ...arr[idx] };
//       const _cap = capForLine(L);
//       const currentLen = L.scannedList?.length || 0;
//       if (_cap !== Infinity && currentLen >= _cap) return arr;

//       const nextList = [...(L.scannedList || []), raw];
//       if (_cap !== Infinity && nextList.length > _cap) return arr;

//       L.scannedList = nextList;
//       L.scannedCodes = nextList.join(', ');
//       if (!L.isQuantityManual) L.quantity = nextList.length;
//       L.shd = '';
//       arr[idx] = L;
//       return arr;
//     });

//     const left = remainingForLine({ ...ln, scannedList: [...(ln.scannedList || []), raw] });

//     showAlert(
//       'Success',
//       left === Infinity
//         ? `Accepted for ${ln.modelNo} (match: "${matched}")`
//         : `Accepted (${ln.modelNo}). Remaining: ${left}`
//     );
//   };

//   const validateForm = () => {
//     const eLine = {};
//     let ok = true;

//     if (lines.length === 0) {
//       showAlert('Error', 'Add at least one model row');
//       return false;
//     }

//     lines.forEach((ln, i) => {
//       const key = (f) => `l${i}_${f}`;

//       if (!ln.modelNo) {
//         eLine[key('modelNo')] = 'Model No is required';
//         ok = false;
//       }

//       const qty = qtyForLine(ln);
//       if (qty <= 0) {
//         eLine[key('quantity')] = 'Enter a quantity > 0 or scan at least one code';
//         ok = false;
//       }

//       if (!ln.price || Number(ln.price) <= 0) {
//         eLine[key('price')] = 'Price is required';
//         ok = false;
//       }

//       if (!ln.salePerson || !ln.salePerson.trim()) {
//         eLine[key('salePerson')] = 'Sale Person is required';
//         ok = false;
//       }

//       if (!ln.scannedList || ln.scannedList.length === 0) {
//         eLine[key('shd')] = 'At least one barcode must be scanned';
//         ok = false;
//       } else if ((ln.scannedList?.length || 0) !== qty) {
//         eLine[key('scannedCodes')] = `Scanned count (${ln.scannedList?.length || 0}) must match Quantity (${qty})`;
//         ok = false;
//       }
//     });

//     setLineErrors(eLine);
//     return ok;
//   };

//   const updateStockInwardAfterOutward = async (modelNo, outwardQuantity, scannedBarcodes) => {
//     const storeFilter = user?.role && user?.role !== 'admin' ? user.role.toLowerCase() : null;

//     const inwardRecords = stockMovements.filter((movement) => {
//       const movementModelNo = movement.product || movement.modelNo;
//       const storeMatch = storeFilter ? movement.storeName?.toLowerCase() === storeFilter : true;
//       return movementModelNo === modelNo && storeMatch;
//     });

//     if (inwardRecords.length === 0) return;

//     let remainingQuantity = outwardQuantity;
//     const barcodesToRemove = new Set(scannedBarcodes || []);
//     const sorted = inwardRecords.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//     for (const record of sorted) {
//       if (remainingQuantity <= 0 && barcodesToRemove.size === 0) break;

//       const currentQuantity = record.quantity || 0;

//       let currentBarcodes = [];
//       if (record.scannedBarcode) {
//         if (Array.isArray(record.scannedBarcode)) currentBarcodes = [...record.scannedBarcode];
//         else if (typeof record.scannedBarcode === 'string') {
//           currentBarcodes = record.scannedBarcode.split(',').map((b) => b.trim()).filter(Boolean);
//         }
//       }

//       let updatedQuantity = currentQuantity;
//       let updatedBarcodes = [...currentBarcodes];

//       if (barcodesToRemove.size > 0) {
//         const before = updatedBarcodes.length;
//         updatedBarcodes = updatedBarcodes.filter((b) => !barcodesToRemove.has(b));
//         const removed = before - updatedBarcodes.length;

//         if (removed > 0) {
//           updatedQuantity = Math.max(0, updatedQuantity - removed);
//           remainingQuantity = Math.max(0, remainingQuantity - removed);
//         }
//       }

//       if (remainingQuantity > 0 && updatedQuantity > 0) {
//         const reduce = Math.min(remainingQuantity, updatedQuantity);
//         updatedQuantity -= reduce;
//         remainingQuantity -= reduce;
//       }

//       const updateData = {
//         quantity: updatedQuantity,
//         scannedBarcode: updatedBarcodes,
//       };

//       const updateResponse = await fetch(`${API_BASE}/store-inward/stock-inward/${record._id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updateData),
//       });

//       if (!updateResponse.ok) {
//         const errorText = await updateResponse.text();
//         throw new Error(`Failed to update inward record: ${record._id} - ${errorText}`);
//       }
//     }

//     // Removal of redundant fetchStockMovements() here to avoid excessive updates.
//     // The caller (handleOutwardSubmit) already calls it after all items are processed.
//   };

//   const handleOutwardSubmit = async () => {
//     if (!validateForm()) {
//       showAlert('Error', 'Please fix the errors before submitting!');
//       return;
//     }

//     if (!outwardFormData.customerName || !outwardFormData.selectedCustomer) {
//       showAlert('Error', 'Please select a customer!');
//       return;
//     }

//     try {
//       setLoading(true);
//       const results = [];
//       const inwardUpdates = [];

//       for (const ln of lines) {
//         if (!ln.modelNo || qtyForLine(ln) <= 0) continue;

//         const outwardQuantity = qtyForLine(ln);
//         const scannedBarcodes = ln.scannedList || [];

//         const outwardData = {
//           modelNo: ln.modelNo,
//           quantity: outwardQuantity,
//           reason: 'Store Inward',
//           userId: user?._id || user?.id || 'unknown-user',
//           storeName: user?.role || 'ADMIN',
//           customerName: outwardFormData.customerName,
//           customerMobile: outwardFormData.selectedCustomer?.phoneNo || '',
//           customerAddress: outwardFormData.selectedCustomer?.address || '',
//           scannedCodes: ln.scannedCodes || '',
//           scannedList: ln.scannedList || [],
//           price: Number(ln.price) || 0,
//           salePerson: ln.salePerson || '',
//           category: ln.category || '',
//           subCategory: ln.subCategory || '',
//         };

//         const response = await fetch(`${API_BASE}/stores-outward`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(outwardData),
//         });

//         const result = await response.json();
//         results.push(result);

//         if (result?.success) {
//           inwardUpdates.push({
//             modelNo: ln.modelNo,
//             quantity: outwardQuantity,
//             scannedBarcodes,
//           });
//         }
//       }

//       const allSuccess = results.every((r) => r?.success);
//       if (allSuccess) {
//         try {
//           for (const update of inwardUpdates) {
//             await updateStockInwardAfterOutward(update.modelNo, update.quantity, update.scannedBarcodes);
//           }
//           showAlert('Success', 'Stock outward successful! Stock inward records updated.');
//           handleOutwardDialogClose();
//           await fetchStockMovements();
//         } catch (updateError) {
//           console.error('Error updating inward records:', updateError);
//           handleOutwardDialogClose();
//           await fetchStockMovements();
//         }
//       } else {
//         const errors = results.filter((r) => !r?.success).map((r) => r?.error).filter(Boolean);
//         setOutwardError(`Some items failed: ${errors.join(', ')}`);
//         showAlert('Error', `Some items failed to save: ${errors.join(', ')}`);
//       }
//     } catch (err) {
//       console.error('Error submitting stock outward:', err);
//       setOutwardError(err?.message || 'Submit failed');
//       showAlert('Error', `Error submitting stock outward: ${err?.message || 'Submit failed'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditOpen = (movement) => {
//     setEditFormData({
//       id: movement._id,
//       modelNo: movement.product || movement.modelNo || '',
//       quantity: movement.quantity || 0,
//       scannedBarcode: Array.isArray(movement.scannedBarcode)
//         ? movement.scannedBarcode.join(', ')
//         : movement.scannedBarcode || '',
//       category: movement.category || '',
//       subCategory: movement.subCategory || 'None',
//       owner: movement.owner || '',
//     });
//     setShowEditDialog(true);
//   };

//   const handleEditClose = () => {
//     setShowEditDialog(false);
//     setEditFormData({ id: '', modelNo: '', quantity: 0, scannedBarcode: '', category: '', subCategory: '', owner: '' });
//   };

//   const handleEditSubmit = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(`${API_BASE}/store-inward/stock-inward/${editFormData.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           quantity: Number(editFormData.quantity),
//           scannedBarcode: editFormData.scannedBarcode,
//           category: editFormData.category,
//           subCategory: editFormData.subCategory,
//           owner: editFormData.owner,
//         }),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const result = await response.json();
//       if (result?.success) {
//         showAlert('Success', 'Stock inward record updated successfully!');
//         handleEditClose();
//         fetchStockMovements();
//       } else {
//         throw new Error(result?.error || 'Failed to update record');
//       }
//     } catch (err) {
//       console.error('Error updating stock movement:', err);
//       showAlert('Error', `Error updating record: ${err?.message || 'Update failed'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTransferOpen = (movement) => {
//     const availableBarcodes = Array.isArray(movement.scannedBarcode)
//       ? movement.scannedBarcode.map((b) => String(b).trim()).filter(Boolean)
//       : typeof movement.scannedBarcode === 'string'
//         ? movement.scannedBarcode.split(',').map((b) => b.trim()).filter(Boolean)
//         : [];

//     setTransferFormData({
//       inwardId: movement._id,
//       modelNo: movement.product || movement.modelNo || '',
//       fromOwner: movement.owner || 'N/A',
//       toOwner: '',
//       quantity: movement.quantity || 0,
//       transferMethod: '',
//       description: '',
//       category: movement.category || '',
//       subCategory: movement.subCategory || '',
//       productPrice: movement.pricePerUnit || 0,
//       scannedList: [],
//       scannedBarcode: '',
//       availableBarcodes,
//     });

//     setShowTransferDialog(true);
//   };

//   const handleTransferClose = () => setShowTransferDialog(false);

//   const processTransferBarcode = (overrideRaw) => {
//     const raw = (overrideRaw || transferFormData.scannedBarcode || '').trim();
//     if (!raw) return;

//     if (!transferFormData.modelNo) {
//       showAlert('Error', 'Model No is missing');
//       return;
//     }

//     if (transferFormData.scannedList.includes(raw)) {
//       showAlert('Error', 'This barcode is already scanned');
//       setTransferFormData((p) => ({ ...p, scannedBarcode: '' }));
//       return;
//     }

//     const limit = Number(transferFormData.quantity);
//     if (limit > 0 && transferFormData.scannedList.length >= limit) {
//       showAlert('Info', `Quantity limit reached: ${limit}`);
//       setTransferFormData((p) => ({ ...p, scannedBarcode: '' }));
//       return;
//     }

//     // validate barcode exists in original stock
//     if (transferFormData.availableBarcodes.length > 0) {
//       if (!transferFormData.availableBarcodes.includes(raw)) {
//         showAlert('Error', 'Scanned barcode not found in this stock record');
//         setTransferFormData((p) => ({ ...p, scannedBarcode: '' }));
//         return;
//       }
//     }

//     setTransferFormData((prev) => ({
//       ...prev,
//       scannedList: [...prev.scannedList, raw],
//       scannedBarcode: '',
//     }));
//   };

//   const handleTransferScanKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       const code = transferScannerBuffer.current;
//       if (code) processTransferBarcode(code);
//       transferScannerBuffer.current = '';
//       return;
//     }

//     if (e.key.length === 1) transferScannerBuffer.current += e.key;

//     clearTimeout(transferScannerTimer.current);
//     transferScannerTimer.current = setTimeout(() => {
//       const code = transferScannerBuffer.current;
//       if (code) processTransferBarcode(code);
//       transferScannerBuffer.current = '';
//     }, 200);
//   };

//   const handleTransferSubmit = async () => {
//     if (!transferFormData.toOwner || !transferFormData.quantity || !transferFormData.transferMethod) {
//       showAlert('Error', 'Please fill all required fields');
//       return;
//     }

//     // enforce scanned count equals quantity
//     const q = Number(transferFormData.quantity) || 0;
//     if (q > 0 && transferFormData.scannedList.length !== q) {
//       showAlert('Error', `Scanned count (${transferFormData.scannedList.length}) must match Quantity (${q})`);
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         ...transferFormData,
//         scannedBarcode: transferFormData.scannedList,
//         userId: user?._id || user?.id || 'system',
//         storeName: user?.role || 'Admin',
//       };

//       const response = await fetch(`${API_BASE}/self-transfer`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const result = await response.json();
//       if (result?.success) {
//         showAlert('Success', 'Stock transferred successfully! Original inward record updated.');
//         handleTransferClose();
//         fetchStockMovements();
//       } else {
//         throw new Error(result?.error || 'Failed to transfer stock');
//       }
//     } catch (err) {
//       console.error('Error during self transfer:', err);
//       showAlert('Error', `Transfer failed: ${err?.message || 'Transfer failed'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (movement) => {
//     showConfirm(
//       'Confirm Delete',
//       `Are you sure you want to delete this stock inward record?\n\nModel: ${movement.modelNo || movement.product}\nQuantity: ${movement.quantity}\nStore: ${movement.storeName}`,
//       async () => {
//         try {
//           setDeleteLoading(movement._id);

//           const response = await fetch(`${API_BASE}/store-inward/${movement._id}`, {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' },
//           });

//           if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//           const result = await response.json();
//           if (result?.success) {
//             setFilteredMovements((prev) => prev.filter((item) => item._id !== movement._id));
//             setStockMovements((prev) => prev.filter((item) => item._id !== movement._id));
//             showAlert('Success', 'Stock inward record deleted successfully!');
//           } else {
//             throw new Error(result?.error || 'Failed to delete record');
//           }
//         } catch (err) {
//           console.error('Error deleting stock movement:', err);
//           showAlert('Error', `Error deleting record: ${err?.message || 'Delete failed'}`);
//         } finally {
//           setDeleteLoading(null);
//         }
//       }
//     );
//   };

//   // ===== styles =====
//   const styles = {
//     container: {
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       backgroundColor: '#f8fafc',
//       minHeight: '100vh',
//       padding: '24px',
//     },
//     header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
//     headerIcon: { width: '32px', height: '32px', color: '#3b82f6' },
//     title: { fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0, padding: '20px' },
//     subtitle: { fontSize: '16px', color: '#6b7280', margin: '0 0 32px 44px' },
//     tableContainer: {
//       backgroundColor: 'white',
//       borderRadius: '12px',
//       boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//       border: '1px solid #e5e7eb',
//       overflow: 'hidden',
//     },
//     table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center' },
//     tableHeader: { borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' },
//     th: {
//       padding: '16px 24px',
//       fontSize: '12px',
//       fontWeight: '500',
//       color: '#6b7280',
//       textTransform: 'uppercase',
//       letterSpacing: '0.05em',
//       whiteSpace: 'nowrap',
//     },
//     td: { padding: '16px 24px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151' },
//     deleteButton: {
//       background: 'none',
//       border: '1px solid #e5e7eb',
//       cursor: 'pointer',
//       padding: '8px',
//       borderRadius: '8px',
//       transition: 'background-color 0.2s',
//     },
//     deleteButtonHover: { backgroundColor: '#fef2f2' },
//     deleteIcon: { width: '18px', height: '18px', color: '#dc2626' },
//     loadingIcon: { width: '18px', height: '18px', color: '#6b7280' },
//     emptyState: { textAlign: 'center', padding: '80px 24px' },
//     emptyIcon: { width: '64px', height: '64px', color: '#d1d5db', margin: '0 auto 24px' },
//     emptyText: { fontSize: '16px', color: '#6b7280', margin: 0 },
//   };

//   // ===== UI states =====
//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>
//           Loading stock inward movements...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.container}>
//         <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#dc2626' }}>
//           Error: {error}
//         </div>
//       </div>
//     );
//   }

//   // ===== render =====
//   return (
//     <div style={styles.container}>
//       <AlertDialog
//         open={alertOpen}
//         onClose={() => setAlertOpen(false)}
//         title={alertTitle}
//         message={alertMessage}
//         actions={alertActions}
//       />

//       <div style={styles.header}>
//         <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//         <h1 style={styles.title}>Stock Inward Details</h1>
//       </div>

//       <p style={styles.subtitle}>
//         {user?.role === 'admin'
//           ? 'Showing all stock inward details'
//           : `Showing stock inward details for ${user?.role}`}
//       </p>

//       {/* top actions */}
//       <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end', alignItems: 'center' }}>
//         <button
//           onClick={handleOutwardDialogOpen}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: '#ef4444',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//           }}
//         >
//           <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           Stock Outward
//         </button>

//         {user?.role === 'CCTV Shoppee Avadi' && (
//           <FormControl sx={{ minWidth: 220 }} size="small">
//             <InputLabel id="owner-filter-label">Filter by Owner</InputLabel>
//             <Select
//               labelId="owner-filter-label"
//               value={ownerFilter}
//               label="Filter by Owner"
//               onChange={(e) => setOwnerFilter(e.target.value)}
//               sx={{ backgroundColor: 'white', borderRadius: '8px' }}
//             >
//               <MenuItem value=""><em>All Owners</em></MenuItem>
//               <MenuItem value="CCTV Shoppee Avadi">CCTV Shoppee Avadi</MenuItem>
//               <MenuItem value="Lookman CCTV Avadi">Lookman CCTV Avadi</MenuItem>
//             </Select>
//           </FormControl>
//         )}

//         <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250, height: 40 }}>
//           <TextField
//             variant="standard"
//             placeholder="Search Category"
//             value={searchCategoryQuery}
//             onChange={(e) => setSearchCategoryQuery(e.target.value)}
//             InputProps={{ disableUnderline: true }}
//             sx={{ ml: 1, flex: 1 }}
//           />
//           <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
//             <SearchIcon />
//           </IconButton>
//         </Paper>

//         <Paper
//           component="form"
//           sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250, height: 40 }}
//           onSubmit={(e) => { e.preventDefault(); handleSearchModel(); }}
//         >
//           <TextField
//             variant="standard"
//             placeholder="Search Model No"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             InputProps={{ disableUnderline: true }}
//             sx={{ ml: 1, flex: 1 }}
//           />
//           <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchModel}>
//             <SearchIcon />
//           </IconButton>
//         </Paper>
//       </div>

//       {/* stat cards */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
//         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
//           <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Items</h3>
//           <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>{stats.totalItems}</p>
//         </div>
//         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
//           <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Low Stock</h3>
//           <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>{stats.lowStock}</p>
//         </div>
//         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
//           <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Products</h3>
//           <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>{stats.totalProducts}</p>
//         </div>
//         <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
//           <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Out of Stock</h3>
//           <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>{stats.outOfStock}</p>
//         </div>
//       </div>

//       {/* table */}
//       <div style={styles.tableContainer}>
//         <h1 style={styles.title}>Stock Inward Table</h1>

//         {filteredMovements.length > 0 ? (
//           <>
//             <table style={styles.table}>
//               <thead style={styles.tableHeader}>
//                 <tr>
//                   <th style={styles.th}>USER ID</th>
//                   <th style={styles.th}>MODEL NO</th>
//                   <th style={styles.th}>CATEGORY</th>
//                   <th style={styles.th}>SUB CATEGORY</th>
//                   {user?.role === 'CCTV Shoppee Avadi' && <th style={styles.th}>OWNER</th>}
//                   <th style={styles.th}>QUANTITY</th>
//                   <th style={styles.th}>STORE NAME</th>
//                   <th style={styles.th}>BARCODE</th>
//                   <th style={styles.th}>PER UNIT PRICE</th>
//                   <th style={styles.th}>DATE</th>
//                   <th style={styles.th}>ACTIVITY</th>
//                   <th style={styles.th}>ACTION</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentItems.map((movement, index) => (
//                   <tr key={movement._id || index}>
//                     <td style={styles.td}>{movement.userId || 'N/A'}</td>
//                     <td style={styles.td}>{movement.product || movement.modelNo || 'N/A'}</td>
//                     <td style={styles.td}>{movement.category || 'N/A'}</td>
//                     <td style={styles.td}>{movement.subCategory || 'N/A'}</td>
//                     {user?.role === 'CCTV Shoppee Avadi' && <td style={styles.td}>{movement.owner || 'N/A'}</td>}
//                     <td style={styles.td}>{movement.quantity ?? 'N/A'}</td>
//                     <td style={styles.td}>{movement.storeName || 'N/A'}</td>
//                     <td style={styles.td}>
//                       {Array.isArray(movement.scannedBarcode)
//                         ? movement.scannedBarcode.join(', ')
//                         : movement.scannedBarcode || 'N/A'}
//                     </td>
//                     <td style={styles.td}>{movement.pricePerUnit ?? movement.price ?? 'N/A'}</td>
//                     <td style={styles.td}>
//                       {movement.createdAt ? new Date(movement.createdAt).toLocaleString() : 'N/A'}
//                     </td>
//                     <td style={styles.td}>
//                       <span style={getBadgeStyle(movement.type)}>STORE INWARD</span>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
//                         {user?.role === 'CCTV Shoppee Avadi' && (
//                           <button
//                             onClick={() => handleTransferOpen(movement)}
//                             style={{ ...styles.deleteButton, backgroundColor: '#f0fdf4', color: '#16a34a' }}
//                             title="Self Transfer"
//                           >
//                             <SyncAltIcon sx={{ fontSize: 18 }} />
//                           </button>
//                         )}
  
//                           <button
//                             onClick={() => handleEditOpen(movement)}
//                             style={{ ...styles.deleteButton, backgroundColor: '#eff6ff', color: '#2563eb' }}
//                             title="Edit this record"
//                           >
//                             <EditIcon sx={{ fontSize: 18 }} />
//                           </button>

//                         <button
//                           onClick={() => handleDelete(movement)}
//                           disabled={deleteLoading === movement._id}
//                           style={{
//                             ...styles.deleteButton,
//                             backgroundColor: '#fef2f2',
//                             opacity: deleteLoading === movement._id ? 0.6 : 1,
//                           }}
//                           title="Delete this record"
//                         >
//                           {deleteLoading === movement._id ? (
//                             <span style={{ fontSize: 12 }}>...</span>
//                           ) : (
//                             <DeleteIcon sx={{ fontSize: 18 }} />
//                           )}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
//               <div style={{ fontSize: '14px', color: '#6b7280' }}>
//                 Showing {filteredMovements.length} record{filteredMovements.length !== 1 ? 's' : ''}
//               </div>

//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 onChange={(e, value) => paginate(value)}
//                 color="primary"
//                 variant="outlined"
//                 shape="rounded"
//                 size="small"
//               />
//             </div>
//           </>
//         ) : (
//           <div style={styles.emptyState}>
//             <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <p style={styles.emptyText}>
//               {user?.role === 'admin'
//                 ? 'No stock inward details recorded'
//                 : `No stock inward details recorded for ${user?.role}`}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* ===== Stock Outward Dialog ===== */}
//       <Dialog open={showOutwardDialog} onClose={handleOutwardDialogClose} fullWidth maxWidth="md">
//         <DialogTitle>Stock Outward</DialogTitle>
//         <DialogContent>
//           <Stack spacing={2} sx={{ mt: 2 }}>
//             <FormControl fullWidth>
//               <InputLabel>Customer Name *</InputLabel>
//               <Select
//                 value={outwardFormData.customerName}
//                 onChange={(e) => {
//                   const selectedCustomer = customerNames.find((c) => c.customerName === e.target.value);
//                   setOutwardFormData({
//                     customerName: e.target.value,
//                     selectedCustomer: selectedCustomer || null,
//                   });
//                 }}
//                 label="Customer Name *"
//                 disabled={loadingCustomers}
//               >
//                 {loadingCustomers ? (
//                   <MenuItem disabled>Loading customers...</MenuItem>
//                 ) : customerNames.length > 0 ? (
//                   customerNames.map((customer, index) => (
//                     <MenuItem key={index} value={customer.customerName}>
//                       {customer.customerName} ({customer.phoneNo})
//                     </MenuItem>
//                   ))
//                 ) : (
//                   <MenuItem disabled>No customers found</MenuItem>
//                 )}
//               </Select>
//             </FormControl>

//             {outwardFormData.selectedCustomer && (
//               <Paper variant="outlined" sx={{ p: 2 }}>
//                 <Typography variant="subtitle1" fontWeight="bold">Customer Details</Typography>
//                 <Typography variant="body2"><strong>Mobile:</strong> {outwardFormData.selectedCustomer.phoneNo}</Typography>
//                 <Typography variant="body2"><strong>Address:</strong> {outwardFormData.selectedCustomer.address}</Typography>
//               </Paper>
//             )}

//             {lines.map((ln, idx) => (
//               <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
//                 <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
//                   <Typography fontWeight={600}>Model #{idx + 1}</Typography>
//                   <IconButton color="error" onClick={() => removeLine(idx)} disabled={lines.length === 1}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </Stack>

//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={6} md={6}>
//                     <FormControl fullWidth error={!!lineErrors[`l${idx}_modelNo`]}>
//                       <InputLabel>Model No *</InputLabel>
//                       <Select
//                         value={ln.modelNo || ''}
//                         onChange={(e) => handleModelSelect(idx, e.target.value)}
//                         label="Model No *"
//                         disabled={loadingModels}
//                       >
//                         {loadingModels ? (
//                           <MenuItem disabled>Loading models...</MenuItem>
//                         ) : availableModels.length > 0 ? (
//                           availableModels.map((model, i) => (
//                             <MenuItem key={i} value={model.modelNo}>
//                               {model.modelNo}
//                               {model.price > 0 && ` (Price: ${model.price})`}
//                               {model.quantity > 0 && ` (Qty: ${model.quantity})`}
//                             </MenuItem>
//                           ))
//                         ) : (
//                           <MenuItem disabled>No models available</MenuItem>
//                         )}
//                       </Select>

//                       {lineErrors[`l${idx}_modelNo`] && (
//                         <FormHelperText>{lineErrors[`l${idx}_modelNo`]}</FormHelperText>
//                       )}
//                     </FormControl>
//                   </Grid>

//                   {ln.modelNo && (
//                     <>
//                       <Grid item xs={12} sm={6} md={3}>
//                         <TextField label="Category" fullWidth value={ln.category || ''} InputProps={{ readOnly: true }} variant="filled" />
//                       </Grid>
//                       <Grid item xs={12} sm={6} md={3}>
//                         <TextField label="Sub Category" fullWidth value={ln.subCategory || ''} InputProps={{ readOnly: true }} variant="filled" />
//                       </Grid>
//                     </>
//                   )}

//                   <Grid item xs={12} sm={6} md={6}>
//                     <TextField
//                       label="Quantity *"
//                       type="number"
//                       fullWidth
//                       value={ln.quantity}
//                       onChange={(e) => {
//                         setLineValue(idx, 'isQuantityManual', true);
//                         setLineValue(idx, 'quantity', e.target.value);
//                       }}
//                       error={!!lineErrors[`l${idx}_quantity`]}
//                       helperText={lineErrors[`l${idx}_quantity`] || 'Typed value caps how many barcodes you can scan for this row'}
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6} md={6}>
//                     <TextField
//                       label="Price *"
//                       type="number"
//                       fullWidth
//                       value={ln.price || ''}
//                       onChange={(e) => setLineValue(idx, 'price', e.target.value)}
//                       error={!!lineErrors[`l${idx}_price`]}
//                       helperText={lineErrors[`l${idx}_price`]}
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6} md={6}>
//                     <TextField
//                       label="Sale Person *"
//                       fullWidth
//                       value={ln.salePerson || ''}
//                       onChange={(e) => setLineValue(idx, 'salePerson', e.target.value)}
//                       error={!!lineErrors[`l${idx}_salePerson`]}
//                       helperText={lineErrors[`l${idx}_salePerson`]}
//                     />
//                   </Grid>

//                   <Grid item xs={12} md={8}>
//                     <TextField
//                       label="Scan barcode *"
//                       fullWidth
//                       value={ln.shd}
//                       onChange={(e) => setLineValue(idx, 'shd', e.target.value)}
//                       onKeyDown={(e) => handleScanKeyDown(e, idx)}
//                       error={!!lineErrors[`l${idx}_shd`]}
//                       helperText={
//                         lineErrors[`l${idx}_shd`] ||
//                         'Barcode must include any continuous 5 or 4 chars from Model No'
//                       }
//                       inputRef={(el) => (shdRefs.current[idx] = el)}
//                       disabled={remainingForLine(ln) === 0}
//                     />
//                   </Grid>

//                   <Grid item xs={12}>
//                     <TextField
//                       label="Scanned Codes"
//                       fullWidth
//                       multiline
//                       rows={3}
//                       value={ln.scannedCodes}
//                       InputProps={{ readOnly: true }}
//                       required
//                       error={!!lineErrors[`l${idx}_scannedCodes`]}
//                       helperText={lineErrors[`l${idx}_scannedCodes`]}
//                     />
//                     <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
//                       Total scanned: {ln.scannedList.length}
//                       {remainingForLine(ln) !== Infinity && ` | Remaining: ${remainingForLine(ln)}`}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             ))}

//             <Button variant="outlined" startIcon={<AddIcon />} onClick={addLine}>
//               Add Model
//             </Button>

//             {outwardError ? (
//               <Typography color="error" variant="body2">{outwardError}</Typography>
//             ) : null}
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleOutwardDialogClose} color="inherit">
//             Cancel
//           </Button>
//           <Button onClick={handleOutwardSubmit} variant="contained" color="primary" disabled={loading}>
//             {loading ? 'Processing...' : 'Submit'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ===== Edit Dialog ===== */}
//       <Dialog open={showEditDialog} onClose={handleEditClose} fullWidth maxWidth="sm">
//         <DialogTitle>Edit Stock Inward</DialogTitle>
//         <DialogContent>
//           <Stack spacing={3} sx={{ mt: 2 }}>
//             <TextField label="Model No" fullWidth value={editFormData.modelNo} InputProps={{ readOnly: true }} variant="filled" />

//             <TextField
//               label="Quantity"
//               type="number"
//               fullWidth
//               value={editFormData.quantity}
//               onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
//             />

//             <FormControl fullWidth>
//               <InputLabel>Category</InputLabel>
//               <Select
//                 value={editFormData.category}
//                 label="Category"
//                 onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
//               >
//                 {categories.map((cat) => (
//                   <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl fullWidth>
//               <InputLabel>Sub Category</InputLabel>
//               <Select
//                 value={editFormData.subCategory}
//                 label="Sub Category"
//                 onChange={(e) => setEditFormData({ ...editFormData, subCategory: e.target.value })}
//               >
//                 <MenuItem value="None">None</MenuItem>
//                 {subCategories.map((sub) => (
//                   <MenuItem key={sub._id} value={sub.name}>{sub.name}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {user?.role === 'CCTV Shoppee Avadi' && (
//               <FormControl fullWidth>
//                 <InputLabel>Owner</InputLabel>
//                 <Select
//                   value={editFormData.owner}
//                   label="Owner"
//                   onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
//                 >
//                   <MenuItem value="CCTV Shoppee Avadi.">CCTV Shoppee Avadi.</MenuItem>
//                   <MenuItem value="Lookman CCTV Avadi.">Lookman CCTV Avadi.</MenuItem>
//                 </Select>
//               </FormControl>
//             )}

//             <TextField
//               label="Barcodes (comma separated)"
//               fullWidth
//               multiline
//               rows={4}
//               value={editFormData.scannedBarcode}
//               onChange={(e) => setEditFormData({ ...editFormData, scannedBarcode: e.target.value })}
//               helperText="Edit barcodes for this model"
//             />
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleEditClose} color="inherit">Cancel</Button>
//           <Button onClick={handleEditSubmit} variant="contained" color="primary" startIcon={<SaveIcon />} disabled={loading}>
//             {loading ? 'Saving...' : 'Save Changes'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ===== Transfer Dialog ===== */}
//       <Dialog open={showTransferDialog} onClose={handleTransferClose} fullWidth maxWidth="sm">
//         <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Self Stock Transfer</DialogTitle>
//         <DialogContent>
//           <Stack spacing={3} sx={{ mt: 2 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField label="Model No" fullWidth value={transferFormData.modelNo} InputProps={{ readOnly: true }} variant="filled" />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField label="From Owner" fullWidth value={transferFormData.fromOwner} InputProps={{ readOnly: true }} variant="filled" />
//               </Grid>
//             </Grid>

//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField label="Category" fullWidth value={transferFormData.category} InputProps={{ readOnly: true }} variant="filled" />
//               </Grid>
//               <Grid item xs={6}>
//                 <TextField label="Product Price" fullWidth value={transferFormData.productPrice} InputProps={{ readOnly: true }} variant="filled" />
//               </Grid>
//             </Grid>

//             <TextField label="Sub Category" fullWidth value={transferFormData.subCategory} InputProps={{ readOnly: true }} variant="filled" />

//             <FormControl fullWidth required>
//               <InputLabel>To Owner</InputLabel>
//               <Select
//                 value={transferFormData.toOwner}
//                 label="To Owner"
//                 onChange={(e) => setTransferFormData({ ...transferFormData, toOwner: e.target.value })}
//               >
//                 <MenuItem value="CCTV Shoppee Avadi.">CCTV Shoppee Avadi.</MenuItem>
//                 <MenuItem value="Lookman CCTV Avadi.">Lookman CCTV Avadi.</MenuItem>
//               </Select>
//             </FormControl>

//             <TextField
//               label="Quantity to Transfer"
//               type="number"
//               fullWidth
//               required
//               value={transferFormData.quantity}
//               onChange={(e) =>
//                 setTransferFormData({ ...transferFormData, quantity: Math.min(Number(e.target.value), 999999) })
//               }
//               helperText="Set quantity, then scan same number of barcodes"
//             />

//             <FormControl fullWidth required>
//               <InputLabel>Transfer Method</InputLabel>
//               <Select
//                 value={transferFormData.transferMethod}
//                 label="Transfer Method"
//                 onChange={(e) => setTransferFormData({ ...transferFormData, transferMethod: e.target.value })}
//               >
//                 <MenuItem value="In Hand">In Hand</MenuItem>
//                 <MenuItem value="Courier">Courier</MenuItem>
//                 <MenuItem value="Others">Others</MenuItem>
//               </Select>
//             </FormControl>

//             <TextField
//               label="Description"
//               fullWidth
//               multiline
//               rows={3}
//               value={transferFormData.description}
//               onChange={(e) => setTransferFormData({ ...transferFormData, description: e.target.value })}
//               placeholder="Add any transfer notes..."
//             />

//             <TextField
//               label="Scan Barcode"
//               fullWidth
//               value={transferFormData.scannedBarcode}
//               onChange={(e) => setTransferFormData({ ...transferFormData, scannedBarcode: e.target.value })}
//               onKeyDown={handleTransferScanKeyDown}
//               helperText="Scan barcode and press Enter"
//             />

//             <TextField
//               label="Scanned Codes"
//               fullWidth
//               multiline
//               rows={3}
//               value={transferFormData.scannedList.join(', ')}
//               InputProps={{ readOnly: true }}
//               helperText={`Total scanned: ${transferFormData.scannedList.length}`}
//             />
//           </Stack>
//         </DialogContent>

//         <DialogActions sx={{ pb: 3, px: 3 }}>
//           <Button onClick={handleTransferClose} color="inherit" variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleTransferSubmit} variant="contained" color="success" startIcon={<SyncAltIcon />} disabled={loading}>
//             {loading ? 'Processing...' : 'Submit Transfer'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ===== Search Result Popup ===== */}
//       <Dialog open={showSearchDialog} onClose={() => setShowSearchDialog(false)}>
//         <DialogTitle>Search Result</DialogTitle>
//         <DialogContent>
//           {searchResult && (
//             <div style={{ padding: '20px', textAlign: 'center' }}>
//               <Typography variant="h6" gutterBottom>
//                 Model: {searchResult.model}
//               </Typography>
//               <Typography variant="body1">
//                 Total Quantity Found: <strong>{searchResult.totalQuantity}</strong>
//               </Typography>
//               <Typography variant="caption" color="textSecondary">
//                 (Found in {searchResult.count} records)
//               </Typography>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowSearchDialog(false)} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// export default History;




// src/Pages/StoreInward.js
import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../Components/Spinner';
import { useUser } from './UserContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Pagination,
  CircularProgress,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const API_BASE = 'https://stockhandle-taxr.onrender.com/api';

const makeEmptyLine = () => ({
  modelNo: '',
  salePerson: '',
  quantity: 0,
  price: 0,
  shd: '',
  scannedCodes: '',
  scannedList: [],
  isQuantityManual: false,
  lowStockWarning: '',
  category: '',
  subCategory: '',
  availableBarcodes: [],
});

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

const capForLine = (ln) => {
  const q = Number(ln.quantity);
  if (ln.isQuantityManual && Number.isFinite(q) && q > 0) return q;
  return Infinity;
};

const remainingForLine = (ln) => {
  const cap = capForLine(ln);
  if (cap === Infinity) return Infinity;
  return Math.max(0, cap - (ln.scannedList?.length || 0));
};

const qtyForLine = (ln) => {
  const manual = Number(ln.quantity);
  if (!Number.isNaN(manual) && manual > 0) return manual;
  return ln.scannedList?.length || 0;
};

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

const AlertDialog = ({ open, onClose, title, message, actions }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{message}</Typography>
    </DialogContent>
    <DialogActions>
      {actions || (
        <Button onClick={onClose} color="primary" autoFocus>
          OK
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

function History() {
  const { user } = useUser();

  const [stockMovements, setStockMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // outward dialog
  const [showOutwardDialog, setShowOutwardDialog] = useState(false);
  const [outwardError, setOutwardError] = useState('');

  // inward dialog
  const [showInwardDialog, setShowInwardDialog] = useState(false);
  const [inwardError, setInwardError] = useState('');
  const [existingBarcodesMap, setExistingBarcodesMap] = useState({});
  const [productList, setProductList] = useState([]);
  const [lines, setLines] = useState([makeEmptyLine()]);
  const [lineErrors, setLineErrors] = useState({});
  const [globalScanned, setGlobalScanned] = useState(new Set());

  // customers/models
  const [customerNames, setCustomerNames] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // edit/transfer
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  const [transferFormData, setTransferFormData] = useState({
    inwardId: '',
    modelNo: '',
    fromOwner: '',
    toOwner: '',
    quantity: 0,
    transferMethod: '',
    description: '',
    category: '',
    subCategory: '',
    productPrice: 0,
    scannedList: [],
    scannedBarcode: '',
    availableBarcodes: [],
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    modelNo: '',
    quantity: 0,
    scannedBarcode: '',
    category: '',
    subCategory: '',
    owner: '',
  });

  const [outwardFormData, setOutwardFormData] = useState({
    customerName: '',
    selectedCustomer: null,
  });

  // alert popup
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertActions, setAlertActions] = useState(null);

  // filters/search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategoryQuery, setSearchCategoryQuery] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');

  // search model popup
  const [searchResult, setSearchResult] = useState(null);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  // categories
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // scanner buffers
  const shdRefs = useRef({});
  const scannerBuffers = useRef({});
  const scannerTimers = useRef({});
  const transferScannerBuffer = useRef('');
  const transferScannerTimer = useRef(null);
  // always-fresh ref to lines (fixes stale-closure bug in barcode callbacks)
  const linesRef = useRef(lines);
  useEffect(() => { linesRef.current = lines; }, [lines]);

  const showAlert = (title, message, actions = null) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertActions(actions);
    setAlertOpen(true);
  };

  const showConfirm = (title, message, onConfirm) => {
    showAlert(
      title,
      message,
      <>
        <Button onClick={() => setAlertOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setAlertOpen(false);
            onConfirm();
          }}
          color="primary"
          autoFocus
        >
          OK
        </Button>
      </>
    );
  };

  // ===== API calls =====
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching categories:', e);
      setCategories([]);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/subcategories`);
      const data = await response.json();
      setSubCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching subcategories:', e);
      setSubCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      setProductList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching products:', e);
      setProductList([]);
    }
  };

  const fetchStockMovements = async () => {
    try {
      setLoading(true);
      setError(null);

      const inwardResponse = await fetch(`${API_BASE}/store-inward`);
      if (!inwardResponse.ok) {
        throw new Error(`HTTP error! status: ${inwardResponse.status}`);
      }

      const inwardData = await inwardResponse.json();
      const inwardMovements = Array.isArray(inwardData)
        ? inwardData
        : inwardData?.movements || inwardData?.data || [];

      const allMovements = inwardMovements.map((m) => ({ ...m, type: 'inward' }));

      setStockMovements(allMovements);

      // filter by role
      if (user?.role && user?.role !== 'admin') {
        const filtered = allMovements.filter(
          (mv) => mv.storeName?.toLowerCase() === user.role?.toLowerCase()
        );
        setFilteredMovements(filtered);
      } else {
        setFilteredMovements(allMovements);
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch stock inward');
      console.error('Error fetching stock movements:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableModels = async () => {
    if (!user?.role) return;

    setLoadingModels(true);
    try {
      // use already fetched movements
      let modelsData = stockMovements;

      // if empty, fetch again
      if (!modelsData || modelsData.length === 0) {
        const response = await fetch(`${API_BASE}/store-inward`);
        if (!response.ok) throw new Error('Failed to fetch models');
        const data = await response.json();
        modelsData = Array.isArray(data) ? data : data?.movements || data?.data || [];
      }

      let filtered = modelsData;
      if (user?.role && user?.role !== 'admin') {
        filtered = modelsData.filter(
          (m) => m.storeName?.toLowerCase() === user.role?.toLowerCase()
        );
      }

      const modelMap = new Map();

      filtered.forEach((movement) => {
        const modelNo = movement.product || movement.modelNo;
        if (!modelNo) return;

        if (!modelMap.has(modelNo)) {
          modelMap.set(modelNo, {
            modelNo,
            price: movement.pricePerUnit || movement.price || 0,
            quantity: movement.quantity || 0,
            storeName: movement.storeName || '',
            inwardId: movement._id,
            category: movement.category || '',
            subCategory: movement.subCategory || '',
            scannedBarcode: movement.scannedBarcode || [],
          });
        }
      });

      setAvailableModels(Array.from(modelMap.values()));
    } catch (e) {
      console.error('Error fetching models:', e);
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  // ===== initial load =====
  useEffect(() => {
    if (user?._id || user?.id) {
      fetchStockMovements();
      fetchCategories();
      fetchSubCategories();
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.id, user?.role]);

  // ===== filter logic =====
  useEffect(() => {
    if (!stockMovements) return;

    let filtered = [...stockMovements];

    // role filter
    if (user?.role && user?.role !== 'admin') {
      filtered = filtered.filter(
        (mv) => mv.storeName?.toLowerCase() === user.role?.toLowerCase()
      );
    }

    // model search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((m) =>
        (m.product || m.modelNo || '').toLowerCase().includes(q)
      );
    }

    // category search
    if (searchCategoryQuery) {
      const q = searchCategoryQuery.toLowerCase();
      filtered = filtered.filter((m) => (m.category || '').toLowerCase().includes(q));
    }

    // owner filter
    if (ownerFilter) {
      const q = ownerFilter.toLowerCase();
      filtered = filtered.filter((m) => (m.owner || '').toLowerCase().includes(q));
    }

    setFilteredMovements(filtered);
    setCurrentPage(1);
  }, [stockMovements, searchQuery, searchCategoryQuery, ownerFilter, user?.role]);

  // ===== customers load =====
  useEffect(() => {
    const fetchCustomerNames = async () => {
      if (!user?.role) return;

      setLoadingCustomers(true);
      try {
        const response = await fetch(
          `${API_BASE}/storecustomers?storeName=${encodeURIComponent(user.role)}`
        );
        const data = await response.json();
        setCustomerNames(data?.data || []);
      } catch (e) {
        console.error('Error fetching customer data:', e);
        setCustomerNames([]);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomerNames();
  }, [user?.role]);

  // refresh models when outward dialog opens
  useEffect(() => {
    if (showOutwardDialog) fetchAvailableModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOutwardDialog]);

  // ===== stats =====
  const stats = React.useMemo(() => {
    const productMap = new Map();
    filteredMovements.forEach((item) => {
      const model = item.product || item.modelNo;
      if (!model) return;
      const qty = Number(item.quantity) || 0;
      productMap.set(model, (productMap.get(model) || 0) + qty);
    });

    let totalItems = 0;
    let lowStock = 0;
    let outOfStock = 0;
    const totalProducts = productMap.size;

    for (const qty of productMap.values()) {
      totalItems += qty;
      if (qty === 0) outOfStock++;
      else if (qty < 5) lowStock++;
    }

    return { totalItems, totalProducts, lowStock, outOfStock };
  }, [filteredMovements]);

  const getBadgeStyle = () => ({
    padding: '4px 8px',
    borderRadius: '5px',
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '500',
    textAlign: 'center',
    minWidth: '80px',
    display: 'inline-block',
    backgroundColor: '#dcfce7',
    color: '#166534',
  });

  // ===== paging =====
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredMovements.length / itemsPerPage));
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ===== actions =====
  const handleOutwardDialogOpen = () => {
    setShowOutwardDialog(true);
    setLines([makeEmptyLine()]);
    setLineErrors({});
    setGlobalScanned(new Set());
    setOutwardError('');
    setOutwardFormData({ customerName: '', selectedCustomer: null });
  };

  const handleOutwardDialogClose = () => {
    setShowOutwardDialog(false);
    setOutwardError('');
  };

  const handleInwardDialogOpen = async () => {
    setShowInwardDialog(true);
    setLines([makeEmptyLine()]);
    setLineErrors({});
    setGlobalScanned(new Set());
    setExistingBarcodesMap({});

    try {
      const currentStore = user?.role ? user.role.toLowerCase().trim() : '';

      const [dispatchRes, storeInwardRes] = await Promise.all([
        fetch(`${API_BASE}/dispatch`).then(r => r.json()),
        fetch(`${API_BASE}/store-inward`).then(r => r.json())
      ]);

      const map = {};

      if (Array.isArray(dispatchRes)) {
        dispatchRes.forEach((disp) => {
          const matchesStore = currentStore && disp.storeName && disp.storeName.toLowerCase().trim() === currentStore;
          if (matchesStore && disp.barcodes) {
            const codes = Array.isArray(disp.barcodes)
              ? disp.barcodes
              : (typeof disp.barcodes === 'string' ? disp.barcodes.split(',').map(b => b.trim()).filter(Boolean) : []);
            codes.forEach((code) => {
              map[code] = disp.modelNo;
            });
          }
        });
      }

      const storeInwardMovements = Array.isArray(storeInwardRes)
        ? storeInwardRes
        : (storeInwardRes?.movements || storeInwardRes?.data || []);
      if (Array.isArray(storeInwardMovements)) {
        storeInwardMovements.forEach((storeInv) => {
          const matchesStore = currentStore && storeInv.storeName && storeInv.storeName.toLowerCase().trim() === currentStore;
          if (matchesStore && storeInv.scannedBarcode) {
            const codes = Array.isArray(storeInv.scannedBarcode)
              ? storeInv.scannedBarcode
              : (typeof storeInv.scannedBarcode === 'string' ? storeInv.scannedBarcode.split(',').map(b => b.trim()).filter(Boolean) : []);
            codes.forEach((code) => {
              map[code] = storeInv.modelNo;
            });
          }
        });
      }

      setExistingBarcodesMap(map);
    } catch (err) {
      console.error('Error fetching existing inventory barcodes:', err);
    }
  };

  const handleInwardDialogClose = () => {
    setShowInwardDialog(false);
    setInwardError('');
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

  const handleModelSelect = (idx, selectedModelNo) => {
    const selectedModel = availableModels.find((m) => m.modelNo === selectedModelNo);

    setLines((prev) => {
      const next = [...prev];
      if (selectedModel) {
        const availableBarcodes = Array.isArray(selectedModel.scannedBarcode)
          ? selectedModel.scannedBarcode.map((b) => String(b).trim()).filter(Boolean)
          : typeof selectedModel.scannedBarcode === 'string'
            ? selectedModel.scannedBarcode.split(',').map((b) => b.trim()).filter(Boolean)
            : [];

        next[idx] = {
          ...next[idx],
          modelNo: selectedModel.modelNo,
          price: selectedModel.price,
          quantity: selectedModel.quantity,
          category: selectedModel.category,
          subCategory: selectedModel.subCategory,
          isQuantityManual: true,
          availableBarcodes,
        };
      } else {
        next[idx] = { ...next[idx], modelNo: selectedModelNo, isQuantityManual: true };
      }
      return next;
    });
  };

  const addLine = () => {
    setLines((prev) => [...prev, makeEmptyLine()]);
  };

  const removeLine = (idx) => {
    setLines((prev) => {
      const target = prev[idx];
      if (target?.scannedList?.length) {
        setGlobalScanned((gs) => {
          const ns = new Set(gs);
          target.scannedList.forEach((c) => ns.delete(c));
          return ns;
        });
      }
      const next = prev.slice(0, idx).concat(prev.slice(idx + 1));
      return next.length ? next : [makeEmptyLine()];
    });
  };

  const handleSearchModel = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();

    const matches = filteredMovements.filter((item) => {
      const p = (item.product || item.modelNo || '').toLowerCase();
      return p === query;
    });

    const totalQty = matches.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

    setSearchResult({
      model: searchQuery,
      count: matches.length,
      totalQuantity: totalQty,
    });
    setShowSearchDialog(true);
  };

  const handleScanKeyDown = (e, idx) => {
    if (!scannerBuffers.current[idx]) scannerBuffers.current[idx] = '';

    if (e.key === 'Enter') {
      e.preventDefault();
      const code = scannerBuffers.current[idx] || e.target.value;
      scannerBuffers.current[idx] = '';
      clearTimeout(scannerTimers.current[idx]);
      if (code) processBarcode(idx, code);
      return;
    }

    if (e.key.length === 1) {
      scannerBuffers.current[idx] += e.key;
    }

    clearTimeout(scannerTimers.current[idx]);
    scannerTimers.current[idx] = setTimeout(() => {
      const code = scannerBuffers.current[idx];
      scannerBuffers.current[idx] = '';
      if (code) processBarcode(idx, code);
    }, 300);
  };

  const processBarcode = (idx, overrideRaw) => {
    // Use linesRef to always get fresh state (avoids stale-closure with scanner timers)
    const ln = linesRef.current[idx];
    if (!ln) return;

    const raw = (overrideRaw || ln?.shd || '').trim();
    if (!raw) return;

    if (!ln.modelNo) {
      showAlert('Error', 'Please select a Model No first');
      setLineErrors((e) => ({ ...e, [`l${idx}_modelNo`]: 'Model No is required' }));
      return;
    }

    if (ln.scannedList?.includes(raw)) {
      showAlert('Error', 'This barcode is already scanned in this row');
      setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: 'This barcode is already scanned in this row' }));
      setLineValue(idx, 'shd', '');
      return;
    }

    // check against globalScanned using functional set update to read fresh value
    let alreadyGlobal = false;
    setGlobalScanned((gs) => {
      if (gs.has(raw)) {
        alreadyGlobal = true;
        return gs; // no change
      }
      const ns = new Set(gs);
      ns.add(raw);
      return ns;
    });

    // We need to check synchronously – use a ref copy
    // Re-read after setState is async, so do it before setState:
    // Check stale globalScanned value first (acceptable for duplicate detection)
    if (ln.scannedList?.some((c) => c === raw)) {
      showAlert('Error', 'This barcode is already scanned in this row');
      setLineValue(idx, 'shd', '');
      return;
    }

    const cap = capForLine(ln);
    if (cap !== Infinity && (ln.scannedList?.length || 0) >= cap) {
      showAlert('Info', `Target quantity of ${cap} already reached for this row`);
      setLineValue(idx, 'shd', '');
      return;
    }

    // Accept the barcode — update lines state
    setLines((prev) => {
      const arr = [...prev];
      const L = { ...arr[idx] };
      const _cap = capForLine(L);
      const currentLen = L.scannedList?.length || 0;
      if (_cap !== Infinity && currentLen >= _cap) return arr;

      const nextList = [...(L.scannedList || []), raw];
      if (_cap !== Infinity && nextList.length > _cap) return arr;

      L.scannedList = nextList;
      L.scannedCodes = nextList.join(', ');
      if (!L.isQuantityManual) L.quantity = nextList.length;
      L.shd = '';
      // clear any prior shd error
      arr[idx] = L;
      return arr;
    });

    // Clear any field error for this row
    setLineErrors((e) => {
      const next = { ...e };
      delete next[`l${idx}_shd`];
      return next;
    });
  };

  const validateForm = () => {
    const eLine = {};
    let ok = true;

    if (lines.length === 0) {
      showAlert('Error', 'Add at least one model row');
      return false;
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

      if (!ln.price || Number(ln.price) <= 0) {
        eLine[key('price')] = 'Price is required';
        ok = false;
      }

      if (!ln.salePerson || !ln.salePerson.trim()) {
        eLine[key('salePerson')] = 'Sale Person is required';
        ok = false;
      }

      if (!ln.scannedList || ln.scannedList.length === 0) {
        eLine[key('shd')] = 'At least one barcode must be scanned';
        ok = false;
      } else if ((ln.scannedList?.length || 0) !== qty) {
        eLine[key('scannedCodes')] = `Scanned count (${ln.scannedList?.length || 0}) must match Quantity (${qty})`;
        ok = false;
      }
    });

    setLineErrors(eLine);
    return ok;
  };

  const handleInwardScanKeyDown = (e, idx) => {
    if (!scannerBuffers.current[idx]) scannerBuffers.current[idx] = '';
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = scannerBuffers.current[idx] || e.target.value;
      if (code) {
        setLineValue(idx, 'shd', code);
        processInwardBarcode(idx, code);
      }
      scannerBuffers.current[idx] = '';
      return;
    }
    if (e.key.length === 1) {
      scannerBuffers.current[idx] += e.key;
    }
    clearTimeout(scannerTimers.current[idx]);
    scannerTimers.current[idx] = setTimeout(() => {
      const code = scannerBuffers.current[idx] || e.target.value;
      if (code) {
        setLineValue(idx, 'shd', code);
        processInwardBarcode(idx, code);
      }
      scannerBuffers.current[idx] = '';
    }, 200);
  };

  const processInwardBarcode = (idx, overrideRaw) => {
    const ln = linesRef.current[idx];
    if (!ln) return;
    const rawInput = (overrideRaw || ln?.shd || '').trim();
    if (!rawInput) return;
    if (!ln.modelNo) {
      showAlert('Error', 'Enter Model No for this row first');
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

        if (existingBarcodesMap[code]) {
          dbExistBarcodes.push({ code, modelNo: existingBarcodesMap[code] });
          continue;
        }

        if (globalScanned.has(code) || nextList.includes(code)) {
          duplicateBarcodes.push(code);
          continue;
        }

        nextList.push(code);
        addedCount++;

        setGlobalScanned((prevSet) => {
          const ns = new Set(prevSet);
          ns.add(code);
          return ns;
        });
      }

      if (dbExistBarcodes.length > 0) {
        setTimeout(() => {
          const msg = `This Serial Number already exists in ${dbExistBarcodes[0].modelNo}`;
          setLineErrors((e) => ({ ...e, [`l${idx}_shd`]: msg }));
          dbExistBarcodes.forEach(({ code, modelNo }) => {
            showAlert('Error', `Barcode ${code} already exists in model ${modelNo}`);
          });
        }, 0);
      } else if (duplicateBarcodes.length > 0) {
        setTimeout(() => {
          showAlert('Error', `Duplicate barcodes ignored: ${duplicateBarcodes.join(', ')}`);
        }, 0);
      }

      L.scannedList = nextList;
      L.scannedCodes = nextList.join(', ');
      if (!L.isQuantityManual) L.quantity = nextList.length;
      L.shd = '';
      arr[idx] = L;
      return arr;
    });

    setLineErrors((e) => {
      const next = { ...e };
      delete next[`l${idx}_shd`];
      return next;
    });
  };

  const validateInwardForm = () => {
    const eLine = {};
    let ok = true;

    if (lines.length === 0) {
      showAlert('Error', 'Add at least one model row');
      return false;
    }

    lines.forEach((ln, i) => {
      const key = (f) => `l${i}_${f}`;

      if (!ln.modelNo) {
        eLine[key('modelNo')] = 'Model No is required';
        ok = false;
      }

      if (!ln.category) {
        eLine[key('category')] = 'Category is required';
        ok = false;
      }

      const qty = qtyForLine(ln);
      if (qty <= 0) {
        eLine[key('quantity')] = 'Quantity must be greater than 0';
        ok = false;
      }

      if (!ln.price || Number(ln.price) <= 0) {
        eLine[key('price')] = 'Price per Unit is required and must be > 0';
        ok = false;
      }

      if (user?.role === 'CCTV Shoppee Avadi' && !ln.owner) {
        eLine[key('owner')] = 'Owner is required';
        ok = false;
      }

      if (!ln.scannedList || ln.scannedList.length === 0) {
        eLine[key('shd')] = 'At least one barcode must be scanned';
        ok = false;
      } else if (ln.scannedList.length !== qty) {
        eLine[key('scannedCodes')] = `Scanned count (${ln.scannedList.length}) must match Quantity (${qty})`;
        ok = false;
      }
    });

    setLineErrors(eLine);
    return ok;
  };

  const handleInwardSubmit = async () => {
    if (!validateInwardForm()) {
      showAlert('Error', 'Please fix the errors before submitting!');
      return;
    }

    try {
      setLoading(true);

      for (const ln of lines) {
        if (!ln.modelNo || qtyForLine(ln) <= 0) continue;

        const qty = qtyForLine(ln);
        const product = productList.find((p) => p.model === ln.modelNo);

        const inwardPayload = {
          modelNo: ln.modelNo,
          quantity: qty,
          pricePerUnit: Number(ln.price) || 0,
          storeName: user?.role || 'JAIPUR',
          userId: user?.id || user?._id || 'unknown-user',
          scannedBarcode: Array.isArray(ln.scannedList) ? ln.scannedList : (ln.scannedCodes ? ln.scannedCodes.split(',') : []),
          brand: product?.brand || '',
          category: ln.category || product?.category || '',
          subCategory: ln.subCategory || product?.subCategory || '',
          mrp: product?.mrp || 0,
          dealerPrice: product?.dealerPrice || 0,
          owner: ln.owner || '',
        };

        console.log('📦 Sending Inward Payload:', inwardPayload);
        const response = await fetch(`${API_BASE}/store-inward`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inwardPayload),
        });

        const resData = await response.json();

        if (!resData.success) {
          console.error('❌ Failed inward:', resData);
          showAlert('Error', `Failed to save ${ln.modelNo}: ${resData.error || 'Unknown error'}`);
        } else {
          console.log('✅ Saved inward:', resData);
        }
      }

      showAlert('Success', 'Stock inward recorded successfully!');
      handleInwardDialogClose();
      await fetchStockMovements();
    } catch (err) {
      console.error('❌ Inward Error:', err);
      showAlert('Error', 'Failed to submit stock inward!');
    } finally {
      setLoading(false);
    }
  };

  const recomputeLowStock = (idx, modelName) => {
    const normalizedModel = (modelName || '').toLowerCase();

    // 1. Try master product list for category and master stock status
    const p = productList.find((m) => (m.model || '').toLowerCase() === normalizedModel);

    // 2. Try current store inventory for specific store stock price/category
    const invItem = stockMovements.find(item => (item.modelNo || item.product || '').toLowerCase() === normalizedModel);

    // Set Category and Sub Category
    const foundCategory = p?.category || invItem?.category || '';
    const foundSubCategory = p?.subCategory || invItem?.subCategory || '';
    setLineValue(idx, 'category', foundCategory);
    setLineValue(idx, 'subCategory', foundSubCategory);

    // Set Low Stock Warning
    const stock = p?.reorderLevel ?? 0;
    const text = stock <= 5 ? `Low stock: ${stock}` : '';
    setLineValue(idx, 'lowStockWarning', text);
  };

  const updateStockInwardAfterOutward = async (modelNo, outwardQuantity, scannedBarcodes) => {
    const storeFilter = user?.role && user?.role !== 'admin' ? user.role.toLowerCase() : null;

    const inwardRecords = stockMovements.filter((movement) => {
      const movementModelNo = movement.product || movement.modelNo;
      const storeMatch = storeFilter ? movement.storeName?.toLowerCase() === storeFilter : true;
      return movementModelNo === modelNo && storeMatch;
    });

    if (inwardRecords.length === 0) return;

    let remainingQuantity = outwardQuantity;
    const barcodesToRemove = new Set(scannedBarcodes || []);
    const sorted = inwardRecords.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    for (const record of sorted) {
      if (remainingQuantity <= 0 && barcodesToRemove.size === 0) break;

      const currentQuantity = record.quantity || 0;

      let currentBarcodes = [];
      if (record.scannedBarcode) {
        if (Array.isArray(record.scannedBarcode)) currentBarcodes = [...record.scannedBarcode];
        else if (typeof record.scannedBarcode === 'string') {
          currentBarcodes = record.scannedBarcode.split(',').map((b) => b.trim()).filter(Boolean);
        }
      }

      let updatedQuantity = currentQuantity;
      let updatedBarcodes = [...currentBarcodes];

      if (barcodesToRemove.size > 0) {
        const before = updatedBarcodes.length;
        updatedBarcodes = updatedBarcodes.filter((b) => !barcodesToRemove.has(b));
        const removed = before - updatedBarcodes.length;

        if (removed > 0) {
          updatedQuantity = Math.max(0, updatedQuantity - removed);
          remainingQuantity = Math.max(0, remainingQuantity - removed);
        }
      }

      if (remainingQuantity > 0 && updatedQuantity > 0) {
        const reduce = Math.min(remainingQuantity, updatedQuantity);
        updatedQuantity -= reduce;
        remainingQuantity -= reduce;
      }

      const updateData = {
        quantity: updatedQuantity,
        scannedBarcode: updatedBarcodes,
      };

      const updateResponse = await fetch(`${API_BASE}/store-inward/stock-inward/${record._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update inward record: ${record._id} - ${errorText}`);
      }
    }

    // Removal of redundant fetchStockMovements() here to avoid excessive updates.
    // The caller (handleOutwardSubmit) already calls it after all items are processed.
  };

  const handleOutwardSubmit = async () => {
    if (!validateForm()) {
      showAlert('Error', 'Please fix the errors before submitting!');
      return;
    }

    if (!outwardFormData.customerName || !outwardFormData.selectedCustomer) {
      showAlert('Error', 'Please select a customer!');
      return;
    }

    try {
      setLoading(true);
      const results = [];
      const inwardUpdates = [];

      for (const ln of lines) {
        if (!ln.modelNo || qtyForLine(ln) <= 0) continue;

        const outwardQuantity = qtyForLine(ln);
        const scannedBarcodes = ln.scannedList || [];

        const outwardData = {
          modelNo: ln.modelNo,
          quantity: outwardQuantity,
          reason: 'Store Inward',
          userId: user?._id || user?.id || 'unknown-user',
          storeName: user?.role || 'ADMIN',
          customerName: outwardFormData.customerName,
          customerMobile: outwardFormData.selectedCustomer?.phoneNo || '',
          customerAddress: outwardFormData.selectedCustomer?.address || '',
          scannedCodes: ln.scannedCodes || '',
          scannedList: ln.scannedList || [],
          price: Number(ln.price) || 0,
          salePerson: ln.salePerson || '',
          category: ln.category || '',
          subCategory: ln.subCategory || '',
        };

        const response = await fetch(`${API_BASE}/stores-outward`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(outwardData),
        });

        const result = await response.json();
        results.push(result);

        if (result?.success) {
          inwardUpdates.push({
            modelNo: ln.modelNo,
            quantity: outwardQuantity,
            scannedBarcodes,
          });
        }
      }

      const allSuccess = results.every((r) => r?.success);
      if (allSuccess) {
        try {
          for (const update of inwardUpdates) {
            await updateStockInwardAfterOutward(update.modelNo, update.quantity, update.scannedBarcodes);
          }
          showAlert('Success', 'Stock outward successful! Stock inward records updated.');
          handleOutwardDialogClose();
          await fetchStockMovements();
        } catch (updateError) {
          console.error('Error updating inward records:', updateError);
          handleOutwardDialogClose();
          await fetchStockMovements();
        }
      } else {
        const errors = results.filter((r) => !r?.success).map((r) => r?.error).filter(Boolean);
        setOutwardError(`Some items failed: ${errors.join(', ')}`);
        showAlert('Error', `Some items failed to save: ${errors.join(', ')}`);
      }
    } catch (err) {
      console.error('Error submitting stock outward:', err);
      setOutwardError(err?.message || 'Submit failed');
      showAlert('Error', `Error submitting stock outward: ${err?.message || 'Submit failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (movement) => {
    setEditFormData({
      id: movement._id,
      modelNo: movement.product || movement.modelNo || '',
      quantity: movement.quantity || 0,
      scannedBarcode: Array.isArray(movement.scannedBarcode)
        ? movement.scannedBarcode.join(', ')
        : movement.scannedBarcode || '',
      category: movement.category || '',
      subCategory: movement.subCategory || 'None',
      owner: movement.owner || '',
    });
    setShowEditDialog(true);
  };

  const handleEditClose = () => {
    setShowEditDialog(false);
    setEditFormData({ id: '', modelNo: '', quantity: 0, scannedBarcode: '', category: '', subCategory: '', owner: '' });
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/store-inward/stock-inward/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: Number(editFormData.quantity),
          scannedBarcode: editFormData.scannedBarcode,
          category: editFormData.category,
          subCategory: editFormData.subCategory,
          owner: editFormData.owner,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      if (result?.success) {
        showAlert('Success', 'Stock inward record updated successfully!');
        handleEditClose();
        fetchStockMovements();
      } else {
        throw new Error(result?.error || 'Failed to update record');
      }
    } catch (err) {
      console.error('Error updating stock movement:', err);
      showAlert('Error', `Error updating record: ${err?.message || 'Update failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferOpen = (movement) => {
    const availableBarcodes = Array.isArray(movement.scannedBarcode)
      ? movement.scannedBarcode.map((b) => String(b).trim()).filter(Boolean)
      : typeof movement.scannedBarcode === 'string'
        ? movement.scannedBarcode.split(',').map((b) => b.trim()).filter(Boolean)
        : [];

    setTransferFormData({
      inwardId: movement._id,
      modelNo: movement.product || movement.modelNo || '',
      fromOwner: movement.owner || 'N/A',
      toOwner: '',
      quantity: movement.quantity || 0,
      transferMethod: '',
      description: '',
      category: movement.category || '',
      subCategory: movement.subCategory || '',
      productPrice: movement.pricePerUnit || 0,
      scannedList: [],
      scannedBarcode: '',
      availableBarcodes,
    });

    setShowTransferDialog(true);
  };

  const handleTransferClose = () => setShowTransferDialog(false);

  const processTransferBarcode = (overrideRaw) => {
    const raw = (overrideRaw || transferFormData.scannedBarcode || '').trim();
    if (!raw) return;

    if (!transferFormData.modelNo) {
      showAlert('Error', 'Model No is missing');
      return;
    }

    if (transferFormData.scannedList.includes(raw)) {
      showAlert('Error', 'This barcode is already scanned');
      setTransferFormData((p) => ({ ...p, scannedBarcode: '' }));
      return;
    }

    const limit = Number(transferFormData.quantity);
    if (limit > 0 && transferFormData.scannedList.length >= limit) {
      showAlert('Info', `Quantity limit reached: ${limit}`);
      setTransferFormData((p) => ({ ...p, scannedBarcode: '' }));
      return;
    }

    // validate barcode exists in original stock
    if (transferFormData.availableBarcodes.length > 0) {
      if (!transferFormData.availableBarcodes.includes(raw)) {
        showAlert('Error', 'Scanned barcode not found in this stock record');
        setTransferFormData((p) => ({ ...p, scannedBarcode: '' }));
        return;
      }
    }

    setTransferFormData((prev) => ({
      ...prev,
      scannedList: [...prev.scannedList, raw],
      scannedBarcode: '',
    }));
  };

  const handleTransferScanKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = transferScannerBuffer.current;
      if (code) processTransferBarcode(code);
      transferScannerBuffer.current = '';
      return;
    }

    if (e.key.length === 1) transferScannerBuffer.current += e.key;

    clearTimeout(transferScannerTimer.current);
    transferScannerTimer.current = setTimeout(() => {
      const code = transferScannerBuffer.current;
      if (code) processTransferBarcode(code);
      transferScannerBuffer.current = '';
    }, 200);
  };

  const handleTransferSubmit = async () => {
    if (!transferFormData.toOwner || !transferFormData.quantity || !transferFormData.transferMethod) {
      showAlert('Error', 'Please fill all required fields');
      return;
    }

    // enforce scanned count equals quantity
    const q = Number(transferFormData.quantity) || 0;
    if (q > 0 && transferFormData.scannedList.length !== q) {
      showAlert('Error', `Scanned count (${transferFormData.scannedList.length}) must match Quantity (${q})`);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...transferFormData,
        scannedBarcode: transferFormData.scannedList,
        userId: user?._id || user?.id || 'system',
        storeName: user?.role || 'Admin',
      };

      const response = await fetch(`${API_BASE}/self-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      if (result?.success) {
        showAlert('Success', 'Stock transferred successfully! Original inward record updated.');
        handleTransferClose();
        fetchStockMovements();
      } else {
        throw new Error(result?.error || 'Failed to transfer stock');
      }
    } catch (err) {
      console.error('Error during self transfer:', err);
      showAlert('Error', `Transfer failed: ${err?.message || 'Transfer failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movement) => {
    showConfirm(
      'Confirm Delete',
      `Are you sure you want to delete this stock inward record?\n\nModel: ${movement.modelNo || movement.product}\nQuantity: ${movement.quantity}\nStore: ${movement.storeName}`,
      async () => {
        try {
          setDeleteLoading(movement._id);

          const response = await fetch(`${API_BASE}/store-inward/${movement._id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const result = await response.json();
          if (result?.success) {
            setFilteredMovements((prev) => prev.filter((item) => item._id !== movement._id));
            setStockMovements((prev) => prev.filter((item) => item._id !== movement._id));
            showAlert('Success', 'Stock inward record deleted successfully!');
          } else {
            throw new Error(result?.error || 'Failed to delete record');
          }
        } catch (err) {
          console.error('Error deleting stock movement:', err);
          showAlert('Error', `Error deleting record: ${err?.message || 'Delete failed'}`);
        } finally {
          setDeleteLoading(null);
        }
      }
    );
  };

  // ===== styles =====
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '24px',
    },
    header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
    headerIcon: { width: '32px', height: '32px', color: '#3b82f6' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1f2937', margin: 0, padding: '20px' },
    subtitle: { fontSize: '16px', color: '#6b7280', margin: '0 0 32px 44px' },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
    },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center' },
    tableHeader: { borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' },
    th: {
      padding: '16px 24px',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      whiteSpace: 'nowrap',
    },
    td: { padding: '16px 24px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151' },
    deleteButton: {
      background: 'none',
      border: '1px solid #e5e7eb',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'background-color 0.2s',
    },
    deleteButtonHover: { backgroundColor: '#fef2f2' },
    deleteIcon: { width: '18px', height: '18px', color: '#dc2626' },
    loadingIcon: { width: '18px', height: '18px', color: '#6b7280' },
    emptyState: { textAlign: 'center', padding: '80px 24px' },
    emptyIcon: { width: '64px', height: '64px', color: '#d1d5db', margin: '0 auto 24px' },
    emptyText: { fontSize: '16px', color: '#6b7280', margin: 0 },
  };

  // ===== UI states =====
  if (loading) {
    return (
      <div style={styles.container}>
        <Spinner message="Loading stock inward movements..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#dc2626' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  // ===== render =====
  return (
    <div style={styles.container}>
      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        actions={alertActions}
      />

      <div style={styles.header}>
        <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 style={styles.title}>Stock Inward Details</h1>
      </div>

      <p style={styles.subtitle}>
        {user?.role === 'admin'
          ? 'Showing all stock inward details'
          : `Showing stock inward details for ${user?.role}`}
      </p>

      {/* top actions */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button
          onClick={handleInwardDialogOpen}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Store Inward
        </button>
        <button
          onClick={handleOutwardDialogOpen}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Stock Outward
        </button>

        {user?.role === 'CCTV Shoppee Avadi' && (
          <FormControl sx={{ minWidth: 220 }} size="small">
            <InputLabel id="owner-filter-label">Filter by Owner</InputLabel>
            <Select
              labelId="owner-filter-label"
              value={ownerFilter}
              label="Filter by Owner"
              onChange={(e) => setOwnerFilter(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: '8px' }}
            >
              <MenuItem value=""><em>All Owners</em></MenuItem>
              <MenuItem value="CCTV Shoppee Avadi">CCTV Shoppee Avadi</MenuItem>
              <MenuItem value="Lookman CCTV Avadi">Lookman CCTV Avadi</MenuItem>
            </Select>
          </FormControl>
        )}

        <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250, height: 40 }}>
          <TextField
            variant="standard"
            placeholder="Search Category"
            value={searchCategoryQuery}
            onChange={(e) => setSearchCategoryQuery(e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ ml: 1, flex: 1 }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250, height: 40 }}
          onSubmit={(e) => { e.preventDefault(); handleSearchModel(); }}
        >
          <TextField
            variant="standard"
            placeholder="Search Model No"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ ml: 1, flex: 1 }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchModel}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>

      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Total Items</h3>
          <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>{stats.totalItems}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Low Stock</h3>
          <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>{stats.lowStock}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Products</h3>
          <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>{stats.totalProducts}</p>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Out of Stock</h3>
          <p style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>{stats.outOfStock}</p>
        </div>
      </div>

      {/* table */}
      <div style={styles.tableContainer}>
        <h1 style={styles.title}>Stock Inward Table</h1>

        {filteredMovements.length > 0 ? (
          <>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>USER ID</th>
                  <th style={styles.th}>MODEL NO</th>
                  <th style={styles.th}>CATEGORY</th>
                  <th style={styles.th}>SUB CATEGORY</th>
                  {user?.role === 'CCTV Shoppee Avadi' && <th style={styles.th}>OWNER</th>}
                  <th style={styles.th}>QUANTITY</th>
                  <th style={styles.th}>STORE NAME</th>
                  <th style={styles.th}>BARCODE</th>
                  <th style={styles.th}>PER UNIT PRICE</th>
                  <th style={styles.th}>DATE</th>
                  <th style={styles.th}>ACTIVITY</th>
                  <th style={styles.th}>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((movement, index) => (
                  <tr key={movement._id || index}>
                    <td style={styles.td}>{movement.userId || 'N/A'}</td>
                    <td style={styles.td}>{movement.product || movement.modelNo || 'N/A'}</td>
                    <td style={styles.td}>{movement.category || 'N/A'}</td>
                    <td style={styles.td}>{movement.subCategory || 'N/A'}</td>
                    {user?.role === 'CCTV Shoppee Avadi' && <td style={styles.td}>{movement.owner || 'N/A'}</td>}
                    <td style={styles.td}>{movement.quantity ?? 'N/A'}</td>
                    <td style={styles.td}>{movement.storeName || 'N/A'}</td>
                    <td style={{ ...styles.td, wordBreak: 'break-all' }}>
                      {(() => {
                        const val = movement.scannedBarcode;
                        if (!val) return 'N/A';
                        if (Array.isArray(val)) {
                          return val.map(v => typeof v === 'string' ? v.trim() : String(v)).join(', ');
                        }
                        const str = String(val).trim();
                        if (str.includes(',') || str.includes(' ')) return str;
                        return str.split(/(?=[A-Z]{2,}[-_])/).filter(Boolean).join(', ');
                      })()}
                    </td>
                    <td style={styles.td}>{movement.pricePerUnit ?? movement.price ?? 'N/A'}</td>
                    <td style={styles.td}>
                      {movement.createdAt ? new Date(movement.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td style={styles.td}>
                      <span style={getBadgeStyle(movement.type)}>STORE INWARD</span>
                    </td>
                    <td style={styles.td}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton size="small" color="primary" onClick={() => handleEditOpen(movement)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(movement)}
                          disabled={deleteLoading === movement._id}
                        >
                          {deleteLoading === movement._id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Showing {filteredMovements.length} record{filteredMovements.length !== 1 ? 's' : ''}
              </div>

              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, value) => paginate(value)}
                color="primary"
                variant="outlined"
                shape="rounded"
                size="small"
              />
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={styles.emptyText}>
              {user?.role === 'admin'
                ? 'No stock inward details recorded'
                : `No stock inward details recorded for ${user?.role}`}
            </p>
          </div>
        )}
      </div>

      {/* ===== Store Inward Dialog ===== */}
      <Dialog open={showInwardDialog} onClose={handleInwardDialogClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Stock Inward
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addLine}
            color="primary"
          >
            Add Model
          </Button>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
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
                    <IconButton color="error" onClick={() => removeLine(idx)} disabled={lines.length === 1}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Model No *"
                        value={ln.modelNo || ''}
                        onChange={(e) => {
                          setLineValue(idx, 'modelNo', e.target.value);
                          recomputeLowStock(idx, e.target.value);
                          // Set the price from the selected product
                          const selectedProduct = productList.find((p) => p.model === e.target.value);
                          if (selectedProduct) {
                            setLineValue(idx, 'price', selectedProduct.price || 0);
                          }
                        }}
                        fullWidth
                        error={!!lineErrors[`l${idx}_modelNo`]}
                        helperText={lineErrors[`l${idx}_modelNo`]}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                        Current stock: {currentStock}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth error={!!lineErrors[`l${idx}_category`]}>
                        <InputLabel>Category *</InputLabel>
                        <Select
                          label="Category *"
                          value={ln.category || ''}
                          onChange={(e) => setLineValue(idx, 'category', e.target.value)}
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat.name}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{lineErrors[`l${idx}_category`]}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth error={!!lineErrors[`l${idx}_subCategory`]}>
                        <InputLabel>Sub Category</InputLabel>
                        <Select
                          label="Sub Category"
                          value={ln.subCategory || 'None'}
                          onChange={(e) => setLineValue(idx, 'subCategory', e.target.value)}
                        >
                          <MenuItem value="None">None</MenuItem>
                          {subCategories.map((sub) => (
                            <MenuItem key={sub._id} value={sub.name}>
                              {sub.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{lineErrors[`l${idx}_subCategory`]}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Quantity *"
                        type="number"
                        fullWidth
                        value={ln.quantity}
                        onChange={(e) => {
                          setLineValue(idx, 'isQuantityManual', true);
                          setLineValue(idx, 'quantity', e.target.value);
                        }}
                        error={!!lineErrors[`l${idx}_quantity`]}
                        helperText={lineErrors[`l${idx}_quantity`] || 'Typed value caps how many barcodes you can scan for this row'}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          After inward: {afterStock} {incomingQty > 0 ? `( +${incomingQty} )` : ''}
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                          {cap === Infinity ? 'No scan limit' : `Remaining scans allowed: ${remaining}`}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Price per Unit *"
                        type="number"
                        fullWidth
                        value={ln.price || ''}
                        onChange={(e) => setLineValue(idx, 'price', e.target.value)}
                        error={!!lineErrors[`l${idx}_price`]}
                        helperText={lineErrors[`l${idx}_price`]}
                      />
                    </Grid>
                    {user?.role === 'CCTV Shoppee Avadi' && (
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth error={!!lineErrors[`l${idx}_owner`]}>
                          <InputLabel>Owner *</InputLabel>
                          <Select
                            label="Owner *"
                            value={ln.owner || ''}
                            onChange={(e) => setLineValue(idx, 'owner', e.target.value)}
                          >
                            <MenuItem value="CCTV Shoppee Avadi.">CCTV Shoppee Avadi.</MenuItem>
                            <MenuItem value="Lookman CCTV Avadi.">Lookman CCTV Avadi.</MenuItem>
                          </Select>
                          <FormHelperText>{lineErrors[`l${idx}_owner`]}</FormHelperText>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={12} md={8}>
                      <TextField
                        label="Scan barcode"
                        fullWidth
                        value={ln.shd}
                        onChange={(e) => setLineValue(idx, 'shd', e.target.value)}
                        onKeyDown={(e) => handleInwardScanKeyDown(e, idx)}
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
                    <Grid item xs={12}>
                      <TextField
                        label="Scanned Codes"
                        fullWidth
                        multiline
                        rows={3}
                        value={ln.scannedCodes}
                        InputProps={{ readOnly: true }}
                        required
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
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleInwardDialogClose} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleInwardSubmit} variant="contained" color="primary" startIcon={<SaveIcon />} disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== Stock Outward Dialog ===== */}
      <Dialog open={showOutwardDialog} onClose={handleOutwardDialogClose} fullWidth>
        <DialogTitle>Stock Outward</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Customer Name *</InputLabel>
              <Select
                value={outwardFormData.customerName}
                onChange={(e) => {
                  const selectedCustomer = customerNames.find((c) => c.customerName === e.target.value);
                  setOutwardFormData({
                    customerName: e.target.value,
                    selectedCustomer: selectedCustomer || null,
                  });
                }}
                label="Customer Name *"
                disabled={loadingCustomers}
              >
                {loadingCustomers ? (
                  <MenuItem disabled>Loading customers...</MenuItem>
                ) : customerNames.length > 0 ? (
                  customerNames.map((customer, index) => (
                    <MenuItem key={index} value={customer.customerName}>
                      {customer.customerName} ({customer.phoneNo})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No customers found</MenuItem>
                )}
              </Select>
            </FormControl>

            {outwardFormData.selectedCustomer && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">Customer Details</Typography>
                <Typography variant="body2"><strong>Mobile:</strong> {outwardFormData.selectedCustomer.phoneNo}</Typography>
                <Typography variant="body2"><strong>Address:</strong> {outwardFormData.selectedCustomer.address}</Typography>
              </Paper>
            )}

            {lines.map((ln, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography fontWeight={600}>Model #{idx + 1}</Typography>
                  <IconButton color="error" onClick={() => removeLine(idx)} disabled={lines.length === 1}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl fullWidth error={!!lineErrors[`l${idx}_modelNo`]}>
                      <InputLabel>Model No *</InputLabel>
                      <Select
                        value={ln.modelNo || ''}
                        onChange={(e) => handleModelSelect(idx, e.target.value)}
                        label="Model No *"
                        disabled={loadingModels}
                      >
                        {loadingModels ? (
                          <MenuItem disabled>Loading models...</MenuItem>
                        ) : availableModels.length > 0 ? (
                          availableModels.map((model, i) => (
                            <MenuItem key={i} value={model.modelNo}>
                              {model.modelNo}
                              {model.price > 0 && ` (Price: ${model.price})`}
                              {model.quantity > 0 && ` (Qty: ${model.quantity})`}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No models available</MenuItem>
                        )}
                      </Select>

                      {lineErrors[`l${idx}_modelNo`] && (
                        <FormHelperText>{lineErrors[`l${idx}_modelNo`]}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {ln.modelNo && (
                    <>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField label="Category" fullWidth value={ln.category || ''} InputProps={{ readOnly: true }} variant="filled" />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField label="Sub Category" fullWidth value={ln.subCategory || ''} InputProps={{ readOnly: true }} variant="filled" />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label="Quantity *"
                      type="number"
                      fullWidth
                      value={ln.quantity}
                      onChange={(e) => {
                        setLineValue(idx, 'isQuantityManual', true);
                        setLineValue(idx, 'quantity', e.target.value);
                      }}
                      error={!!lineErrors[`l${idx}_quantity`]}
                      helperText={lineErrors[`l${idx}_quantity`] || 'Typed value caps how many barcodes you can scan for this row'}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label="Price *"
                      type="number"
                      fullWidth
                      value={ln.price || ''}
                      onChange={(e) => setLineValue(idx, 'price', e.target.value)}
                      error={!!lineErrors[`l${idx}_price`]}
                      helperText={lineErrors[`l${idx}_price`]}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label="Sale Person *"
                      fullWidth
                      value={ln.salePerson || ''}
                      onChange={(e) => setLineValue(idx, 'salePerson', e.target.value)}
                      error={!!lineErrors[`l${idx}_salePerson`]}
                      helperText={lineErrors[`l${idx}_salePerson`]}
                    />
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <TextField
                      label="Scan barcode *"
                      fullWidth
                      value={ln.shd}
                      onChange={(e) => setLineValue(idx, 'shd', e.target.value)}
                      onKeyDown={(e) => handleScanKeyDown(e, idx)}
                      error={!!lineErrors[`l${idx}_shd`]}
                      helperText={
                        lineErrors[`l${idx}_shd`] ||
                        (remainingForLine(ln) === Infinity
                          ? 'Scan any barcode'
                          : `Allowed up to ${remainingForLine(ln) + ln.scannedList.length} scans for this row`)
                      }
                      inputRef={(el) => (shdRefs.current[idx] = el)}
                      disabled={remainingForLine(ln) === 0}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Scanned Codes"
                      fullWidth
                      multiline
                      rows={3}
                      value={ln.scannedCodes}
                      InputProps={{ readOnly: true }}
                      required
                      error={!!lineErrors[`l${idx}_scannedCodes`]}
                      helperText={lineErrors[`l${idx}_scannedCodes`]}
                    />
                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                      Total scanned: {ln.scannedList.length}
                      {remainingForLine(ln) !== Infinity && ` | Remaining: ${remainingForLine(ln)}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Button variant="outlined" startIcon={<AddIcon />} onClick={addLine}>
              Add Model
            </Button>

            {outwardError ? (
              <Typography color="error" variant="body2">{outwardError}</Typography>
            ) : null}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleOutwardDialogClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleOutwardSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== Edit Dialog ===== */}
      <Dialog open={showEditDialog} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Stock Inward</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField label="Model No" fullWidth value={editFormData.modelNo} InputProps={{ readOnly: true }} variant="filled" />

            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={editFormData.quantity}
              onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={editFormData.category}
                label="Category"
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sub Category</InputLabel>
              <Select
                value={editFormData.subCategory}
                label="Sub Category"
                onChange={(e) => setEditFormData({ ...editFormData, subCategory: e.target.value })}
              >
                <MenuItem value="None">None</MenuItem>
                {subCategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub.name}>{sub.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {user?.role === 'CCTV Shoppee Avadi' && (
              <FormControl fullWidth>
                <InputLabel>Owner</InputLabel>
                <Select
                  value={editFormData.owner}
                  label="Owner"
                  onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                >
                  <MenuItem value="CCTV Shoppee Avadi.">CCTV Shoppee Avadi.</MenuItem>
                  <MenuItem value="Lookman CCTV Avadi.">Lookman CCTV Avadi.</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              label="Barcodes (comma separated)"
              fullWidth
              multiline
              rows={4}
              value={editFormData.scannedBarcode}
              onChange={(e) => setEditFormData({ ...editFormData, scannedBarcode: e.target.value })}
              helperText="Edit barcodes for this model"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEditClose} color="inherit">Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary" startIcon={<SaveIcon />} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== Transfer Dialog ===== */}
      <Dialog open={showTransferDialog} onClose={handleTransferClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Self Stock Transfer</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Model No" fullWidth value={transferFormData.modelNo} InputProps={{ readOnly: true }} variant="filled" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="From Owner" fullWidth value={transferFormData.fromOwner} InputProps={{ readOnly: true }} variant="filled" />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Category" fullWidth value={transferFormData.category} InputProps={{ readOnly: true }} variant="filled" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Product Price" fullWidth value={transferFormData.productPrice} InputProps={{ readOnly: true }} variant="filled" />
              </Grid>
            </Grid>

            <TextField label="Sub Category" fullWidth value={transferFormData.subCategory} InputProps={{ readOnly: true }} variant="filled" />

            <FormControl fullWidth required>
              <InputLabel>To Owner</InputLabel>
              <Select
                value={transferFormData.toOwner}
                label="To Owner"
                onChange={(e) => setTransferFormData({ ...transferFormData, toOwner: e.target.value })}
              >
                <MenuItem value="CCTV Shoppee Avadi.">CCTV Shoppee Avadi.</MenuItem>
                <MenuItem value="Lookman CCTV Avadi.">Lookman CCTV Avadi.</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Quantity to Transfer"
              type="number"
              fullWidth
              required
              value={transferFormData.quantity}
              onChange={(e) =>
                setTransferFormData({ ...transferFormData, quantity: Math.min(Number(e.target.value), 999999) })
              }
              helperText="Set quantity, then scan same number of barcodes"
            />

            <FormControl fullWidth required>
              <InputLabel>Transfer Method</InputLabel>
              <Select
                value={transferFormData.transferMethod}
                label="Transfer Method"
                onChange={(e) => setTransferFormData({ ...transferFormData, transferMethod: e.target.value })}
              >
                <MenuItem value="In Hand">In Hand</MenuItem>
                <MenuItem value="Courier">Courier</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={transferFormData.description}
              onChange={(e) => setTransferFormData({ ...transferFormData, description: e.target.value })}
              placeholder="Add any transfer notes..."
            />

            <TextField
              label="Scan Barcode"
              fullWidth
              value={transferFormData.scannedBarcode}
              onChange={(e) => setTransferFormData({ ...transferFormData, scannedBarcode: e.target.value })}
              onKeyDown={handleTransferScanKeyDown}
              helperText="Scan barcode and press Enter"
            />

            <TextField
              label="Scanned Codes"
              fullWidth
              multiline
              rows={3}
              value={transferFormData.scannedList.join(', ')}
              InputProps={{ readOnly: true }}
              helperText={`Total scanned: ${transferFormData.scannedList.length}`}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleTransferClose} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleTransferSubmit} variant="contained" color="success" startIcon={<SyncAltIcon />} disabled={loading}>
            {loading ? 'Processing...' : 'Submit Transfer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== Search Result Popup ===== */}
      <Dialog open={showSearchDialog} onClose={() => setShowSearchDialog(false)}>
        <DialogTitle>Search Result</DialogTitle>
        <DialogContent>
          {searchResult && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Model: {searchResult.model}
              </Typography>
              <Typography variant="body1">
                Total Quantity Found: <strong>{searchResult.totalQuantity}</strong>
              </Typography>
              <Typography variant="caption" color="textSecondary">
                (Found in {searchResult.count} records)
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSearchDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default History;
