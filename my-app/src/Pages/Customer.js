import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactSwitch from 'react-switch';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const API = 'https://stockhandle.onrender.com';

const statusBadgeStyle = (isActive) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: 12,
  fontWeight: 600,
  padding: '4px 10px',
  borderRadius: 999,
  background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
  color: isActive ? '#16a34a' : '#dc2626',
  border: `1px solid ${isActive ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`
});

const Customer = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    storeName: '',
    customerName: '',
    gstNo: '',
    address: '',
    mailId: '',
    phoneNo: '',
    storeHandle: '',
    status: false,
    profilePicture: null,
  });
  const [errors, setErrors] = useState({
    storeName: '',
    customerName: '',
    gstNo: '',
    address: '',
    mailId: '',
    phoneNo: '',
    storeHandle: '',
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [filterGstNo, setFilterGstNo] = useState('');
  const [filterPhoneNo, setFilterPhoneNo] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API}/api/customers`);
      const data = res.data.map(c => ({ ...c, status: !!c.status }));
      setCustomers(data);
    } catch (error) {
      enqueueSnackbar('Error fetching customers!', { variant: 'error' });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store Name is required';
      isValid = false;
    } else newErrors.storeName = '';
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer Name is required';
      isValid = false;
    } else newErrors.customerName = '';
    if (!formData.gstNo.trim()) {
      newErrors.gstNo = 'GST No is required';
      isValid = false;
    } else if (!/^[A-Za-z0-9]{15}$/.test(formData.gstNo)) {
      newErrors.gstNo = 'GST No must be 15 characters (alphanumeric)';
      isValid = false;
    } else newErrors.gstNo = '';
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    } else newErrors.address = '';
    if (!formData.mailId.trim()) {
      newErrors.mailId = 'Mail ID is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mailId)) {
      newErrors.mailId = 'Mail ID is invalid';
      isValid = false;
    } else newErrors.mailId = '';
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone No is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Phone No is invalid';
      isValid = false;
    } else newErrors.phoneNo = '';
    if (!formData.storeHandle.trim()) {
      newErrors.storeHandle = 'Store Handle is required';
      isValid = false;
    } else newErrors.storeHandle = '';
    setErrors(newErrors);
    return isValid;
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSwitchChange = (checked) => {
    setFormData({ ...formData, status: checked });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, profilePicture: event.target.files[0] || null });
  };

  const resetForm = () => {
    setFormData({
      storeName: '',
      customerName: '',
      gstNo: '',
      address: '',
      mailId: '',
      phoneNo: '',
      storeHandle: '',
      status: false,
      profilePicture: null,
    });
    setErrors({
      storeName: '',
      customerName: '',
      gstNo: '',
      address: '',
      mailId: '',
      phoneNo: '',
      storeHandle: '',
    });
  };

  const handleOpen = () => {
    resetForm();
    setEditId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (k === 'profilePicture') return;
        if (typeof v === 'boolean') fd.append(k, v.toString());
        else fd.append(k, v ?? '');
      });
      if (formData.profilePicture) {
        fd.append('profilePicture', formData.profilePicture);
      }
      if (editId) {
        await axios.put(`${API}/api/customers/${editId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        enqueueSnackbar('Customer updated successfully!', { variant: 'success' });
      } else {
        await axios.post(`${API}/api/customers`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        enqueueSnackbar('Customer added successfully!', { variant: 'success' });
      }
      fetchCustomers();
      handleClose();
    } catch (error) {
      enqueueSnackbar('Error saving customer!', { variant: 'error' });
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      storeName: customer.storeName || '',
      customerName: customer.customerName || '',
      gstNo: customer.gstNo || '',
      address: customer.address || '',
      mailId: customer.mailId || '',
      phoneNo: customer.phoneNo || '',
      storeHandle: customer.storeHandle || '',
      status: !!customer.status,
      profilePicture: null,
    });
    setEditId(customer._id);
    setOpen(true);
  };

  const handleDeleteConfirmOpen = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/api/customers/${deleteId}`);
      enqueueSnackbar('Customer deleted successfully!', { variant: 'success' });
      fetchCustomers();
      handleDeleteConfirmClose();
    } catch (error) {
      enqueueSnackbar('Error deleting customer!', { variant: 'error' });
    }
  };

  const handleChangePage = (e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleToggleStatus = async (cust) => {
    try {
      const fd = new FormData();
      fd.append('storeName', cust.storeName || '');
      fd.append('customerName', cust.customerName || '');
      fd.append('gstNo', cust.gstNo || '');
      fd.append('address', cust.address || '');
      fd.append('mailId', cust.mailId || '');
      fd.append('phoneNo', cust.phoneNo || '');
      fd.append('storeHandle', cust.storeHandle || '');
      fd.append('status', (!cust.status).toString());

      await axios.put(`${API}/api/customers/${cust._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      enqueueSnackbar(`Status set to ${!cust.status ? 'Active' : 'Inactive'}`, { variant: 'success' });
      fetchCustomers();
    } catch (err) {
      enqueueSnackbar('Failed to update status', { variant: 'error' });
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const n = (customer.customerName || '').toLowerCase();
    const g = (customer.gstNo || '').toLowerCase();
    const p = (customer.phoneNo || '').toLowerCase();
    return (
      n.includes(filterCustomerName.toLowerCase()) &&
      g.includes(filterGstNo.toLowerCase()) &&
      p.includes(filterPhoneNo.toLowerCase())
    );
  });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Customer Details
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, boxShadow: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Filter Customer Name"
            variant="outlined"
            value={filterCustomerName}
            onChange={(e) => setFilterCustomerName(e.target.value)}
          />
          <TextField
            label="Filter GST No"
            variant="outlined"
            value={filterGstNo}
            onChange={(e) => setFilterGstNo(e.target.value)}
          />
          <TextField
            label="Filter Phone No"
            variant="outlined"
            value={filterPhoneNo}
            onChange={(e) => setFilterPhoneNo(e.target.value)}
          />
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Customer
        </Button>
      </Box>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="storeName"
            label="Store Name"
            fullWidth
            value={formData.storeName}
            onChange={handleFormChange}
            error={!!errors.storeName}
            helperText={errors.storeName}
          />
          <TextField
            margin="dense"
            name="customerName"
            label="Customer Name"
            fullWidth
            value={formData.customerName}
            onChange={handleFormChange}
            error={!!errors.customerName}
            helperText={errors.customerName}
          />
          <TextField
            margin="dense"
            name="gstNo"
            label="GST No"
            fullWidth
            value={formData.gstNo}
            onChange={handleFormChange}
            error={!!errors.gstNo}
            helperText={errors.gstNo}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            fullWidth
            value={formData.address}
            onChange={handleFormChange}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField
            margin="dense"
            name="mailId"
            label="Mail ID"
            fullWidth
            value={formData.mailId}
            onChange={handleFormChange}
            error={!!errors.mailId}
            helperText={errors.mailId}
          />
          <TextField
            margin="dense"
            name="phoneNo"
            label="Phone No"
            fullWidth
            value={formData.phoneNo}
            onChange={handleFormChange}
            error={!!errors.phoneNo}
            helperText={errors.phoneNo}
          />
          <TextField
            margin="dense"
            name="storeHandle"
            label="Store Handle"
            fullWidth
            value={formData.storeHandle}
            onChange={handleFormChange}
            error={!!errors.storeHandle}
            helperText={errors.storeHandle}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
            <ReactSwitch checked={formData.status} onChange={handleSwitchChange} />
            <Typography variant="body1">{formData.status ? 'Active' : 'Inactive'}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="profile-picture">
              <Button variant="contained" component="span">
                Upload Profile Picture
              </Button>
            </label>
            {formData.profilePicture && (
              <Typography sx={{ ml: 2 }} variant="body2">
                {formData.profilePicture.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSave} startIcon={<SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={confirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this customer?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox /></TableCell>
              <TableCell>#</TableCell>
              <TableCell>Store Name</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>GST No</TableCell>
              <TableCell>Mail ID</TableCell>
              <TableCell>Phone No</TableCell>
              <TableCell>Store Handle</TableCell>
              <TableCell>Profile Picture</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer, idx) => (
                <TableRow key={customer._id}>
                  <TableCell padding="checkbox"><Checkbox /></TableCell>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{customer.storeName}</TableCell>
                  <TableCell>{customer.customerName}</TableCell>
                  <TableCell>{customer.gstNo}</TableCell>
                  <TableCell>{customer.mailId}</TableCell>
                  <TableCell>{customer.phoneNo}</TableCell>
                  <TableCell>{customer.storeHandle}</TableCell>
                  <TableCell>
                    {customer.profilePicture ? (
                      <img
                        src={`${API}/${customer.profilePicture}`}
                        alt="Profile"
                        style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: 12, color: '#999' }}>No image</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(customer)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDeleteConfirmOpen(customer._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCustomers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Customer;
