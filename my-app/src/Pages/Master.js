import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import AddProduct from './AddProduct';
import CategoryManagement from './CategoryManagement';
import SubCategoryManagement from './SubCategoryManagement';
import axios from 'axios';

const API_URL = 'https://stockhandle.onrender.com/api';
// const FILE_HOST = 'https://stockhandle.onrender.com';

const getImageUrl = (img) => {
  if (!img) return '/no-image.png';
  const file = String(img)
    .replace(/\\/g, '/')            // windows -> web slashes
    .replace(/^\/?uploads\/?/i, '') // strip leading "uploads/"
    .split('/')
    .pop();
  return `${FILE_HOST}/uploads/${file}`;
};

const Master = () => {
  const [value, setValue] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    model: '',
    subCategory: '',
  });
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    productDescriptions: '',
    mrp: '',
    dealerPrice: '',
    uom: '',
    warranty: '',
    category: '',
    subCategory: '',
    stockStatus: '',
    reorderLevel: '',
    emailTo: '',
    productImage: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      enqueueSnackbar('Error fetching products!', { variant: 'error' });
    }
  };

  const handleChange = (_event, newValue) => setValue(newValue);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setFormData({
      brand: '',
      model: '',
      productDescriptions: '',
      mrp: '',
      dealerPrice: '',
      uom: '',
      warranty: '',
      category: '',
      subCategory: '',
      reorderLevel: '',
      emailTo: '',
      stockStatus: '',
      productImage: null,
    });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedFormData = { ...formData };
      const reorderQty = Number(updatedFormData.reorderLevel || 0);

      if (reorderQty === 0) {
        updatedFormData.stockStatus = 'Out of Stock';
      } else if (reorderQty > 0 && reorderQty <= 5) {
        updatedFormData.stockStatus = 'Low Stock';
      } else {
        updatedFormData.stockStatus = 'In Stock';
      }

      const payload = new FormData();
      Object.entries(updatedFormData).forEach(([key, value]) => {
        // If productImage is a File, append file; if it's a string (existing), also append the string
        payload.append(key, value == null ? '' : value);
      });

      if (editMode) {
        if (formData.productImage && typeof formData.productImage !== 'string') {
          // multipart when a new file is provided
          await axios.put(`${API_URL}/products/${editId}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          // JSON update when keeping the old image
          const jsonPayload = { ...formData, stockStatus: updatedFormData.stockStatus };
          await axios.put(`${API_URL}/products/${editId}`, jsonPayload);
        }
        enqueueSnackbar('Product updated successfully!', { variant: 'success' });
      } else {
        // Always multipart for create
        await axios.post(`${API_URL}/products`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        enqueueSnackbar('Product added successfully!', { variant: 'success' });
      }

      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Error saving product:', error.response ? error.response.data : error.message);
      enqueueSnackbar(`Error saving product: ${error.message}!`, { variant: 'error' });
    }
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setEditId(product._id);
    setFormData({
      brand: product.brand || '',
      model: product.model || '',
      productDescriptions: product.productDescriptions || '',
      mrp: product.mrp ?? '',
      dealerPrice: product.dealerPrice ?? '',
      uom: product.uom || '',
      warranty: product.warranty || '',
      category: product.category || '',
      subCategory: product.subCategory || '',
      reorderLevel: product.reorderLevel ?? '',
      emailTo: product.emailTo || '',
      stockStatus: product.stockStatus || '',
      productImage: product.productImage || null, // keep string to preview existing
    });
    setOpen(true);
  };

  const handleDelete = (productId) => {
    setSelected([productId]);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(selected.map(id => axios.delete(`${API_URL}/products/${id}`)));
      enqueueSnackbar('Products deleted successfully!', { variant: 'success' });
      setSelected([]);
      setOpenDeleteDialog(false);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      enqueueSnackbar('Error deleting products!', { variant: 'error' });
    }
  };

  const handleCancelDelete = () => setOpenDeleteDialog(false);

  const getStatusStyle = (status) => {
    if (status === 'In Stock') {
      return {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '500',
      };
    } else if (status === 'Out of Stock') {
      return {
        backgroundColor: 'rgb(255 221 232)',
        color: 'rgb(186 13 13)',
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '500',
      };
    } else if (status === 'Low Stock') {
      return {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '500',
      };
    }
    return {};
  };

  const filteredData = products.filter((product) => {
    return (
      (product.category || '').toLowerCase().includes(filters.category.toLowerCase()) &&
      (product.brand || '').toLowerCase().includes(filters.brand.toLowerCase()) &&
      (product.model || '').toLowerCase().includes(filters.model.toLowerCase()) &&
      (product.subCategory || '').toLowerCase().includes(filters.subCategory.toLowerCase())
    );
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" noWrap component="div" sx={{ mb: 3 }}>
        Master
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Add Product" />
          <Tab label="Category" />
          <Tab label="Sub Category" />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {value === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Add Product
            </Typography>
            <Box sx={{ boxShadow: 3, p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={handleClickOpen} startIcon={<AddIcon />}>
                  Add Product
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    name="category"
                    label="Category"
                    variant="outlined"
                    value={filters.category}
                    onChange={handleFilterChange}
                    size="small"
                  />
                  <TextField
                    name="brand"
                    label="Brand"
                    variant="outlined"
                    value={filters.brand}
                    onChange={handleFilterChange}
                    size="small"
                  />
                  <TextField
                    name="model"
                    label="Model"
                    variant="outlined"
                    value={filters.model}
                    onChange={handleFilterChange}
                    size="small"
                  />
                  <TextField
                    name="subCategory"
                    label="Sub Category"
                    variant="outlined"
                    value={filters.subCategory}
                    onChange={handleFilterChange}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {filteredData.map((product) => (
                <div
                  key={product._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '17px', color: '#1a1a1a', marginBottom: '4px' }}>
                        {product.brand || 'No Brand'}
                      </h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ fontSize: '13px', color: '#6c757d' }}>Model:</div>
                        <div style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '500' }}>
                          {product.model || 'No Model'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '4px' }}>Sub-Category:</div>
                        <div style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '500' }}>
                          {product.subCategory || 'No SKU'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={getStatusStyle(product.stockStatus)}>{product.stockStatus || 'Unknown'}</span>

                      <img
                        src={getImageUrl(product.productImage)}
                        alt="Product"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/no-image.png';
                        }}
                        style={{
                          width: '45px',
                          height: '45px',
                          objectFit: 'cover',
                          border: '1px solid #e9e9e9',
                          borderRadius: '4px',
                          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ fontSize: '13px', color: '#1a1a1a', marginBottom: '4px' }}>Category:</div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a' }}>
                        {product.category || 'No Category'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'end' }}>
                      <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '4px' }}>EmailTo:</div>
                      <div style={{ fontSize: '13px', color: '#1a1a1a' }}>{product.emailTo || '-'}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '4px' }}>Quantity:</div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a' }}>
                        {product.reorderLevel ?? 0}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'end', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '4px' }}>Old Price:</div>
                      <div style={{ fontSize: '13px', color: 'rgb(108 117 125)', textDecoration: 'line-through' }}>
                        ₹{Number(product.mrp || 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '4px', marginLeft: '10px' }}>Price:</div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#28a745' }}>
                        ₹{Number(product.dealerPrice || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      style={{
                        flex: 1, backgroundColor: '#e3f2fd', color: '#1976d2', border: 'none', borderRadius: '8px',
                        padding: '10px 16px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                      onClick={() => handleEdit(product)}
                    >
                      <EditIcon fontSize="small" /> Edit
                    </button>

                    <button
                      style={{
                        flex: 1, backgroundColor: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '8px',
                        padding: '10px 16px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                      onClick={() => handleDelete(product._id)}
                    >
                      <DeleteIcon fontSize="small" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <AddProduct
              open={open}
              handleClose={handleClose}
              handleSave={handleSave}
              formData={formData}
              setFormData={setFormData}
              editMode={editMode}
              fileHost={FILE_HOST}
              getImageUrl={getImageUrl}
            />

            <Dialog
              open={openDeleteDialog}
              onClose={handleCancelDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent id="alert-dialog-description">
                Are you sure you want to delete the selected products?
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {value === 1 && <CategoryManagement />}
        {value === 2 && <SubCategoryManagement />}
      </Box>
    </Box>
  );
};

export default Master;
