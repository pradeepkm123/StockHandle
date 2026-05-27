// import React, { useState, useEffect } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
//   IconButton, TablePagination, Snackbar, Alert, Box, Typography
// } from '@mui/material';
// import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
// import axios from 'axios';
// import { useUser } from './UserContext';

// const API_BASE = 'https://stockhandle.onrender.com';

// const StoreCustomer = () => {
//   const { user } = useUser();
//   const [customers, setCustomers] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [currentCustomer, setCurrentCustomer] = useState({
//     storeName: user?.role || '',
//     customerName: '',
//     gst: '',
//     address: '',
//     mailId: '',
//     phoneNo: '',
//     storeHandler: '',
//   });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('info');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCustomers();
//   }, [user?.role]);

//   const fetchCustomers = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE}/api/storecustomers`, {
//         params: { storeName: user?.role }
//       });
//       setCustomers(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//       showSnackbar('Error fetching customers', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenDialog = (customer = null) => {
//     setCurrentCustomer(customer || {
//       storeName: user?.role || '',
//       customerName: '',
//       gst: '',
//       address: '',
//       mailId: '',
//       phoneNo: '',
//       storeHandler: '',
//     });
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const showSnackbar = (message, severity = 'info') => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setSnackbarOpen(true);
//   };

//    const handleSaveCustomer = async () => {
//     if (!currentCustomer.storeName || !currentCustomer.customerName || !currentCustomer.phoneNo ||
//       !currentCustomer.gst || !currentCustomer.address || !currentCustomer.mailId || !currentCustomer.storeHandler) {
//       showSnackbar("All fields are required", "error");
//       return;
//     }

//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(currentCustomer.phoneNo)) {
//       showSnackbar("Please enter a valid 10-digit phone number", "error");
//       return;
//   }

//   if (currentCustomer.mailId && !/\S+@\S+\.\S+/.test(currentCustomer.mailId)) {
//     showSnackbar("Please enter a valid email address", "error");
//     return;
//   }

//   try {
//     if (currentCustomer._id) {
//       await axios.put(`${API_BASE}/api/storecustomers/${currentCustomer._id}`, currentCustomer);
//       showSnackbar('Customer updated successfully!', 'success');
//     } else {
//       await axios.post(`${API_BASE}/api/storecustomers`, currentCustomer);
//       showSnackbar('Customer added successfully!', 'success');
//     }
//     fetchCustomers();
//     handleCloseDialog();
//   } catch (error) {
//     console.error('Error saving customer:', error.response?.data || error.message);
//     showSnackbar(error.response?.data?.error || 'Error saving customer', 'error');
//   }
// };
//   const handleDeleteCustomer = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this customer?')) {
//       return;
//     }
//     try {
//       await axios.delete(`${API_BASE}/api/storecustomers/${id}`);
//       showSnackbar('Customer deleted successfully!', 'success');
//       fetchCustomers();
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//       showSnackbar(error.response?.data?.error || 'Error deleting customer', 'error');
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleInputChange = (field, value) => {
//     setCurrentCustomer(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           Store Customers
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<AddIcon />}
//           onClick={() => handleOpenDialog()}
//           sx={{ borderRadius: 2 }}
//         >
//           Add Customer
//         </Button>
//       </Box>
//       <TableContainer component={Paper} elevation={3}>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: 'primary.main' }}>
//               <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Store Name</TableCell>
//               <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer Name</TableCell>
//               <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>GST</TableCell>
//               <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
//               <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mail ID</TableCell>
//               <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone No</TableCell>
//               <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Store Handler</TableCell>
//               <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
//                   Loading customers...
//                 </TableCell>
//               </TableRow>
//             ) : customers.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
//                   No customers found. Add your first customer!
//                 </TableCell>
//               </TableRow>
//             ) : (
//               customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer) => (
//                 <TableRow key={customer._id} hover>
//                   <TableCell>{customer.storeName}</TableCell>
//                   <TableCell sx={{ fontWeight: 'medium' }}>{customer.customerName}</TableCell>
//                   <TableCell>{customer.gst || '-'}</TableCell>
//                   <TableCell>{customer.address || '-'}</TableCell>
//                   <TableCell>{customer.mailId || '-'}</TableCell>
//                   <TableCell>{customer.phoneNo}</TableCell>
//                   <TableCell>{customer.storeHandler || '-'}</TableCell>
//                   <TableCell>
//                     <IconButton
//                       onClick={() => handleOpenDialog(customer)}
//                       color="primary"
//                       sx={{ mr: 1 }}
//                     >
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDeleteCustomer(customer._id)}
//                       color="error"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={customers.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
//         <DialogTitle>
//           <Typography variant="h6" component="div">
//             {currentCustomer._id ? 'Edit Customer' : 'Add New Customer'}
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ pt: 2 }}>
//             <TextField
//               label="Store Name"
//               fullWidth
//               value={currentCustomer.storeName}
//               onChange={(e) => handleInputChange('storeName', e.target.value)}
//               margin="normal"
//               disabled={!!user?.role}
//               required
//             />
//             <TextField
//               label="Customer Name *"
//               fullWidth
//               value={currentCustomer.customerName}
//               onChange={(e) => handleInputChange('customerName', e.target.value)}
//               margin="normal"
//               required
//             />
//             <TextField
//               label="GST Number *"
//               label="GST Number"
//               fullWidth
//               value={currentCustomer.gst}
//               onChange={(e) => handleInputChange('gst', e.target.value)}
//               margin="normal"
//               required
//             />
//             <TextField
//               label="Address *"
//             />
//             <TextField
//               label="Address"
//               fullWidth
//               multiline
//               rows={2}
//               value={currentCustomer.address}
//               onChange={(e) => handleInputChange('address', e.target.value)}
//               margin="normal"
//               required
//             />
//             <TextField
//               label="Email ID *"
//             />
//             <TextField
//               label="Email ID"
//               fullWidth
//               type="email"
//               value={currentCustomer.mailId}
//               onChange={(e) => handleInputChange('mailId', e.target.value)}
//               margin="normal"
//               required
//             />
//             <TextField
//               label="Phone Number *"
//               fullWidth
//               value={currentCustomer.phoneNo}
//               onChange={(e) => handleInputChange('phoneNo', e.target.value)}
//               margin="normal"
//               required
//               inputProps={{ maxLength: 10 }}
//             />
//             <TextField
//               label="Store Handler *"
//               label="Store Handler"
//               fullWidth
//               value={currentCustomer.storeHandler}
//               onChange={(e) => handleInputChange('storeHandler', e.target.value)}
//               margin="normal"
//               required
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2 }}>
//           <Button onClick={handleCloseDialog} color="inherit">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSaveCustomer}
//             variant="contained"
//             disabled={!currentCustomer.storeName || !currentCustomer.customerName || !currentCustomer.phoneNo ||
//               !currentCustomer.gst || !currentCustomer.address || !currentCustomer.mailId || !currentCustomer.storeHandler}
//             color="primary"
//             disabled={!currentCustomer.storeName || !currentCustomer.customerName || !currentCustomer.phoneNo}
//           >
//             {currentCustomer._id ? 'Update' : 'Save'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setSnackbarOpen(false)}
//           severity={snackbarSeverity}
//           sx={{ width: '100%' }}
//           variant="filled"
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default StoreCustomer;




import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, TablePagination, Snackbar, Alert, Box, Typography
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { useUser } from './UserContext';

const API_BASE = 'https://stockhandle-taxr.onrender.com';

const StoreCustomer = () => {
  const { user } = useUser();
  const [customers, setCustomers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    storeName: user?.role || '',
    customerName: '',
    gst: '',
    address: '',
    mailId: '',
    phoneNo: '',
    storeHandler: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/storecustomers`, {
        params: { storeName: user?.role }
      });
      setCustomers(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showSnackbar('Error fetching customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (customer = null) => {
    setCurrentCustomer(customer || {
      storeName: user?.role || '',
      customerName: '',
      gst: '',
      address: '',
      mailId: '',
      phoneNo: '',
      storeHandler: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSaveCustomer = async () => {

    // ✅ Required validation
    if (
      !currentCustomer.storeName ||
      !currentCustomer.customerName ||
      !currentCustomer.phoneNo ||
      !currentCustomer.gst ||
      !currentCustomer.address ||
      !currentCustomer.mailId ||
      !currentCustomer.storeHandler
    ) {
      showSnackbar('All fields are required', 'error');
      return;
    }

    // ✅ Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(currentCustomer.phoneNo)) {
      showSnackbar('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    // ✅ Email validation
    if (currentCustomer.mailId && !/\S+@\S+\.\S+/.test(currentCustomer.mailId)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    try {
      if (currentCustomer._id) {
        await axios.put(`${API_BASE}/api/storecustomers/${currentCustomer._id}`, currentCustomer);
        showSnackbar('Customer updated successfully!', 'success');
      } else {
        await axios.post(`${API_BASE}/api/storecustomers`, currentCustomer);
        showSnackbar('Customer added successfully!', 'success');
      }
      fetchCustomers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving customer:', error.response?.data || error.message);
      showSnackbar(error.response?.data?.error || 'Error saving customer', 'error');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await axios.delete(`${API_BASE}/api/storecustomers/${id}`);
      showSnackbar('Customer deleted successfully!', 'success');
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      showSnackbar(error.response?.data?.error || 'Error deleting customer', 'error');
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (field, value) => {
    setCurrentCustomer(prev => ({ ...prev, [field]: value }));
  };

  const isSaveDisabled =
    !currentCustomer.storeName ||
    !currentCustomer.customerName ||
    !currentCustomer.phoneNo ||
    !currentCustomer.gst ||
    !currentCustomer.address ||
    !currentCustomer.mailId ||
    !currentCustomer.storeHandler;

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Store Customers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Add Customer
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Store Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>GST</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Mail ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone No</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Store Handler</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  No customers found. Add your first customer!
                </TableCell>
              </TableRow>
            ) : (
              customers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <TableRow key={customer._id} hover>
                    <TableCell>{customer.storeName}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>{customer.customerName}</TableCell>
                    <TableCell>{customer.gst || '-'}</TableCell>
                    <TableCell>{customer.address || '-'}</TableCell>
                    <TableCell>{customer.mailId || '-'}</TableCell>
                    <TableCell>{customer.phoneNo}</TableCell>
                    <TableCell>{customer.storeHandler || '-'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(customer)} color="primary" sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCustomer(customer._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={customers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">
            {currentCustomer._id ? 'Edit Customer' : 'Add New Customer'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Store Name *"
              fullWidth
              value={currentCustomer.storeName}
              onChange={(e) => handleInputChange('storeName', e.target.value)}
              margin="normal"
              disabled={!!user?.role}
              required
            />

            <TextField
              label="Customer Name *"
              fullWidth
              value={currentCustomer.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              margin="normal"
              required
            />

            <TextField
              label="GST Number *"
              fullWidth
              value={currentCustomer.gst}
              onChange={(e) => handleInputChange('gst', e.target.value)}
              margin="normal"
              required
            />

            <TextField
              label="Address *"
              fullWidth
              multiline
              rows={2}
              value={currentCustomer.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              margin="normal"
              required
            />

            <TextField
              label="Email ID *"
              fullWidth
              type="email"
              value={currentCustomer.mailId}
              onChange={(e) => handleInputChange('mailId', e.target.value)}
              margin="normal"
              required
            />

            <TextField
              label="Phone Number *"
              fullWidth
              value={currentCustomer.phoneNo}
              onChange={(e) => handleInputChange('phoneNo', e.target.value)}
              margin="normal"
              required
              inputProps={{ maxLength: 10 }}
            />

            <TextField
              label="Store Handler *"
              fullWidth
              value={currentCustomer.storeHandler}
              onChange={(e) => handleInputChange('storeHandler', e.target.value)}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveCustomer}
            variant="contained"
            color="primary"
            disabled={isSaveDisabled}
          >
            {currentCustomer._id ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreCustomer;
