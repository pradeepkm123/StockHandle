import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Typography,
    MenuItem,
} from '@mui/material';
import { Cancel as CancelIcon, Save as SaveIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '600',
        color: '#1a1a1a',
        margin: '0 0 12px 0',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#6b7280',
        margin: 0,
    },
    scanCard: {
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '60px 40px',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
    },
    scanIcon: {
        marginBottom: '24px',
    },
    iconCircle: {
        width: '80px',
        height: '80px',
        backgroundColor: '#e3f2fd',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    productCard: {
        padding: '20px',
        backgroundColor: '#f8f8f8',
        borderRadius: '15px',
        marginBottom: '3%',
    },
    productInfo: {
        marginBottom: '32px',
    },
    productTitleSection: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '16px',
    },
    productName: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1a1a1a',
        margin: 0,
    },
    productDetailsTwoColumn: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'space-between',
    },
    detailItem: {
        flex: '0 0 48%',
        margin: 0,
        fontSize: '1rem',
        color: '#6b7280',
    },
    packageIcon: {
        padding: '8px',
    },
    scanTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1a1a1a',
        margin: '0 0 12px 0',
    },
    scanDescription: {
        fontSize: '1rem',
        color: '#6b7280',
        margin: '0 0 32px 0',
    },
    startButton: {
        backgroundColor: '#4285f4',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '14px 28px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.2s',
    },
    buttonIcon: {
        marginRight: '4px',
    },
};

const StockInward = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        modelNo: '',
        location: '',
        quantity: 0,
        shd: '',
        scannedCodes: '',
    });
    const [errors, setErrors] = useState({});
    const [scannedBarcodes, setScannedBarcodes] = useState(new Set());
    const [productList, setProductList] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const shdInputRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchProducts();
        fetchLocations();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            const products = res.data;
            setProductList(products);
            setProductOptions(products.map(p => ({ value: p.model, label: p.model })));
        } catch (error) {
            console.error('Error fetching products:', error);
            enqueueSnackbar('Error fetching products!', { variant: 'error' });
        }
    };

    const fetchLocations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/locations');
            setLocationOptions(res.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            enqueueSnackbar('Error fetching locations!', { variant: 'error' });
        }
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
        setScannedBarcodes(new Set());
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setFormData({
            modelNo: '',
            location: '',
            quantity: 0,
            shd: '',
            scannedCodes: '',
        });
        setErrors({});
        setSelectedProduct(null);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        console.log(`Updating ${name} with value ${value}`);
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'modelNo') {
            const product = productList.find(p => p.model === value);
            setSelectedProduct(product || null);
        }

        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.modelNo) {
            newErrors.modelNo = 'Model No is required';
            isValid = false;
        }
        if (!formData.location) {
            newErrors.location = 'Location is required';
            isValid = false;
        }
        if (!formData.quantity || Number(formData.quantity) <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const product = productList.find(p => p.model === formData.modelNo);
            if (product) {
                const updatedReorder = (product.reorderLevel || 0) + Number(formData.quantity);
                await axios.put(`http://localhost:5000/api/products/${product._id}`, {
                    ...product,
                    reorderLevel: updatedReorder,
                });
            }

            await axios.post('http://localhost:5000/api/inventory', {
                modelNo: formData.modelNo,
                location: formData.location,
                quantity: formData.quantity,
                shd: formData.shd,
                scannedCodes: formData.scannedCodes,
                brand: product.brand,
                dealerPrice: product.dealerPrice,
                mrp: product.mrp,
                model: product.model,
                subCategory: product.subCategory,
                category: product.category,
                currentStock: Number(product.reorderLevel || 0) + Number(formData.quantity),
            });


            enqueueSnackbar('Stock inward recorded and reorderLevel updated!', { variant: 'success' });
            handleDialogClose();
        } catch (err) {
            enqueueSnackbar('Failed to submit stock inward', { variant: 'error' });
            console.error(err);
        }
    };

    useEffect(() => {
        const processBarcode = () => {
            const barcode = formData.shd.trim();
            if (!barcode || !formData.modelNo) {
                setErrors(prev => ({ ...prev, shd: 'Fill model number first!' }));
                return;
            }

            if (barcode.length >= 8) {
                const modelPart = formData.modelNo.includes('-') ? formData.modelNo.split('-')[1] : formData.modelNo;
                if (scannedBarcodes.has(barcode)) {
                    setErrors(prev => ({ ...prev, shd: 'Already scanned!' }));
                } else if (!barcode.includes(modelPart)) {
                    setErrors(prev => ({ ...prev, shd: 'Mismatch with model!' }));
                } else {
                    const newSet = new Set(scannedBarcodes);
                    newSet.add(barcode);
                    setScannedBarcodes(newSet);
                    setFormData(prev => ({
                        ...prev,
                        scannedCodes: prev.scannedCodes ? `${prev.scannedCodes},${barcode}`.replace(/,\s*,/g, ',') : barcode,
                        shd: '',
                    }));

                    setErrors(prev => ({ ...prev, shd: '' }));
                }
            }
        };

        if (formData.shd) {
            const timer = setTimeout(processBarcode, 100);
            return () => clearTimeout(timer);
        }
    }, [formData.shd, formData.modelNo, scannedBarcodes]);

    useEffect(() => {
        console.log('Form Data:', formData);
    }, [formData]);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Stock Inward</h1>
                <p style={styles.subtitle}>Scan products to add them to inventory</p>
            </div>
            <div style={styles.scanCard}>
                <div style={styles.scanIcon}>
                    <div style={styles.iconCircle}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2">
                            <path d="M9 12l2 2 4-4" />
                            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.04.74 5.57 1.97" />
                        </svg>
                    </div>
                </div>
                <h2 style={styles.scanTitle}>Scan Product Barcode</h2>
                <p style={styles.scanDescription}>Use your camera or enter barcode manually</p>
                <button style={styles.startButton} onClick={handleDialogOpen}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={styles.buttonIcon}>
                        <path d="M9 12l2 2 4-4" />
                        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.04.74 5.57 1.97" />
                    </svg>
                    Start Scanning
                </button>
            </div>
            <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Stock Inward</DialogTitle>
                <DialogContent>
                    {selectedProduct && (
                        <div style={styles.productCard}>
                            <div style={styles.productInfo}>
                                <div style={styles.productTitleSection}>
                                    <div style={styles.packageIcon}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                    </div>
                                </div>
                                <div style={styles.productDetailsTwoColumn}>
                                    <p style={styles.detailItem}><strong>Brand:</strong> {selectedProduct.brand}</p>
                                    <p style={styles.detailItem}><strong>Model:</strong> {selectedProduct.model}</p>
                                    <p style={styles.detailItem}><strong>Price:</strong> {selectedProduct.dealerPrice}</p>
                                    <p style={styles.detailItem}><strong>Sub-Category:</strong> {selectedProduct.subCategory}</p>
                                    <p style={styles.detailItem}><strong>Category:</strong> {selectedProduct.category}</p>
                                    <p style={styles.detailItem}><strong>Current Stock:</strong> {selectedProduct.reorderLevel || 0}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <TextField
                        select
                        label="Model No"
                        name="modelNo"
                        value={formData.modelNo}
                        onChange={handleFormChange}
                        fullWidth
                        error={!!errors.modelNo}
                        helperText={errors.modelNo}
                        margin="dense"
                    >
                        {productOptions.map((product) => (
                            <MenuItem key={product.value} value={product.value}>
                                {product.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        fullWidth
                        error={!!errors.location}
                        helperText={errors.location}
                        margin="dense"
                    >
                        {locationOptions.map((location) => (
                            <MenuItem key={location._id} value={location.locationName}>
                                {location.locationName}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleFormChange}
                        fullWidth
                        error={!!errors.quantity}
                        helperText={errors.quantity}
                        margin="dense"
                    />
                    <TextField
                        label="Scan Barcode"
                        name="shd"
                        value={formData.shd}
                        onChange={handleFormChange}
                        fullWidth
                        autoFocus
                        error={!!errors.shd}
                        helperText={errors.shd}
                        margin="dense"
                        inputRef={shdInputRef}
                    />
                    <TextField
                        label="Scanned Codes"
                        name="scannedCodes"
                        value={formData.scannedCodes}
                        onChange={handleFormChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="dense"
                    />
                    <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                        Total Scanned: {scannedBarcodes.size}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} startIcon={<CancelIcon />}>Cancel</Button>
                    <Button onClick={handleSubmit} startIcon={<SaveIcon />} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default StockInward;
