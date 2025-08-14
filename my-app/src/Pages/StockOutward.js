import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const StockOutward = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [models, setModels] = useState([]);
  const [salePersons, setSalePersons] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [scannedBarcodes, setScannedBarcodes] = useState(new Set());
  const [isQuantityManual, setIsQuantityManual] = useState(false);
  const [lowStockWarning, setLowStockWarning] = useState('');
  const [selectedModelStock, setSelectedModelStock] = useState(null); // 🔥 Track available stock

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerAddress: '',
    mailId: '',
    storeName: '',
    phoneNumber: '',
    modelNo: '',
    salePerson: '',
    quantity: 0,
    price: 0,
    shd: '',
    scannedCodes: '',
  });

  const [errors, setErrors] = useState({});
  const shdInputRef = useRef(null);

  useEffect(() => {
    fetchModels();
    fetchSalePersons();
    fetchCustomers();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await axios.get('https://stockhandle.onrender.com/api/products');
      setModels(res.data);
    } catch {
      enqueueSnackbar('Failed to fetch models', { variant: 'error' });
    }
  };

  const fetchSalePersons = async () => {
    try {
      const res = await axios.get('https://stockhandle.onrender.com/api/salesPersons');
      setSalePersons(res.data);
    } catch {
      enqueueSnackbar('Failed to fetch sales persons', { variant: 'error' });
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://stockhandle.onrender.com/api/customers');
      setCustomers(res.data);
    } catch {
      enqueueSnackbar('Failed to fetch customers', { variant: 'error' });
    }
  };

  const openOutwardDialog = () => {
    setFormData({
      customerId: '',
      customerName: '',
      customerAddress: '',
      storeName: '',
      mailId: '',
      phoneNumber: '',
      modelNo: '',
      salePerson: '',
      quantity: 0,
      price: 0,
      shd: '',
      scannedCodes: '',
    });
    setScannedBarcodes(new Set());
    setErrors({});
    setIsQuantityManual(false);
    setLowStockWarning('');
    setSelectedModelStock(null);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'quantity') {
      setIsQuantityManual(true);
    }

    if (name === 'modelNo') {
      const selectedModel = models.find((m) => m.model === value);
      if (selectedModel) {
        const stock = selectedModel.reorderLevel || 0;
        setSelectedModelStock(stock);
        if (stock <= 5) {
          setLowStockWarning(`Warning: Only ${stock} left in stock for this model!`);
        } else {
          setLowStockWarning('');
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    const customer = customers.find((c) => c._id === customerId);
    setFormData((prev) => ({
      ...prev,
      customerId,
      customerName: customer?.customerName || '',
      customerAddress: customer?.address || '',
      mailId: customer?.mailId || '',
      phoneNumber: customer?.phoneNo || '',
      storeName: customer?.storeName || '',
    }));
    if (errors.customerName) {
      setErrors((prev) => ({ ...prev, customerName: '' }));
    }
  };

  useEffect(() => {
    const processBarcode = () => {
      const barcode = formData.shd.trim();
      if (!barcode) return;
      if (!formData.modelNo) {
        setErrors((prev) => ({ ...prev, shd: 'Select model number first!' }));
        enqueueSnackbar('Please select a model number before scanning', { variant: 'error' });
        return;
      }
      if (barcode.length >= 8) {
        const hyphenIndex = formData.modelNo.indexOf('-');
        const modelPart = hyphenIndex !== -1 ? formData.modelNo.slice(hyphenIndex + 1) : formData.modelNo;
        if (scannedBarcodes.has(barcode)) {
          setErrors((prev) => ({ ...prev, shd: 'Barcode already scanned!' }));
          enqueueSnackbar('This barcode already scanned!', { variant: 'error' });
        } else if (!barcode.includes(modelPart)) {
          setErrors((prev) => ({ ...prev, shd: 'Barcode mismatch with model number!' }));
          enqueueSnackbar('Mismatch: Barcode does not contain model number!', { variant: 'error' });
        } else {
          const updatedBarcodes = new Set(scannedBarcodes);
          updatedBarcodes.add(barcode);
          setScannedBarcodes(updatedBarcodes);
          setFormData((prev) => ({
            ...prev,
            scannedCodes: prev.scannedCodes ? `${prev.scannedCodes}, ${barcode}`.replace(/,\s*,/g, ',') : barcode,
            shd: '',
            quantity: isQuantityManual ? prev.quantity : updatedBarcodes.size,
          }));
          setErrors((prev) => ({ ...prev, shd: '' }));
        }
      }
    };
    if (formData.shd) {
      const timer = setTimeout(processBarcode, 100);
      return () => clearTimeout(timer);
    }
  }, [formData.shd, formData.modelNo, scannedBarcodes, enqueueSnackbar, isQuantityManual]);

  const validateForm = () => {
    const newErrors = {};
    let valid = true;
    if (!formData.modelNo) {
      newErrors.modelNo = 'Model No is required';
      valid = false;
    }
    if (!formData.salePerson) {
      newErrors.salePerson = 'Sales Person is required';
      valid = false;
    }
    if (!formData.customerId) {
      newErrors.customerName = 'Customer Name is required';
      valid = false;
    }
    if (!formData.storeName) {
      newErrors.storeName = 'Store Name is required';
      valid = false;
    }
    if (scannedBarcodes.size === 0) {
      newErrors.shd = 'Please scan at least one barcode';
      valid = false;
    }
    const quantity = parseInt(formData.quantity);
    if (selectedModelStock != null && quantity > selectedModelStock) {
      newErrors.quantity = `Entered quantity exceeds available stock (${selectedModelStock})`;
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmitOutward = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        modelNo: formData.modelNo,
        quantity: formData.quantity,
        price: formData.price,
        salePerson: formData.salePerson,
        customerName: formData.customerName,
        barcodes: Array.from(scannedBarcodes),
        dispatchDate: new Date(),
        customerAddress: formData.customerAddress,
        mailId: formData.mailId,
        phoneNumber: formData.phoneNumber,
        storeName: formData.storeName,
      };
      await axios.post('https://stockhandle.onrender.com/api/dispatch', payload);
      const res = await axios.get('http://localhost:5000/api/products');
      const products = res.data;
      const product = products.find((p) => p.model === formData.modelNo);
      if (product) {
        const updatedReorder = Math.max(0, (product.reorderLevel || 0) - formData.quantity);
        await axios.put(`https://stockhandle.onrender.com/api/products/${product._id}`, {
          ...product,
          reorderLevel: updatedReorder,
        });
      }
      enqueueSnackbar('Stock outward recorded and reorderLevel updated!', { variant: 'success' });
      closeDialog();
    } catch (err) {
      enqueueSnackbar('Failed to submit stock outward', { variant: 'error' });
      console.error(err);
    }
  };

  return (
    <Box sx={{ padding: '40px 20px' }}>
      <Box sx={{ textAlign: 'center', marginBottom: '40px' }}>
        <Typography variant="h4">Stock Outward</Typography>
        <Typography variant="body1">Scan products to remove them from inventory</Typography>
      </Box>

      <Box sx={{
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '60px 40px',
        textAlign: 'center',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      }}>
        <Box sx={{
          width: '80px',
          height: '80px',
          backgroundColor: '#fee2e2',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.04.74 5.57 1.97" />
          </svg>
        </Box>
        <Typography variant="h6">Scan Product Barcode</Typography>
        <Typography variant="body2">Use your camera or enter barcode manually</Typography>
        <Button variant="contained" color="error" onClick={openOutwardDialog} sx={{ mt: 2 }}>
          Start Scanning
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Stock Outward</DialogTitle>
        <DialogContent>

          {lowStockWarning && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {lowStockWarning}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.customerName}>
            <InputLabel>Customer Name *</InputLabel>
            <Select name="customerId" value={formData.customerId} onChange={handleCustomerChange}>
              {customers.map(c => (
                <MenuItem key={c._id} value={c._id}>{c.customerName}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.customerName}</FormHelperText>
          </FormControl>

          <TextField label="Address" fullWidth value={formData.customerAddress} InputProps={{ readOnly: true }} sx={{ mt: 2 }} />
          <TextField label="Email" fullWidth value={formData.mailId} InputProps={{ readOnly: true }} sx={{ mt: 2 }} />
          <TextField label="Phone" fullWidth value={formData.phoneNumber} InputProps={{ readOnly: true }} sx={{ mt: 2 }} />
          <TextField label="Store Name" fullWidth value={formData.storeName} InputProps={{ readOnly: true }} sx={{ mt: 2 }} />

          <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.modelNo}>
            <InputLabel>Model No *</InputLabel>
            <Select name="modelNo" value={formData.modelNo} onChange={handleFormChange}>
              {models.map((m) => (
                <MenuItem key={m._id} value={m.model}>{m.model}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.modelNo}</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.salePerson}>
            <InputLabel>Sales Person *</InputLabel>
            <Select name="salePerson" value={formData.salePerson} onChange={handleFormChange}>
              {salePersons.map((p) => (
                <MenuItem key={p._id} value={p.employeeName}>{p.employeeName}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.salePerson}</FormHelperText>
          </FormControl>

          <TextField name="quantity" label="Quantity" type="number" fullWidth value={formData.quantity} onChange={handleFormChange} sx={{ mt: 2 }} error={!!errors.quantity} helperText={errors.quantity} />
          <TextField name="price" label="Price per Unit" type="number" fullWidth value={formData.price} onChange={handleFormChange} sx={{ mt: 2 }} />
          <TextField name="shd" label="Scan barcode (auto)" fullWidth value={formData.shd} onChange={handleFormChange} error={!!errors.shd} helperText={errors.shd} inputRef={shdInputRef} sx={{ mt: 2 }} />
          <TextField label="Scanned Codes" fullWidth multiline rows={3} value={formData.scannedCodes} InputProps={{ readOnly: true }} sx={{ mt: 2 }} />
          <Typography variant="body2" sx={{ mt: 1 }}>Total Scanned: {scannedBarcodes.size}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSubmitOutward} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockOutward;
