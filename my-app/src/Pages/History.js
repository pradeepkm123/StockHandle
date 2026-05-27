// import React, { useState, useEffect } from 'react';
// import { useUser } from './UserContext';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';

// const API_BASE = 'https://stockhandle.onrender.com/api';

// function History() {
//   const { user } = useUser();
//   const [stockMovements, setStockMovements] = useState([]);
//   const [filteredMovements, setFilteredMovements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedMovement, setSelectedMovement] = useState(null);
//   const [showBillModal, setShowBillModal] = useState(false);
//   const [customer, setCustomer] = useState(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   // Fetch customer by mobile number
//   const fetchCustomerByMobile = async (mobile) => {
//     try {
//       const response = await fetch(`${API_BASE}/customers?mobile=${mobile}`);
//       const data = await response.json();
//       if (data.length > 0) {
//         setCustomer(data[0]);
//       } else {
//         setCustomer(null);
//       }
//     } catch (error) {
//       console.error("Error fetching customer:", error);
//       setCustomer(null);
//     }
//   };

//   // Fetch all stock movements
//   const fetchStockMovements = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE}/stock-outward`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const result = await response.json();
//       console.log("API Response:", result);
//       if (result.success && Array.isArray(result.data)) {
//         setStockMovements(result.data);
//         const dataToUse = user?.role
//           ? result.data.filter(
//             (m) =>
//               m.storeName &&
//               m.storeName.toLowerCase() === user.role.toLowerCase()
//           )
//           : result.data;
//         setFilteredMovements(dataToUse);
//         setTotalPages(Math.ceil(dataToUse.length / itemsPerPage));
//       } else {
//         throw new Error(result.error || 'Invalid API response structure');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching stock movements:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle view button click
//   const handleView = async (movement) => {
//     setSelectedMovement(movement);
//     if (movement.customerMobile) {
//       await fetchCustomerByMobile(movement.customerMobile);
//     }
//     setShowBillModal(true);
//   };

//   // Handle delete button click
//   const handleDelete = (id) => {
//     setItemToDelete(id);
//     setOpenDeleteDialog(true);
//   };

//   // Handle delete confirmation
//   const handleDeleteConfirm = (id) => {
//     fetch(`${API_BASE}/stock-outward/${id}`, {
//       method: 'DELETE',
//     })
//       .then((response) => {
//         if (!response.ok) throw new Error('Failed to delete');
//         fetchStockMovements();
//       })
//       .catch((err) => {
//         setError(err.message);
//       });
//   };

//   // Download invoice as PDF
//   const downloadInvoiceAsPDF = () => {
//     const input = document.getElementById('invoice-content');
//     input.style.padding = '40px';
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgWidth = 210;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
//       pdf.save(`invoice_${selectedMovement._id}.pdf`);
//     });
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem);
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Fetch stock movements on component mount or when user role changes
//   useEffect(() => {
//     fetchStockMovements();
//   }, [user?.role, itemsPerPage]);

//   // Styles
//   const styles = {
//     container: {
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       backgroundColor: '#f8fafc',
//       minHeight: '100vh',
//       padding: '24px',
//     },
//     header: {
//       display: 'flex',
//       alignItems: 'center',
//       gap: '12px',
//       marginBottom: '8px',
//     },
//     headerIcon: {
//       width: '32px',
//       height: '32px',
//       color: '#3b82f6',
//     },
//     title: {
//       fontSize: '28px',
//       fontWeight: '700',
//       color: '#1f2937',
//       margin: 0,
//     },
//     subtitle: {
//       fontSize: '16px',
//       color: '#6b7280',
//       margin: '0 0 32px 44px',
//     },
//     tableContainer: {
//       backgroundColor: 'white',
//       borderRadius: '12px',
//       boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//       border: '1px solid #e5e7eb',
//       overflow: 'hidden',
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//       textAlign: 'center',
//     },
//     tableHeader: {
//       borderBottom: '1px solid #e5e7eb',
//       backgroundColor: '#f9fafb',
//     },
//     th: {
//       padding: '12px',
//       fontSize: '12px',
//       fontWeight: '500',
//       color: '#6b7280',
//       textTransform: 'uppercase',
//       letterSpacing: '0.05em',
//     },
//     td: {
//       padding: '12px',
//       borderBottom: '1px solid #f3f4f6',
//       fontSize: '14px',
//       color: '#374151',
//     },
//     modal: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: 1000,
//     },
//     modalContent: {
//       backgroundColor: 'white',
//       padding: '20px',
//       borderRadius: '8px',
//       maxWidth: '80%',
//       maxHeight: '80%',
//       overflow: 'auto',
//     },
//   };

//   // Loading and error states
//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>
//           Loading stock movements...
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

//   // Main component render
//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//         <h1 style={styles.title}>Stock Movement History</h1>
//       </div>
//       <p style={styles.subtitle}>Track all inventory transactions</p>
//       <div style={styles.tableContainer}>
//         {filteredMovements.length > 0 ? (
//           <>
//             <table style={styles.table}>
//               <thead style={styles.tableHeader}>
//                 <tr>
//                   <th style={styles.th}>ACTIVITY NAME</th>
//                   <th style={styles.th}>MODEL NO</th>
//                   <th style={styles.th}>CATEGORY</th>
//                   <th style={styles.th}>SUB CATEGORY</th>
//                   <th style={styles.th}>QUANTITY</th>
//                   <th style={styles.th}>CUSTOMER NAME</th>
//                   <th style={styles.th}>MOBILE</th>
//                   <th style={styles.th}>ADDRESS</th>
//                   <th style={styles.th}>STORE</th>
//                   <th style={styles.th}>DATE</th>
//                   <th style={styles.th}>PRICE</th>
//                   <th style={styles.th}>SCANNED CODES</th>
//                   <th style={styles.th}>UPDATED AT</th>
//                   <th style={styles.th}>ACTIONS</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.map((m, idx) => (
//                   <tr key={idx}>
//                     <td style={styles.td}>{m.reason === 'Stock Outward' ? 'Store Inward' : (m.reason || 'Store Inward')}</td>
//                     <td style={styles.td}>{m.modelNo || 'N/A'}</td>
//                     <td style={styles.td}>{m.category || 'N/A'}</td>
//                     <td style={styles.td}>{m.subCategory || 'N/A'}</td>
//                     <td style={styles.td}>{m.quantity ?? 'N/A'}</td>
//                     <td style={styles.td}>{m.customerName || 'N/A'}</td>
//                     <td style={styles.td}>{m.customerMobile || 'N/A'}</td>
//                     <td style={styles.td}>{m.customerAddress || 'N/A'}</td>
//                     <td style={styles.td}>{m.storeName || 'N/A'}</td>
//                     <td style={styles.td}>
//                       {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td style={styles.td}>
//                       {m.price ? `₹${m.price.toLocaleString()}` : 'N/A'}
//                     </td>
//                     <td style={styles.td}>
//                       {m.scannedList && m.scannedList.length > 0
//                         ? m.scannedList.join(', ')
//                         : m.scannedCodes || 'N/A'}
//                     </td>
//                     <td style={styles.td}>
//                       {m.updatedAt ? new Date(m.updatedAt).toLocaleString() : 'N/A'}
//                     </td>
//                     <td style={styles.td}>
//                       <button
//                         onClick={() => handleView(m)}
//                         style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}
//                         title="View"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//                           <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
//                           <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
//                         </svg>
//                       </button>
//                       <button
//                         onClick={() => handleDelete(m._id)}
//                         style={{ background: 'none', border: 'none', cursor: 'pointer' }}
//                         title="Delete"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//                           <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
//                           <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
//                         </svg>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
//               <div style={{ fontSize: '14px', color: '#6b7280' }}>
//                 Showing {filteredMovements.length} record{filteredMovements.length !== 1 ? 's' : ''}
//               </div>
//               <div style={{ display: 'flex', gap: '8px' }}>
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
//                   <button
//                     key={num}
//                     onClick={() => paginate(num)}
//                     style={{
//                       padding: '8px 12px',
//                       border: '1px solid #e5e7eb',
//                       backgroundColor: currentPage === num ? '#3b82f6' : 'white',
//                       color: currentPage === num ? 'white' : '#374151',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     {num}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </>
//         ) : (
//           <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
//             No stock movements recorded{user?.role ? ` for ${user.role}` : ''}.
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {"Confirm Deletion"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete this record? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={() => {
//               handleDeleteConfirm(itemToDelete);
//               setOpenDeleteDialog(false);
//             }}
//             color="error"
//             autoFocus
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bill Modal */}
//       {showBillModal && selectedMovement && (
//         <div style={styles.modal}>
//           <div style={styles.modalContent}>
//             <div id="invoice-content" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
//                 <div>
//                   <h1 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>Invoice</h1>
//                   <p style={{ margin: '0 0 5px 0' }}><strong>Date of issue:</strong> {selectedMovement.createdAt ? new Date(selectedMovement.createdAt).toLocaleDateString() : 'N/A'}</p>
//                   <p style={{ margin: '0 0 20px 0' }}><strong>Date due:</strong> {selectedMovement.createdAt ? new Date(selectedMovement.createdAt).toLocaleDateString() : 'N/A'}</p>
//                   <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>From,</p>
//                   <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{user?.role || 'Store Name'}</p>
//                 </div>
//                 <div style={{ textAlign: 'right' }}>
//                   <p style={{ margin: '0 0 5px 0' }}><strong>Invoice number:</strong> INV-{selectedMovement._id}</p>
//                   <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Bill to</p>
//                   <p style={{ margin: '0 0 5px 0' }}>{customer?.customerName || selectedMovement.customerName || 'N/A'}</p>
//                   <p style={{ margin: '0 0 5px 0' }}>{customer?.customerAddress || selectedMovement.customerAddress || 'N/A'}</p>
//                   <p style={{ margin: '0 0 5px 0' }}>{customer?.customerMobile || selectedMovement.customerMobile || 'N/A'}</p>
//                 </div>
//               </div>
//               <div style={{ margin: '20px 0' }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                   <thead>
//                     <tr style={{ borderBottom: '1px solid #ddd' }}>
//                       <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
//                       <th style={{ textAlign: 'right', padding: '8px' }}>Qty</th>
//                       <th style={{ textAlign: 'right', padding: '8px' }}>Unit price</th>
//                       <th style={{ textAlign: 'right', padding: '8px' }}>Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr style={{ borderBottom: '1px solid #ddd' }}>
//                       <td style={{ padding: '8px' }}>
//                         <p style={{ margin: '0' }}>{selectedMovement.modelNo || 'N/A'}</p>
//                         <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
//                           {selectedMovement.createdAt ? new Date(selectedMovement.createdAt).toLocaleDateString() : 'N/A'}
//                         </p>
//                       </td>
//                       <td style={{ padding: '8px', textAlign: 'right' }}>{selectedMovement.quantity || 'N/A'}</td>
//                       <td style={{ padding: '8px', textAlign: 'right' }}>₹{selectedMovement.price?.toLocaleString() || '0.00'}</td>
//                       <td style={{ padding: '8px', textAlign: 'right' }}>
//                         ₹{selectedMovement.price && selectedMovement.quantity
//                           ? (selectedMovement.price * selectedMovement.quantity).toLocaleString()
//                           : '0.00'}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//               <div style={{ marginTop: '20px', textAlign: 'right' }}>
//                 <p style={{ margin: '0 0 5px 0' }}><strong>Subtotal:</strong> ₹{selectedMovement.price && selectedMovement.quantity
//                   ? (selectedMovement.price * selectedMovement.quantity).toLocaleString()
//                   : '0.00'}</p>
//                 <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}><strong>Total Amount:</strong> ₹{selectedMovement.price && selectedMovement.quantity
//                   ? (selectedMovement.price * selectedMovement.quantity).toLocaleString()
//                   : '0.00'}</p>
//               </div>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
//               <button
//                 onClick={() => setShowBillModal(false)}
//                 style={{
//                   padding: '8px 16px',
//                   backgroundColor: '#6c757d',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Close
//               </button>
//               <button
//                 onClick={downloadInvoiceAsPDF}
//                 style={{
//                   padding: '8px 16px',
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 Download
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default History;

import React, { useState, useEffect } from 'react';
import { useUser } from './UserContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';
import Spinner from '../Components/Spinner';

const API_BASE = 'https://stockhandle-taxr.onrender.com/api';

function History() {
  const { user } = useUser();
  const [stockMovements, setStockMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch customer by mobile number
  const fetchCustomerByMobile = async (mobile) => {
    try {
      const response = await fetch(`${API_BASE}/customers?mobile=${mobile}`);
      const data = await response.json();
      if (data.length > 0) {
        setCustomer(data[0]);
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      setCustomer(null);
    }
  };

  // Fetch stock movements with pagination
  const fetchStockMovements = async () => {
    try {
      setLoading(true);
      const storeParam = user?.role ? `&storeName=${user.role}` : '';
      const response = await fetch(`${API_BASE}/stock-outward?page=${currentPage}&limit=${itemsPerPage}${storeParam}`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setStockMovements(result.data);
        setFilteredMovements(result.data);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
          setTotalItems(result.pagination.totalItems);
        }
      } else {
        throw new Error(result.error || 'Invalid API response structure');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stock movements:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle view button click
  const handleView = async (movement) => {
    setSelectedMovement(movement);
    if (movement.customerMobile) {
      await fetchCustomerByMobile(movement.customerMobile);
    }
    setShowBillModal(true);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id) => {
    fetch(`${API_BASE}/stock-outward/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete');
        fetchStockMovements();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // Download invoice as PDF
  const downloadInvoiceAsPDF = () => {
    const input = document.getElementById('invoice-content');
    input.style.padding = '40px';
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice_${selectedMovement._id}.pdf`);
    });
  };

  // Export stock movements to Excel
  const handleExportExcel = async () => {
    try {
      const storeParam = user?.role ? `&storeName=${user.role}` : '';
      const response = await fetch(`${API_BASE}/stock-outward?page=1&limit=0${storeParam}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const dataToExport = result.data.map((m) => ({
          'ACTIVITY NAME': m.reason === 'Stock Outward' ? 'Store Inward' : (m.reason || 'Store Inward'),
          'MODEL NO': m.modelNo || 'N/A',
          'CATEGORY': m.category || 'N/A',
          'SUB CATEGORY': m.subCategory || 'N/A',
          'QUANTITY': m.quantity ?? 'N/A',
          'CUSTOMER NAME': m.customerName || 'N/A',
          'MOBILE': m.customerMobile || 'N/A',
          'ADDRESS': m.customerAddress || 'N/A',
          'STORE': m.storeName || 'N/A',
          'DATE': m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A',
          'PRICE': m.price ? `₹${m.price.toLocaleString()}` : 'N/A',
          'SCANNED CODES': m.scannedList && m.scannedList.length > 0
            ? m.scannedList.join(', ')
            : m.scannedCodes || 'N/A',
          'UPDATED AT': m.updatedAt ? new Date(m.updatedAt).toLocaleString() : 'N/A'
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Movements');
        XLSX.writeFile(workbook, 'Stock_Movement_History.xlsx');
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error exporting Excel:', err);
      alert('Failed to export Excel report: ' + err.message);
    }
  };

  // Pagination logic
  const currentItems = stockMovements;
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Fetch stock movements when page or user role changes
  useEffect(() => {
    fetchStockMovements();
  }, [user?.role, currentPage, itemsPerPage]);

  // Styles
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '24px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    headerIcon: {
      width: '32px',
      height: '32px',
      color: '#3b82f6',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      margin: 0,
    },
    subtitle: {
      fontSize: '16px',
      color: '#6b7280',
      margin: '0 0 32px 44px',
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'center',
    },
    tableHeader: {
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
    },
    th: {
      padding: '12px',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #f3f4f6',
      fontSize: '14px',
      color: '#374151',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '80%',
      maxHeight: '80%',
      overflow: 'auto',
    },
  };

  // Loading and error states
  if (loading) {
    return (
      <div style={styles.container}>
        <Spinner message="Loading stock movements..." />
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

  // Main component render
  return (
    <div style={styles.container}>
      <div style={{ ...styles.header, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 style={styles.title}>Stock Movement History</h1>
        </div>
        <button
          onClick={handleExportExcel}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
          }}
          title="Export Excel Report"
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 2C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V8L16 2H4Z" fill="#107c41" />
            <path d="M16 2V8H22L16 2Z" fill="#1f9a55" />
            <text x="5" y="17" fill="white" fontSize="6px" fontWeight="bold" fontFamily="system-ui, sans-serif">XLS</text>
          </svg>
        </button>
      </div>
      <p style={styles.subtitle}>Track all inventory transactions</p>
      <div style={styles.tableContainer}>
        {filteredMovements.length > 0 ? (
          <>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>ACTIVITY NAME</th>
                  <th style={styles.th}>MODEL NO</th>
                  <th style={styles.th}>CATEGORY</th>
                  <th style={styles.th}>SUB CATEGORY</th>
                  <th style={styles.th}>QUANTITY</th>
                  <th style={styles.th}>CUSTOMER NAME</th>
                  <th style={styles.th}>MOBILE</th>
                  <th style={styles.th}>ADDRESS</th>
                  <th style={styles.th}>STORE</th>
                  <th style={styles.th}>DATE</th>
                  <th style={styles.th}>PRICE</th>
                  <th style={styles.th}>SCANNED CODES</th>
                  <th style={styles.th}>UPDATED AT</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((m, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{m.reason === 'Stock Outward' ? 'Store Inward' : (m.reason || 'Store Inward')}</td>
                    <td style={styles.td}>{m.modelNo || 'N/A'}</td>
                    <td style={styles.td}>{m.category || 'N/A'}</td>
                    <td style={styles.td}>{m.subCategory || 'N/A'}</td>
                    <td style={styles.td}>{m.quantity ?? 'N/A'}</td>
                    <td style={styles.td}>{m.customerName || 'N/A'}</td>
                    <td style={styles.td}>{m.customerMobile || 'N/A'}</td>
                    <td style={styles.td}>{m.customerAddress || 'N/A'}</td>
                    <td style={styles.td}>{m.storeName || 'N/A'}</td>
                    <td style={styles.td}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={styles.td}>
                      {m.price ? `₹${m.price.toLocaleString()}` : 'N/A'}
                    </td>
                    <td style={{ ...styles.td, wordBreak: 'break-all' }}>
                      {(() => {
                        if (m.scannedList && m.scannedList.length > 0) {
                          return m.scannedList.join(', ');
                        }
                        const val = m.scannedCodes;
                        if (!val) return 'N/A';
                        if (Array.isArray(val)) {
                          return val.map(v => typeof v === 'string' ? v.trim() : String(v)).join(', ');
                        }
                        const str = String(val).trim();
                        if (str.includes(',') || str.includes(' ')) return str;
                        return str.split(/(?=[A-Z]{2,}[-_])/).filter(Boolean).join(', ');
                      })()}
                    </td>
                    <td style={styles.td}>
                      {m.updatedAt ? new Date(m.updatedAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Showing <span style={{ fontWeight: '600' }}>{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span style={{ fontWeight: '600' }}>{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span style={{ fontWeight: '600' }}>{totalItems}</span> records
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="itemsPerPage" style={{ fontSize: '14px', color: '#6b7280' }}>Rows:</label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px',
                      color: '#374151',
                      outline: 'none'
                    }}
                  >
                    {[5, 10, 20, 50, 100].map(val => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    color: currentPage === 1 ? '#9ca3af' : '#374151',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                  // Only show current page, first, last, and pages around current
                  if (num === 1 || num === totalPages || (num >= currentPage - 1 && num <= currentPage + 1)) {
                    return (
                      <button
                        key={num}
                        onClick={() => paginate(num)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #e5e7eb',
                          backgroundColor: currentPage === num ? '#3b82f6' : 'white',
                          color: currentPage === num ? 'white' : '#374151',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          minWidth: '40px',
                          fontSize: '14px'
                        }}
                      >
                        {num}
                      </button>
                    );
                  } else if (num === currentPage - 2 || num === currentPage + 2) {
                    return <span key={num} style={{ alignSelf: 'center', color: '#6b7280' }}>...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    color: currentPage === totalPages ? '#9ca3af' : '#374151',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            No stock movements recorded{user?.role ? ` for ${user.role}` : ''}.
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteConfirm(itemToDelete);
              setOpenDeleteDialog(false);
            }}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bill Modal */}
      {showBillModal && selectedMovement && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div id="invoice-content" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>Invoice</h1>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Date of issue:</strong> {selectedMovement.createdAt ? new Date(selectedMovement.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p style={{ margin: '0 0 20px 0' }}><strong>Date due:</strong> {selectedMovement.createdAt ? new Date(selectedMovement.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>From,</p>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{user?.role || 'Store Name'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Invoice number:</strong> INV-{selectedMovement._id}</p>
                  <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Bill to</p>
                  <p style={{ margin: '0 0 5px 0' }}>{customer?.customerName || selectedMovement.customerName || 'N/A'}</p>
                  <p style={{ margin: '0 0 5px 0' }}>{customer?.customerAddress || selectedMovement.customerAddress || 'N/A'}</p>
                  <p style={{ margin: '0 0 5px 0' }}>{customer?.customerMobile || selectedMovement.customerMobile || 'N/A'}</p>
                </div>
              </div>
              <div style={{ margin: '20px 0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
                      <th style={{ textAlign: 'right', padding: '8px' }}>Qty</th>
                      <th style={{ textAlign: 'right', padding: '8px' }}>Unit price</th>
                      <th style={{ textAlign: 'right', padding: '8px' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '8px' }}>
                        <p style={{ margin: '0' }}>{selectedMovement.modelNo || 'N/A'}</p>
                        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                          {selectedMovement.createdAt ? new Date(selectedMovement.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>{selectedMovement.quantity || 'N/A'}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>₹{selectedMovement.price?.toLocaleString() || '0.00'}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>
                        ₹{selectedMovement.price && selectedMovement.quantity
                          ? (selectedMovement.price * selectedMovement.quantity).toLocaleString()
                          : '0.00'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <p style={{ margin: '0 0 5px 0' }}><strong>Subtotal:</strong> ₹{selectedMovement.price && selectedMovement.quantity
                  ? (selectedMovement.price * selectedMovement.quantity).toLocaleString()
                  : '0.00'}</p>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}><strong>Total Amount:</strong> ₹{selectedMovement.price && selectedMovement.quantity
                  ? (selectedMovement.price * selectedMovement.quantity).toLocaleString()
                  : '0.00'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setShowBillModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={downloadInvoiceAsPDF}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
