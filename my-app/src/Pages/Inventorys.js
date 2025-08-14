import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField, Select, MenuItem,
  FormControl, InputLabel, Typography, FormHelperText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Cancel as CancelIcon, Save as SaveIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const Inventory = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    modelNo: '',
    location: '',
    quantity: 0,
    shd: '',
    scannedCodes: '',
  });
  const [errors, setErrors] = useState({
    modelNo: '',
    location: '',
    quantity: '',
    shd: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [scannedBarcodes, setScannedBarcodes] = useState(new Set());
  const shdInputRef = useRef(null);

  useEffect(() => {
    fetchInventoryData();
    fetchLocations();
  }, []);

  const fetchInventoryData = async () => {
    try {
      const response = await fetch('https://stockhandle.onrender.com/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setInventoryData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Error fetching data!', { variant: 'error' });
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch('https://stockhandle.onrender.com/api/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      enqueueSnackbar('Error fetching locations!', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (open && shdInputRef.current) {
      shdInputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const processBarcode = () => {
      const barcode = formData.shd.trim();
      if (!barcode) return;

      // Check if model number is empty before scanning
      if (!formData.modelNo) {
        setErrors(prev => ({ ...prev, shd: 'Please fill model number first!' }));
        enqueueSnackbar('Please fill model number before scanning!', { variant: 'error' });
        return;
      }

      if (barcode.length >= 8) {
        const hyphenIndex = formData.modelNo.indexOf("-");
        const modelRelevantPart = hyphenIndex !== -1 ? formData.modelNo.slice(hyphenIndex + 1) : formData.modelNo;

        if (scannedBarcodes.has(barcode)) {
          setErrors(prev => ({ ...prev, shd: 'Barcode already scanned!' }));
          enqueueSnackbar('This barcode already scanned!', { variant: 'error' });
        } else if (!barcode.includes(modelRelevantPart)) {
          setErrors(prev => ({ ...prev, shd: 'Mismatch: Barcode does not contain model number!' }));
          enqueueSnackbar('Mismatch: Barcode does not contain model number!', { variant: 'error' });
        } else {
          setScannedBarcodes(prev => new Set(prev).add(barcode));
          setFormData(prevFormData => ({
            ...prevFormData,
            scannedCodes: prevFormData.scannedCodes
              ? `${prevFormData.scannedCodes} ${barcode}`
              : barcode,
            shd: '',
            // Only update quantity if it matches the scanned count
            quantity: prevFormData.quantity === scannedBarcodes.size + 1 
              ? scannedBarcodes.size + 1 
              : prevFormData.quantity,
          }));
          setErrors(prev => ({ ...prev, shd: '' }));
        }
      }
    };

    if (formData.shd) {
      const timer = setTimeout(processBarcode, 100);
      return () => clearTimeout(timer);
    }
  }, [formData.shd, formData.modelNo, scannedBarcodes, enqueueSnackbar]);

  const handleOpen = () => {
    setOpen(true);
    setScannedBarcodes(new Set());
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      modelNo: '',
      location: '',
      quantity: 0,
      shd: '',
      scannedCodes: '',
    });
    setErrors({
      modelNo: '',
      location: '',
      quantity: '',
      shd: '',
    });
    setEditIndex(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { modelNo: '', location: '', quantity: '', shd: '' };
    if (!formData.modelNo) {
      newErrors.modelNo = 'Model No is required';
      valid = false;
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
      valid = false;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let response;
      if (editIndex !== null) {
        response = await fetch(`https://stockhandle.onrender.com/api/inventory/${inventoryData[editIndex]._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch('https://stockhandle.onrender.com/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) throw new Error('Failed to save/update data');
      const result = await response.json();

      if (editIndex !== null) {
        const updatedData = inventoryData.map((item, index) =>
          index === editIndex ? result : item
        );
        setInventoryData(updatedData);
        enqueueSnackbar('Data updated successfully!', { variant: 'success' });
      } else {
        setInventoryData([...inventoryData, result]);
        enqueueSnackbar('Data submitted successfully!', { variant: 'success' });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving data:', error);
      enqueueSnackbar(error.message || 'Error saving data!', { variant: 'error' });
    }
  };

  const handleEdit = (index) => {
    const data = inventoryData[index];
    setFormData(data);
    setEditIndex(index);
    setScannedBarcodes(new Set(data.scannedCodes.split(' ').map(code => code.trim()).filter(code => code !== '')));
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
      const response = await fetch(`https://stockhandle.onrender.com/api/inventory/${inventoryData[deleteIndex]._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete data');

      const updatedData = inventoryData.filter((_, index) => index !== deleteIndex);
      setInventoryData(updatedData);
      enqueueSnackbar('Data deleted successfully!', { variant: 'success' });
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting data:', error);
      enqueueSnackbar('Error deleting data!', { variant: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Move To Inventory Details
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, boxShadow: 3, p: 2 }}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Inventory
        </Button>
      </Box>

      {/* Form Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? 'Edit Inventory Inward' : 'Add Inventory Inward'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Model No"
            name="modelNo"
            fullWidth
            value={formData.modelNo}
            onChange={handleFormChange}
            error={!!errors.modelNo}
            helperText={errors.modelNo}
            sx={{ mt: 2 }}
          />
          <FormControl sx={{ mt: 2 }} fullWidth error={!!errors.location}>
            <InputLabel id="location-select-label">Location</InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              value={formData.location}
              label="Location"
              onChange={handleFormChange}
              name="location"
            >
              {locations.map((location) => (
                <MenuItem key={location._id} value={location.locationName}>
                  {location.locationName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.location}</FormHelperText>
          </FormControl>
          <TextField
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value) || 0);
              setFormData(prev => ({
                ...prev,
                quantity: value,
              }));
              if (errors.quantity) {
                setErrors(prev => ({ ...prev, quantity: '' }));
              }
            }}
            name="quantity"
            fullWidth
            error={!!errors.quantity}
            helperText={errors.quantity}
            sx={{ mt: 2 }}
            inputProps={{ min: 0 }}
          />
          <TextField
            margin="dense"
            label="Scan barcode (auto-scan)"
            fullWidth
            value={formData.shd}
            onChange={handleFormChange}
            name="shd"
            inputRef={shdInputRef}
            error={!!errors.shd}
            helperText={errors.shd}
            sx={{ mt: 2 }}
            autoFocus
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              margin="dense"
              label="Scanned Codes"
              fullWidth
              multiline
              rows={4}
              value={formData.scannedCodes}
              name="scannedCodes"
              onChange={handleFormChange}
            />
          </Box>
          <Typography variant="body2" sx={{ mr: 2, color: '#757575' }}>
            Total Scanned Barcodes: {scannedBarcodes.size}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" startIcon={<SaveIcon />}>
            {editIndex !== null ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this item?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model No</TableCell>
              <TableCell>Scanned Codes</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.modelNo}</TableCell>
                <TableCell>{data.scannedCodes}</TableCell>
                <TableCell>{data.quantity}</TableCell>
                <TableCell>{data.location}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(page * rowsPerPage + index)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteConfirmOpen(page * rowsPerPage + index)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={inventoryData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Inventory;
