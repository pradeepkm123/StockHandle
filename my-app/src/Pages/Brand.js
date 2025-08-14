import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'notistack';
import { Badge, Typography } from '@mui/material';

const Brand = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    brand: '',
    createdOn: new Date(),
    status: true,
  });
  const [editId, setEditId] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('https://stockhandle.onrender.com/api/brands');
      setBrands(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching brands!', { variant: 'error' });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      brand: '',
      createdOn: new Date(),
      status: true,
    });
    setEditId(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      createdOn: date,
    });
  };

  const handleSave = async () => {
    try {
      if (editId !== null) {
        await axios.put(`https://stockhandle.onrender.com/api/brands/${editId}`, formData);
        enqueueSnackbar('Brand updated successfully!', { variant: 'success' });
      } else {
        await axios.post('https://stockhandle.onrender.com/api/brands', formData);
        enqueueSnackbar('Brand added successfully!', { variant: 'success' });
      }
      fetchBrands();
      handleClose();
    } catch (error) {
      enqueueSnackbar('Error saving brand!', { variant: 'error' });
    }
  };

  const handleEdit = (brand) => {
    setFormData({
      brand: brand.brand,
      createdOn: new Date(brand.createdOn),
      status: brand.status,
    });
    setEditId(brand._id);
    setOpen(true);
  };

  const handleDeleteConfirmOpen = (id) => {
    setBrandToDelete(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setConfirmOpen(false);
    setBrandToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://stockhandle.onrender.com/api/brands/${brandToDelete}`);
      enqueueSnackbar('Brand deleted successfully!', { variant: 'success' });
      fetchBrands();
    } catch (error) {
      enqueueSnackbar('Error deleting brand!', { variant: 'error' });
    }
    handleDeleteConfirmClose();
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

  const filteredBrands = brands.filter(brand =>
    brand.brand.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Brand
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, boxShadow: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            placeholder="Search Brands"
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
            Add Brand
          </Button>
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId !== null ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="brand"
            label="Brand"
            fullWidth
            value={formData.brand}
            onChange={handleFormChange}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Created On"
              value={formData.createdOn}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
            />
          </LocalizationProvider>
          <FormControlLabel
            control={
              <Switch
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              />
            }
            label="Status"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" startIcon={<SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this brand?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Check Box</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBrands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((brand) => (
              <TableRow key={brand._id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{brand.brand}</TableCell>
                <TableCell>{new Date(brand.createdOn).toISOString().split('T')[0]}</TableCell>
                <TableCell>
                  <Badge color={brand.status ? 'success' : 'error'} badgeContent={brand.status ? 'Active' : 'Inactive'} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(brand)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteConfirmOpen(brand._id)}>
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
          count={filteredBrands.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Brand;
