import React, { useState, useEffect } from 'react';
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
  Badge,
  FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Switch, Typography } from '@mui/material';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    createdOn: new Date(),
    status: true,
    image: null,
  });
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://stockhandle.onrender.com/api/categories');
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      createdOn: new Date(),
      status: true,
      image: null,
    });
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/tiff')) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('createdOn', formData.createdOn);
    formDataToSend.append('status', formData.status);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (selectedCategory) {
        const response = await fetch(`https://stockhandle.onrender.com/api/categories/${selectedCategory._id}`, {
          method: 'PUT',
          body: formDataToSend,
        });
        const data = await response.json();
        setCategories(categories.map(category => (category._id === selectedCategory._id ? data : category)));
      } else {
        const response = await fetch('https://stockhandle.onrender.com/api/categories', {
          method: 'POST',
          body: formDataToSend,
        });
        const data = await response.json();
        setCategories([...categories, data]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      createdOn: new Date(category.createdOn),
      status: category.status,
      image: null,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://stockhandle.onrender.com/api/categories/${id}`, {
        method: 'DELETE',
      });
      setCategories(categories.filter(category => category._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSelectCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(categoryId => categoryId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCategories(categories.map(category => category._id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedCategories.map(id =>
        fetch(`https://stockhandle.onrender.com/api/categories/${id}`, {
          method: 'DELETE',
        })
      ));
      setCategories(categories.filter(category => !selectedCategories.includes(category._id)));
      setSelectedCategories([]);
    } catch (error) {
      console.error('Error deleting selected categories:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    return parsedDate.toISOString().split('T')[0];
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Category Details
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, boxShadow: 3, p: 2 }}>
        <TextField
          label="Filter Category"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Category
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                  indeterminate={selectedCategories.length > 0 && selectedCategories.length < filteredCategories.length}
                />
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Category Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category) => (
              <TableRow key={category._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleSelectCategory(category._id)}
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{formatDate(category.createdOn)}</TableCell>
                <TableCell>
                  {category.image && <img src={`https://stockhandle.onrender.com/${category.image}`} alt="Category" style={{ width: 50, height: 50 }} />}
                </TableCell>
                <TableCell>
                  <Badge color={category.status ? 'success' : 'error'} badgeContent={category.status ? 'Active' : 'Inactive'} />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category._id)}>
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
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Category Name"
            fullWidth
            value={formData.name}
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
                name="status"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              />
            }
            label="Status"
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg, image/tiff"
                onChange={handleImageUpload}
              />
            </Button>
            {formData.image && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={formData.image instanceof File ? URL.createObjectURL(formData.image) : `https://stockhandle.onrender.com/${formData.image}`}
                  alt="Preview"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
            )}
          </Box>
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
    </Box>
  );
};

export default CategoryManagement;
