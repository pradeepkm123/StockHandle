// import React, { useState, useEffect } from 'react';
// import { useUser } from './UserContext';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button,
//     IconButton,
//     TextField,
//     Typography,
//     MenuItem,
//     Stack,
//     FormControl,
//     InputLabel,
//     Select,
//     Pagination,
//     Paper
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';

// const API_BASE = 'https://stockhandle.onrender.com/api';

// const sanitize = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

// const findModelMatchInBarcode = (model, barcode) => {
//     const m = sanitize(model);
//     const b = sanitize(barcode);
//     if (!m || !b) return null;
//     const lengths = [5, 4];
//     for (const L of lengths) {
//         if (m.length < L) continue;
//         for (let i = 0; i <= m.length - L; i++) {
//             const sub = m.slice(i, i + L);
//             if (b.includes(sub)) return sub;
//         }
//     }
//     return null;
// };

// const AlertDialog = ({ open, onClose, title, message, actions }) => {
//     return (
//         <Dialog open={open} onClose={onClose}>
//             <DialogTitle>{title}</DialogTitle>
//             <DialogContent>
//                 <Typography>{message}</Typography>
//             </DialogContent>
//             <DialogActions>
//                 {actions || (
//                     <Button onClick={onClose} color="primary" autoFocus>
//                         OK
//                     </Button>
//                 )}
//             </DialogActions>
//         </Dialog>
//     );
// };

// const SelfTransferPage = () => {
//     const { user } = useUser();
//     // State
//     const [transfers, setTransfers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     // Alert Dialog State
//     const [alertOpen, setAlertOpen] = useState(false);
//     const [alertTitle, setAlertTitle] = useState('');
//     const [alertMessage, setAlertMessage] = useState('');
//     const [alertActions, setAlertActions] = useState(null);

//     // Edit Dialog State
//     const [showEditDialog, setShowEditDialog] = useState(false);
//     const [currentTransfer, setCurrentTransfer] = useState(null);
//     const [editFormData, setEditFormData] = useState({
//         modelNo: '',
//         fromOwner: '',
//         toOwner: '',
//         quantity: '',
//         transferMethod: '',
//         description: '',
//         category: ''
//     });

//     // Receive Dialog State
//     const [receiveDialog, setReceiveDialog] = useState(false);
//     const [receiveQty, setReceiveQty] = useState('');
//     const [receivingTransfer, setReceivingTransfer] = useState(null);
//     const [scannedList, setScannedList] = useState([]);
//     const [barcodeInput, setBarcodeInput] = useState('');

//     // Scanner Refs
//     const scannerBuffer = React.useRef('');
//     const scannerTimer = React.useRef(null);
//     const scanInputRef = React.useRef(null);

//     useEffect(() => {
//         fetchTransfers();
//     }, [user?.role]);

//     const fetchTransfers = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${API_BASE}/self-transfer`);
//             if (!response.ok) throw new Error('Failed to fetch transfers');
//             const data = await response.json();

//             // Filter if necessary based on user role? 
//             // Assuming displaying all or filtered by backend
//             if (user?.role && user?.role !== 'admin') {
//                 setTransfers(data.filter(t => t.storeName === user.role));
//             } else {
//                 setTransfers(data);
//             }
//         } catch (err) {
//             console.error(err);
//             // Silent fail or alert
//             setError(err.message); // Keep existing error state
//         } finally {
//             setLoading(false);
//         }
//     };

//     const showAlert = (title, message, actions = null) => { // Adjusted to match original signature
//         setAlertTitle(title);
//         setAlertMessage(message);
//         setAlertActions(actions);
//         setAlertOpen(true);
//     };

//     const showConfirm = (title, message, onConfirm) => {
//         setAlertTitle(title);
//         setAlertMessage(message);
//         setAlertActions(
//             <>
//                 <Button onClick={() => setAlertOpen(false)} color="primary">
//                     Cancel
//                 </Button>
//                 <Button
//                     onClick={() => {
//                         setAlertOpen(false);
//                         onConfirm();
//                     }}
//                     color="error"
//                     autoFocus
//                 >
//                     Delete
//                 </Button>
//             </>
//         );
//         setAlertOpen(true);
//     };

//     const handleEditOpen = (transfer) => {
//         setCurrentTransfer(transfer);
//         setEditFormData({
//             modelNo: transfer.modelNo,
//             fromOwner: transfer.fromOwner,
//             toOwner: transfer.toOwner,
//             quantity: transfer.quantity,
//             transferMethod: transfer.transferMethod,
//             description: transfer.description,
//             category: transfer.category || ''
//         });
//         setShowEditDialog(true);
//     };

//     const handleEditClose = () => {
//         setShowEditDialog(false);
//         setCurrentTransfer(null);
//     };

//     const handleEditSubmit = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${API_BASE}/self-transfer/${currentTransfer._id}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(editFormData)
//             });
//             if (!response.ok) throw new Error('Failed to update transfer');
//             showAlert('Success', 'Transfer updated successfully');
//             setShowEditDialog(false);
//             fetchTransfers();
//         } catch (err) {
//             showAlert('Error', err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         showConfirm('Confirm Delete', 'Are you sure you want to delete this transfer record?', async () => {
//             try {
//                 const response = await fetch(`${API_BASE}/self-transfer/${id}`, {
//                     method: 'DELETE'
//                 });
//                 if (!response.ok) throw new Error('Failed to delete transfer');
//                 showAlert('Success', 'Transfer record deleted');
//                 fetchTransfers();
//             } catch (err) {
//                 showAlert('Error', err.message);
//             }
//         });
//     };

//     const handleReceiveStock = (transfer) => {
//         setReceivingTransfer(transfer);
//         setReceiveQty(transfer.quantity); // Default to full quantity
//         setScannedList([]);
//         setBarcodeInput('');
//         setReceiveDialog(true);
//     };

//     const handleScanKeyDown = (e) => {
//         if (!scannerBuffer.current) scannerBuffer.current = '';

//         if (e.key === 'Enter') {
//             e.preventDefault();
//             const code = scannerBuffer.current;
//             if (code) {
//                 setBarcodeInput(code);
//                 processBarcode(code);
//             }
//             scannerBuffer.current = '';
//             return;
//         }

//         if (e.key.length === 1) {
//             scannerBuffer.current += e.key;
//         }

//         clearTimeout(scannerTimer.current);
//         scannerTimer.current = setTimeout(() => {
//             const code = scannerBuffer.current;
//             if (code) {
//                 setBarcodeInput(code);
//                 processBarcode(code);
//             }
//             scannerBuffer.current = '';
//         }, 200);
//     };

//     const processBarcode = (overrideRaw) => {
//         const raw = (overrideRaw || barcodeInput || '').trim();
//         if (!raw) return;

//         if (!receivingTransfer) return;

//         // Check duplicates
//         if (scannedList.includes(raw)) {
//             showAlert('Error', 'This barcode is already scanned');
//             setBarcodeInput('');
//             return;
//         }

//         // Check quantity limit based on "receiveQty" or "receivingTransfer.quantity"
//         // Usually receiveQty determines the limit.
//         const limit = Number(receiveQty);
//         if (limit > 0 && scannedList.length >= limit) {
//             showAlert('Info', `Quantity limit reached: ${limit}`);
//             setBarcodeInput('');
//             return;
//         }

//         // Validate that the barcode exists in the transfer record
//         if (receivingTransfer.scannedBarcode && receivingTransfer.scannedBarcode.length > 0) {
//             const availableBarcodes = receivingTransfer.scannedBarcode.map(b => b.trim());
//             if (!availableBarcodes.includes(raw)) {
//                 showAlert('Error', 'Scanned barcode not found in this transfer record');
//                 setBarcodeInput('');
//                 return;
//             }
//         }

//         setScannedList(prev => [...prev, raw]);
//         setBarcodeInput('');
//     };

//     const handleReceiveSubmit = async () => {
//         if (!receiveQty || Number(receiveQty) <= 0) {
//             showAlert('Error', 'Please enter a valid quantity');
//             return;
//         }
//         if (Number(receiveQty) > receivingTransfer.quantity) {
//             showAlert('Error', 'Quantity cannot exceed transferred amount');
//             return;
//         }

//         try {
//             setLoading(true);
//             const response = await fetch(`${API_BASE}/self-transfer/${receivingTransfer._id}/receive`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     quantityToReceive: receiveQty,
//                     storeName: user?.role,
//                     owner: user?.role,
//                     scannedBarcode: scannedList
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok || !data.success) {
//                 throw new Error(data.message || 'Failed to receive stock');
//             }

//             showAlert('Success', data.message);
//             setReceiveDialog(false);
//             setReceivingTransfer(null);
//             fetchTransfers();
//         } catch (err) {
//             showAlert('Error', err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const totalPages = Math.ceil(transfers.length / itemsPerPage);
//     const currentItems = transfers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//     const styles = {
//         container: { padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' },
//         title: { fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '24px' },
//         tableContainer: {
//             backgroundColor: 'white',
//             borderRadius: '12px',
//             boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//             border: '1px solid #e5e7eb',
//             overflow: 'hidden'
//         },
//         table: { width: '100%', borderCollapse: 'collapse' },
//         th: {
//             backgroundColor: '#f8fafc',
//             padding: '12px 16px',
//             textAlign: 'left',
//             fontSize: '12px',
//             fontWeight: '600',
//             color: '#475569',
//             textTransform: 'uppercase',
//             borderBottom: '1px solid #e2e8f0'
//         },
//         td: { padding: '16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' },
//         actionBtn: { border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }
//     };

//     if (loading && transfers.length === 0) return <Typography sx={{ p: 4 }}>Loading transfers...</Typography>;

//     return (
//         <div style={styles.container}>
//             <AlertDialog open={alertOpen} onClose={() => setAlertOpen(false)} title={alertTitle} message={alertMessage} actions={alertActions} />

//             <h1 style={styles.title}>Stock Transfers</h1>

//             <div style={styles.tableContainer}>
//                 <table style={styles.table}>
//                     <thead>
//                         <tr>
//                             <th style={styles.th}>Date</th>
//                             <th style={styles.th}>Model No</th>
//                             <th style={styles.th}>From Owner</th>
//                             <th style={styles.th}>To Owner</th>
//                             <th style={styles.th}>Category</th>
//                             <th style={styles.th}>Sub Category</th>
//                             <th style={styles.th}>Barcode</th>
//                             <th style={styles.th}>Price</th>
//                             <th style={styles.th}>Quantity</th>
//                             <th style={styles.th}>Method</th>
//                             <th style={styles.th}>Description</th>
//                             <th style={styles.th}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentItems.length > 0 ? (
//                             currentItems.map((t) => (
//                                 <tr key={t._id}>
//                                     <td style={styles.td}>{new Date(t.createdAt).toLocaleDateString()}</td>
//                                     <td style={styles.td}>{t.modelNo}</td>
//                                     <td style={styles.td}>{t.fromOwner}</td>
//                                     <td style={styles.td}>{t.toOwner}</td>
//                                     <td style={styles.td}>{t.category || 'N/A'}</td>
//                                     <td style={styles.td}>{t.subCategory || 'N/A'}</td>
//                                     <td style={styles.td}>
//                                         {Array.isArray(t.scannedBarcode)
//                                             ? t.scannedBarcode.join(', ')
//                                             : t.scannedBarcode || 'N/A'}
//                                     </td>
//                                     <td style={styles.td}>{t.productPrice || 0}</td>
//                                     <td style={styles.td}>{t.quantity}</td>
//                                     <td style={styles.td}>{t.transferMethod}</td>
//                                     <td style={styles.td}>{t.description || 'N/A'}</td>
//                                     <td style={styles.td}>
//                                         <Stack direction="row" spacing={1}>
//                                             <IconButton size="small" color="success" onClick={() => handleReceiveStock(t)} title="Transfer to Stock Inward">
//                                                 <MoveToInboxIcon fontSize="small" />
//                                             </IconButton>
//                                             <IconButton size="small" color="primary" onClick={() => handleEditOpen(t)}>
//                                                 <EditIcon fontSize="small" />
//                                             </IconButton>
//                                             <IconButton size="small" color="error" onClick={() => handleDelete(t._id)}>
//                                                 <DeleteIcon fontSize="small" />
//                                             </IconButton>
//                                         </Stack>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="11" style={{ ...styles.td, textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
//                                     No transfer records found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>

//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
//                     <Typography variant="body2" color="text.secondary">
//                         Showing {currentItems.length} of {transfers.length} records
//                     </Typography>
//                     <Pagination
//                         count={totalPages}
//                         page={currentPage}
//                         onChange={(e, v) => setCurrentPage(v)}
//                         color="primary"
//                         variant="outlined"
//                         shape="rounded"
//                         size="small"
//                     />
//                 </div>
//             </div>

//             {/* Edit Dialog */}
//             <Dialog open={showEditDialog} onClose={handleEditClose} fullWidth maxWidth="sm">
//                 <DialogTitle>Edit Transfer Record</DialogTitle>
//                 <DialogContent>
//                     <Stack spacing={3} sx={{ mt: 2 }}>
//                         <FormControl fullWidth>
//                             <InputLabel>To Owner</InputLabel>
//                             <Select
//                                 value={editFormData.toOwner}
//                                 label="To Owner"
//                                 onChange={(e) => setEditFormData({ ...editFormData, toOwner: e.target.value })}
//                             >
//                                 <MenuItem value="CCTV Shoppee Avadi.">CCTV Shoppee Avadi.</MenuItem>
//                                 <MenuItem value="Lookman CCTV Avadi.">Lookman CCTV Avadi.</MenuItem>
//                             </Select>
//                         </FormControl>

//                         <TextField
//                             label="Quantity"
//                             type="number"
//                             fullWidth
//                             value={editFormData.quantity}
//                             onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
//                         />

//                         <FormControl fullWidth required>
//                             <InputLabel>Transfer Method</InputLabel>
//                             <Select
//                                 value={editFormData.transferMethod}
//                                 label="Transfer Method"
//                                 onChange={(e) => setEditFormData({ ...editFormData, transferMethod: e.target.value })}
//                             >
//                                 <MenuItem value="In Hand">In Hand</MenuItem>
//                                 <MenuItem value="Courier">Courier</MenuItem>
//                                 <MenuItem value="Others">Others</MenuItem>
//                             </Select>
//                         </FormControl>

//                         <TextField
//                             label="Description"
//                             fullWidth
//                             multiline
//                             rows={3}
//                             value={editFormData.description}
//                             onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
//                         />
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleEditClose} color="inherit">Cancel</Button>
//                     <Button onClick={handleEditSubmit} variant="contained" color="primary" startIcon={<SaveIcon />}>
//                         Save Changes
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Receive Stock Dialog */}
//             <Dialog open={receiveDialog} onClose={() => setReceiveDialog(false)}>
//                 <DialogTitle>Receive Stock</DialogTitle>
//                 <DialogContent>
//                     <Typography gutterBottom>
//                         How many units of <strong>{receivingTransfer?.modelNo}</strong> do you want to receive into <strong>{receivingTransfer?.toOwner}</strong>?
//                     </Typography>
//                     <Typography variant="caption" display="block" sx={{ mb: 2, color: 'text.secondary' }}>
//                         Available from transfer: {receivingTransfer?.quantity}
//                     </Typography>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Quantity to Receive"
//                         type="number"
//                         fullWidth
//                         value={receiveQty}
//                         onChange={(e) => setReceiveQty(e.target.value)}
//                         helperText={Number(receiveQty) === receivingTransfer?.quantity ? "Full quantity will remove this record." : "Partial receive will keep record with remaining qty."}
//                     />

//                     <TextField
//                         margin="dense"
//                         label="Scan Barcode"
//                         fullWidth
//                         value={barcodeInput}
//                         onChange={(e) => setBarcodeInput(e.target.value)}
//                         onKeyDown={handleScanKeyDown}
//                         inputRef={scanInputRef}
//                         helperText="Scan barcode to verify"
//                     />

//                     <TextField
//                         margin="dense"
//                         label="Scanned Codes"
//                         fullWidth
//                         multiline
//                         rows={2}
//                         value={scannedList.join(', ')}
//                         InputProps={{ readOnly: true }}
//                         helperText={`Scanned: ${scannedList.length} / ${receiveQty}`}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setReceiveDialog(false)} color="inherit">Cancel</Button>
//                     <Button onClick={handleReceiveSubmit} variant="contained" color="success" startIcon={<MoveToInboxIcon />}>
//                         Receive Stock
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

// export default SelfTransferPage;





import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Stack,
  FormControl,
  InputLabel,
  Select,
  Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';

const API_BASE = 'https://stockhandle-taxr.onrender.com/api';

const AlertDialog = ({ open, onClose, title, message, actions }) => {
  return (
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
};

const SelfTransferPage = () => {
  const { user } = useUser();

  // Data
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Alert
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertActions, setAlertActions] = useState(null);

  // Edit Dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTransfer, setCurrentTransfer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    modelNo: '',
    fromOwner: '',
    toOwner: '',
    quantity: '',
    transferMethod: '',
    description: '',
    category: '',
  });

  // Receive Dialog
  const [receiveDialog, setReceiveDialog] = useState(false);
  const [receiveQty, setReceiveQty] = useState('');
  const [receivingTransfer, setReceivingTransfer] = useState(null);
  const [scannedList, setScannedList] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');

  // Scanner buffer (keyboard wedge scanners)
  const scannerBuffer = useRef('');
  const scannerTimer = useRef(null);
  const scanInputRef = useRef(null);

  const showAlert = useCallback((title, message, actions = null) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertActions(actions);
    setAlertOpen(true);
  }, []);

  const showConfirm = useCallback((title, message, onConfirm) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertActions(
      <>
        <Button onClick={() => setAlertOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setAlertOpen(false);
            onConfirm();
          }}
          color="error"
          autoFocus
        >
          Delete
        </Button>
      </>
    );
    setAlertOpen(true);
  }, []);

  const fetchTransfers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/self-transfer`);
      if (!response.ok) throw new Error('Failed to fetch transfers');
      const data = await response.json();

      if (user?.role && user?.role !== 'admin') {
        setTransfers((data || []).filter((t) => t.storeName === user.role));
      } else {
        setTransfers(data || []);
      }
    } catch (err) {
      console.error(err);
      showAlert('Error', err.message || 'Failed to load transfers');
    } finally {
      setLoading(false);
    }
  }, [user?.role, showAlert]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleEditOpen = (transfer) => {
    setCurrentTransfer(transfer);
    setEditFormData({
      modelNo: transfer.modelNo,
      fromOwner: transfer.fromOwner,
      toOwner: transfer.toOwner,
      quantity: transfer.quantity,
      transferMethod: transfer.transferMethod,
      description: transfer.description,
      category: transfer.category || '',
    });
    setShowEditDialog(true);
  };

  const handleEditClose = () => {
    setShowEditDialog(false);
    setCurrentTransfer(null);
  };

  const handleEditSubmit = async () => {
    if (!currentTransfer?._id) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/self-transfer/${currentTransfer._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error('Failed to update transfer');
      showAlert('Success', 'Transfer updated successfully');
      setShowEditDialog(false);
      fetchTransfers();
    } catch (err) {
      showAlert('Error', err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    showConfirm('Confirm Delete', 'Are you sure you want to delete this transfer record?', async () => {
      try {
        const response = await fetch(`${API_BASE}/self-transfer/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete transfer');
        showAlert('Success', 'Transfer record deleted');
        fetchTransfers();
      } catch (err) {
        showAlert('Error', err.message || 'Delete failed');
      }
    });
  };

  const handleReceiveStock = (transfer) => {
    setReceivingTransfer(transfer);
    setReceiveQty(String(transfer.quantity ?? ''));
    setScannedList([]);
    setBarcodeInput('');
    setReceiveDialog(true);

    // focus scan input after dialog renders
    setTimeout(() => scanInputRef.current?.focus(), 50);
  };

  const processBarcode = useCallback(
    (overrideRaw) => {
      const raw = String(overrideRaw || barcodeInput || '').trim();
      if (!raw) return;
      if (!receivingTransfer) return;

      if (scannedList.includes(raw)) {
        showAlert('Error', 'This barcode is already scanned');
        setBarcodeInput('');
        return;
      }

      const limit = Number(receiveQty);
      if (limit > 0 && scannedList.length >= limit) {
        showAlert('Info', `Quantity limit reached: ${limit}`);
        setBarcodeInput('');
        return;
      }

      if (Array.isArray(receivingTransfer.scannedBarcode) && receivingTransfer.scannedBarcode.length > 0) {
        const availableBarcodes = receivingTransfer.scannedBarcode.map((b) => String(b).trim());
        if (!availableBarcodes.includes(raw)) {
          showAlert('Error', 'Scanned barcode not found in this transfer record');
          setBarcodeInput('');
          return;
        }
      }

      setScannedList((prev) => [...prev, raw]);
      setBarcodeInput('');
    },
    [barcodeInput, receivingTransfer, scannedList, receiveQty, showAlert]
  );

  const handleScanKeyDown = (e) => {
    if (!scannerBuffer.current) scannerBuffer.current = '';

    if (e.key === 'Enter') {
      e.preventDefault();
      const code = scannerBuffer.current;
      if (code) processBarcode(code);
      scannerBuffer.current = '';
      return;
    }

    if (e.key.length === 1) {
      scannerBuffer.current += e.key;
    }

    clearTimeout(scannerTimer.current);
    scannerTimer.current = setTimeout(() => {
      const code = scannerBuffer.current;
      if (code) processBarcode(code);
      scannerBuffer.current = '';
    }, 200);
  };

  const handleReceiveSubmit = async () => {
    if (!receivingTransfer?._id) return;

    if (!receiveQty || Number(receiveQty) <= 0) {
      showAlert('Error', 'Please enter a valid quantity');
      return;
    }
    if (Number(receiveQty) > Number(receivingTransfer.quantity || 0)) {
      showAlert('Error', 'Quantity cannot exceed transferred amount');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/self-transfer/${receivingTransfer._id}/receive`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantityToReceive: receiveQty,
            storeName: user?.role,
            owner: user?.role,
            scannedBarcode: scannedList,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to receive stock');
      }

      showAlert('Success', data.message || 'Stock received');
      setReceiveDialog(false);
      setReceivingTransfer(null);
      fetchTransfers();
    } catch (err) {
      showAlert('Error', err.message || 'Receive failed');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = useMemo(() => Math.ceil(transfers.length / itemsPerPage), [transfers.length]);
  const currentItems = useMemo(
    () => transfers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [transfers, currentPage]
  );

  const styles = {
    container: { padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' },
    title: { fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '24px' },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      backgroundColor: '#f8fafc',
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#475569',
      textTransform: 'uppercase',
      borderBottom: '1px solid #e2e8f0',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '14px',
      color: '#334155',
      verticalAlign: 'top',
    },
  };

  if (loading && transfers.length === 0) {
    return <Typography sx={{ p: 4 }}>Loading transfers...</Typography>;
  }

  return (
    <div style={styles.container}>
      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        actions={alertActions}
      />

      <h1 style={styles.title}>Stock Transfers</h1>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Model No</th>
              <th style={styles.th}>From Owner</th>
              <th style={styles.th}>To Owner</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Sub Category</th>
              <th style={styles.th}>Barcode</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((t) => (
                <tr key={t._id}>
                  <td style={styles.td}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td style={styles.td}>{t.modelNo || 'N/A'}</td>
                  <td style={styles.td}>{t.fromOwner || 'N/A'}</td>
                  <td style={styles.td}>{t.toOwner || 'N/A'}</td>
                  <td style={styles.td}>{t.category || 'N/A'}</td>
                  <td style={styles.td}>{t.subCategory || 'N/A'}</td>
                  <td style={styles.td}>
                    {Array.isArray(t.scannedBarcode)
                      ? t.scannedBarcode.join(', ')
                      : t.scannedBarcode || 'N/A'}
                  </td>
                  <td style={styles.td}>{t.productPrice || 0}</td>
                  <td style={styles.td}>{t.quantity ?? 0}</td>
                  <td style={styles.td}>{t.transferMethod || 'N/A'}</td>
                  <td style={styles.td}>{t.description || 'N/A'}</td>
                  <td style={styles.td}>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleReceiveStock(t)}
                        title="Transfer to Stock Inward"
                      >
                        <MoveToInboxIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => handleEditOpen(t)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(t._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} style={{ ...styles.td, textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                  No transfer records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {currentItems.length} of {transfers.length} records
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, v) => setCurrentPage(v)}
            color="primary"
            variant="outlined"
            shape="rounded"
            size="small"
          />
        </div>
      </div>

      {/* EDIT DIALOG */}
      <Dialog open={showEditDialog} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Transfer Record</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>To Owner</InputLabel>
              <Select
                value={editFormData.toOwner}
                label="To Owner"
                onChange={(e) => setEditFormData((p) => ({ ...p, toOwner: e.target.value }))}
              >
                <MenuItem value="CCTV Shoppee Avadi.">CCTV Shoppee Avadi.</MenuItem>
                <MenuItem value="Lookman CCTV Avadi.">Lookman CCTV Avadi.</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={editFormData.quantity}
              onChange={(e) => setEditFormData((p) => ({ ...p, quantity: e.target.value }))}
            />

            <FormControl fullWidth required>
              <InputLabel>Transfer Method</InputLabel>
              <Select
                value={editFormData.transferMethod}
                label="Transfer Method"
                onChange={(e) => setEditFormData((p) => ({ ...p, transferMethod: e.target.value }))}
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
              value={editFormData.description}
              onChange={(e) => setEditFormData((p) => ({ ...p, description: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary" startIcon={<SaveIcon />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* RECEIVE DIALOG */}
      <Dialog open={receiveDialog} onClose={() => setReceiveDialog(false)}>
        <DialogTitle>Receive Stock</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            How many units of <strong>{receivingTransfer?.modelNo}</strong> do you want to receive into{' '}
            <strong>{receivingTransfer?.toOwner}</strong>?
          </Typography>

          <Typography variant="caption" display="block" sx={{ mb: 2, color: 'text.secondary' }}>
            Available from transfer: {receivingTransfer?.quantity ?? 0}
          </Typography>

          <TextField
            autoFocus
            margin="dense"
            label="Quantity to Receive"
            type="number"
            fullWidth
            value={receiveQty}
            onChange={(e) => setReceiveQty(e.target.value)}
            helperText={
              Number(receiveQty) === Number(receivingTransfer?.quantity)
                ? 'Full quantity will remove this record.'
                : 'Partial receive will keep record with remaining qty.'
            }
          />

          <TextField
            margin="dense"
            label="Scan Barcode"
            fullWidth
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={handleScanKeyDown}
            inputRef={scanInputRef}
            helperText="Scan barcode to verify"
          />

          <TextField
            margin="dense"
            label="Scanned Codes"
            fullWidth
            multiline
            rows={2}
            value={scannedList.join(', ')}
            InputProps={{ readOnly: true }}
            helperText={`Scanned: ${scannedList.length} / ${receiveQty || 0}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiveDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleReceiveSubmit} variant="contained" color="success" startIcon={<MoveToInboxIcon />}>
            Receive Stock
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SelfTransferPage;
