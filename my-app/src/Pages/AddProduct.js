import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  FormHelperText,
  Typography,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const BRANDS_API = 'http://localhost:5000/api/brands';
const CATEGORIES_API = 'http://localhost:5000/api/categories';
const SUBCATEGORIES_API = 'http://localhost:5000/api/subcategories';

const AddProduct = ({
  open,
  handleClose,
  handleSave,
  formData,
  setFormData,
  editMode,
  getImageUrl
}) => {
  const [errors, setErrors] = useState({});
  const [brandOptions, setBrandOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  // Keep the latest getImageUrl in a stable ref so re-renders don't retrigger preview work
  const getImageUrlRef = useRef(getImageUrl);
  useEffect(() => {
    getImageUrlRef.current = getImageUrl;
  }, [getImageUrl]);

  // Track last created blob URL so we can revoke only when replaced/unmounted
  const lastBlobRef = useRef(null);

  // Build preview URL from either a File or an existing string value
  const previewSrc = useMemo(() => {
    // Clean up previous blob URL if we are about to make a new one
    const revokeLast = () => {
      if (lastBlobRef.current) {
        URL.revokeObjectURL(lastBlobRef.current);
        lastBlobRef.current = null;
      }
    };

    const img = formData?.productImage;

    // 1) If it's a File, create a blob URL once
    if (img instanceof File) {
      revokeLast();
      const url = URL.createObjectURL(img);
      lastBlobRef.current = url;
      return url;
    }

    // 2) If it's a non-empty string, resolve to server URL (absolute or via helper)
    if (typeof img === 'string' && img.trim()) {
      // do NOT revoke here; it's not a blob URL
      const helper = getImageUrlRef.current;
      if (typeof helper === 'function') {
        return helper(img);
      }
      // fallback without helper: keep it as-is or prefix uploads
      if (/^https?:\/\//i.test(img) || img.startsWith('/uploads/')) return img;
      return `http://localhost:5000/uploads/${img}`;
    }

    // 3) Otherwise fallback
    return '/no-image.png';
    // Only recompute when the image itself changes
  }, [formData?.productImage]);

  // Revoke blob URL on unmount
  useEffect(() => {
    return () => {
      if (lastBlobRef.current) {
        URL.revokeObjectURL(lastBlobRef.current);
        lastBlobRef.current = null;
      }
    };
  }, []);

  // --- helpers to read different API field shapes ---
  const getLabel = (obj, typeHint) => {
    if (!obj || typeof obj !== 'object') return '';
    return (
      obj.name ||
      obj.label ||
      obj.title ||
      obj[`${typeHint}Name`] ||
      obj[typeHint] ||
      ''
    );
  };
  const getKey = (obj, typeHint) => obj?._id || obj?.id || getLabel(obj, typeHint);

  // --- fetch options when dialog opens ---
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [bRes, cRes, sRes] = await Promise.all([
          axios.get(BRANDS_API),
          axios.get(CATEGORIES_API),
          axios.get(SUBCATEGORIES_API),
        ]);
        setBrandOptions(Array.isArray(bRes.data) ? bRes.data : bRes.data?.data || []);
        setCategoryOptions(Array.isArray(cRes.data) ? cRes.data : cRes.data?.data || []);
        setSubCategoryOptions(Array.isArray(sRes.data) ? sRes.data : sRes.data?.data || []);
      } catch (err) {
        console.error('Failed loading options', err);
      }
    })();
  }, [open]);

  // --- field change handlers ---
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const onNumberChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value === '' ? '' : Number(value);
    setFormData((s) => ({ ...s, [name]: cleaned }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFormData((s) => ({ ...s, productImage: file }));
  };

  // --- validation ---
  const validate = () => {
    const temp = {};
    if (!formData.brand) temp.brand = 'Brand is required';
    if (!formData.model) temp.model = 'Model is required';
    if (formData.mrp === '' || isNaN(Number(formData.mrp))) temp.mrp = 'Valid MRP required';
    if (formData.dealerPrice === '' || isNaN(Number(formData.dealerPrice))) temp.dealerPrice = 'Valid Dealer Price required';
    if (formData.reorderLevel === '' || isNaN(Number(formData.reorderLevel))) temp.reorderLevel = 'Valid Quantity required';
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    handleSave();
  };

  // (Optional) filter subcats by chosen category if API exposes a category field
  const filteredSubCats = useMemo(() => {
    if (!formData.category) return subCategoryOptions;
    return subCategoryOptions.filter((sc) => {
      const scCat =
        sc?.categoryName ||
        sc?.category ||
        sc?.parent?.name ||
        sc?.parentName ||
        '';
      return !scCat || scCat === formData.category;
    });
  }, [subCategoryOptions, formData.category]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              select
              label="Brand"
              name="brand"
              value={formData.brand || ''}
              onChange={onChange}
              error={!!errors.brand}
              helperText={errors.brand || 'Select a brand'}
              fullWidth
            >
              <MenuItem value="">-- Select Brand --</MenuItem>
              {brandOptions.map((b) => (
                <MenuItem key={getKey(b, 'brand')} value={getLabel(b, 'brand')}>
                  {getLabel(b, 'brand')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              label="Model"
              name="model"
              value={formData.model || ''}
              onChange={onChange}
              error={!!errors.model}
              helperText={errors.model}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              select
              label="Category"
              name="category"
              value={formData.category || ''}
              onChange={(e) => {
                const newVal = e.target.value;
                setFormData((s) => ({ ...s, category: newVal, subCategory: '' }));
              }}
              fullWidth
            >
              <MenuItem value="">-- Select Category --</MenuItem>
              {categoryOptions.map((c) => (
                <MenuItem key={getKey(c, 'category')} value={getLabel(c, 'category')}>
                  {getLabel(c, 'category')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              select
              label="Sub Category"
              name="subCategory"
              value={formData.subCategory || ''}
              onChange={onChange}
              fullWidth
            >
              <MenuItem value="">-- Select Sub Category --</MenuItem>
              {filteredSubCats.map((s) => (
                <MenuItem key={getKey(s, 'subCategory')} value={getLabel(s, 'subCategory')}>
                  {getLabel(s, 'subCategory')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} style={{ width: '100%' }}>
            <TextField
              label="Product Descriptions"
              name="productDescriptions"
              value={formData.productDescriptions || ''}
              onChange={onChange}
              fullWidth
              multiline
              minRows={2}
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              label="MRP"
              name="mrp"
              value={formData.mrp}
              onChange={onNumberChange}
              error={!!errors.mrp}
              helperText={errors.mrp}
              type="number"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              label="Dealer Price"
              name="dealerPrice"
              value={formData.dealerPrice}
              onChange={onNumberChange}
              error={!!errors.dealerPrice}
              helperText={errors.dealerPrice}
              type="number"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              label="Quantity (Reorder Level)"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={onNumberChange}
              error={!!errors.reorderLevel}
              helperText={errors.reorderLevel}
              type="number"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              label="UOM"
              name="uom"
              value={formData.uom || ''}
              onChange={onChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              label="Warranty"
              name="warranty"
              value={formData.warranty || ''}
              onChange={onChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ width: '100%' }}>
            <TextField
              label="Email To"
              name="emailTo"
              value={formData.emailTo || ''}
              onChange={onChange}
              type="email"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} style={{ width: '100%' }}>
            <TextField
              label="Stock Status (auto-calculated)"
              name="stockStatus"
              value={
                Number(formData.reorderLevel || 0) === 0
                  ? 'Out of Stock'
                  : Number(formData.reorderLevel || 0) <= 5
                  ? 'Low Stock'
                  : 'In Stock'
              }
              disabled
              fullWidth
            />
            <FormHelperText>Changes when you edit the Quantity.</FormHelperText>
          </Grid>

          <Grid item xs={12} style={{ width: '100%' }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <Typography variant="subtitle2">Product Image</Typography>

              <div
                style={{
                  width: '100%',
                  paddingTop: '40%',
                  position: 'relative',
                  borderRadius: 8,
                  border: '1px solid #eee',
                  overflow: 'hidden',
                  background: '#fafafa'
                }}
              >
                <img
                  src={previewSrc}
                  alt="preview"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/no-image.png';
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <Button variant="outlined" component="label">
                {editMode ? 'Change Image' : 'Upload Image'}
                <input hidden accept="image/*" type="file" onChange={onFileChange} />
              </Button>

              {editMode && typeof formData.productImage === 'string' && (
                <FormHelperText>
                  Keeping existing image. Upload a new file to replace it.
                </FormHelperText>
              )}
            </div>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          {editMode ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProduct;
