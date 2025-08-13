import React, { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const Warehouses = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    warehouse: '',
    contactPerson: '',
    email: '',
    phoneNo: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    status: true,
  });
  const [errors, setErrors] = useState({
    warehouse: '',
    contactPerson: '',
    email: '',
    phoneNo: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/warehouses');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.warehouse.trim()) {
      newErrors.warehouse = 'Warehouse is required';
      valid = false;
    } else {
      newErrors.warehouse = '';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact Person is required';
      valid = false;
    } else {
      newErrors.contactPerson = '';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validator.isEmail(formData.email)) {
      newErrors.email = 'Enter a valid email';
      valid = false;
    } else {
      newErrors.email = '';
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone No is required';
      valid = false;
    } else if (!validator.isNumeric(formData.phoneNo) || formData.phoneNo.length !== 10) {
      newErrors.phoneNo = 'Phone No must be a 10-digit number';
      valid = false;
    } else {
      newErrors.phoneNo = '';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    } else {
      newErrors.address = '';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      valid = false;
    } else {
      newErrors.city = '';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
      valid = false;
    } else {
      newErrors.state = '';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
      valid = false;
    } else {
      newErrors.country = '';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip Code is required';
      valid = false;
    } else {
      newErrors.zipCode = '';
    }

    setErrors(newErrors);
    return valid;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      warehouse: '',
      contactPerson: '',
      email: '',
      phoneNo: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      status: true,
    });
    setErrors({
      warehouse: '',
      contactPerson: '',
      email: '',
      phoneNo: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    });
    setEditIndex(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (validate()) {
      try {
        if (editIndex !== null) {
          await axios.patch(`http://localhost:5000/api/warehouses/${warehouses[editIndex]._id}`, formData);
          enqueueSnackbar('Warehouse updated successfully!', { variant: 'success' });
        } else {
          await axios.post('http://localhost:5000/api/warehouses', formData);
          enqueueSnackbar('Warehouse added successfully!', { variant: 'success' });
        }
        fetchWarehouses();
        handleClose();
      } catch (error) {
        console.error('Error saving warehouse:', error);
      }
    }
  };

  const handleEdit = (index) => {
    const warehouse = warehouses[index];
    setFormData({
      warehouse: warehouse.warehouse,
      contactPerson: warehouse.contactPerson,
      email: warehouse.email,
      phoneNo: warehouse.phoneNo,
      address: warehouse.address,
      city: warehouse.city,
      state: warehouse.state,
      country: warehouse.country,
      zipCode: warehouse.zipCode,
      status: warehouse.status,
    });
    setEditIndex(index);
    setOpen(true);
  };

  const handleDeleteConfirmOpen = (index) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/warehouses/${warehouses[deleteIndex]._id}`);
      enqueueSnackbar('Warehouse deleted successfully!', { variant: 'success' });
      fetchWarehouses();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting warehouse:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.warehouse.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Warehouse Details
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, boxShadow: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            placeholder="Search Warehouses"
            value={filterText}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Warehouse
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{editIndex !== null ? 'Edit Warehouse' : 'Add Warehouse'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="warehouse"
                label="Warehouse"
                fullWidth
                value={formData.warehouse}
                onChange={handleFormChange}
                error={!!errors.warehouse}
                helperText={errors.warehouse}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="contactPerson"
                label="Contact Person"
                fullWidth
                value={formData.contactPerson}
                onChange={handleFormChange}
                error={!!errors.contactPerson}
                helperText={errors.contactPerson}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleFormChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="city"
                label="City"
                fullWidth
                value={formData.city}
                onChange={handleFormChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="state"
                label="State"
                fullWidth
                value={formData.state}
                onChange={handleFormChange}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="country"
                label="Country"
                fullWidth
                value={formData.country}
                onChange={handleFormChange}
                error={!!errors.country}
                helperText={errors.country}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="zipCode"
                label="Zip Code"
                fullWidth
                value={formData.zipCode}
                onChange={handleFormChange}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  />
                }
                label="Status"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" startIcon={<SaveIcon />}>
            {editIndex !== null ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent id="alert-dialog-description">
          Are you sure you want to delete this warehouse?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Warehouse</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Phone No</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWarehouses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((warehouse, index) => (
              <TableRow key={warehouse._id}>
                <TableCell>{warehouse.warehouse}</TableCell>
                <TableCell>{warehouse.contactPerson}</TableCell>
                <TableCell>{warehouse.phoneNo}</TableCell>
                <TableCell>{warehouse.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteConfirmOpen(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredWarehouses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Warehouses;
