import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell, Divider } from '@mui/material';
import { Print, FileCopy, Padding } from '@mui/icons-material';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import Logo from '../assets/img/Lookman.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const convertToIndianCurrencyWords = (amount) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convertLessThanOneThousand = (number) => {
    let word = '';
    if (number % 100 < 10) {
      word = ones[number % 10];
      number = Math.floor(number / 10);
    } else if (number % 100 < 20) {
      word = teens[number % 10];
      number = Math.floor(number / 10);
    } else {
      word = ones[number % 10];
      number = Math.floor(number / 10);
      word = tens[number % 10] + ' ' + word;
      number = Math.floor(number / 10);
    }
    if (number === 0) return word;
    return ones[number] + ' Hundred ' + word;
  };

  const convert = (number) => {
    if (number === 0) return 'Zero';
    let word = '';
    if ((number / 10000000) >= 1) {
      word += convertLessThanOneThousand(Math.floor(number / 10000000)) + ' Crore ';
      number %= 10000000;
    }
    if ((number / 100000) >= 1) {
      word += convertLessThanOneThousand(Math.floor(number / 100000)) + ' Lakh ';
      number %= 100000;
    }
    if ((number / 1000) >= 1) {
      word += convertLessThanOneThousand(Math.floor(number / 1000)) + ' Thousand ';
      number %= 1000;
    }
    if ((number / 100) >= 1) {
      word += convertLessThanOneThousand(Math.floor(number / 100)) + ' Hundred ';
      number %= 100;
    }
    if (number > 0) {
      word += convertLessThanOneThousand(number);
    }
    return word.trim();
  };

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let amountInWords = convert(rupees) + ' Rupees';
  if (paise > 0) {
    amountInWords += ' and ' + convert(paise) + ' Paise';
  }

  return amountInWords;
};

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef();
  const [dispatch, setDispatch] = useState(null);
  const [warehouseDetails, setWarehouseDetails] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    contactPerson: '',
    email: '',
    phoneNo: '',
  });

  useEffect(() => {
    const fetchWarehouseDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/warehouses');
        if (response.data.length > 0) {
          const warehouse = response.data[0];
          setWarehouseDetails({
            address: warehouse.address,
            city: warehouse.city,
            state: warehouse.state,
            country: warehouse.country,
            zipCode: warehouse.zipCode,
            contactPerson: warehouse.contactPerson,
            email: warehouse.email,
            phoneNo: warehouse.phoneNo,
          });
        }
      } catch (error) {
        console.error('Error fetching warehouse details:', error);
      }
    };

    const fetchDispatch = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/dispatch/${id}`);
        setDispatch(response.data);
      } catch (error) {
        console.error('Error fetching dispatch details:', error);
      }
    };

    fetchWarehouseDetails();
    fetchDispatch();
  }, [id]);

  const handleDownload = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0.5,
      filename: `Invoice_${dispatch.invoiceId?.invoiceNumber || id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {},
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (!dispatch) return <Typography>Loading...</Typography>;

  const subtotal = dispatch.quantity * dispatch.price;
  const totalAmount = subtotal;

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          Invoice Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/invoice')}
        >
          Go Back to Invoice
        </Button>
      </Box>
      <Box ref={invoiceRef} sx={{ backgroundColor: '#fff', p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Box>
            <img src={Logo} alt="Logo" height={80} />
            <Typography variant="body2">
              {warehouseDetails.address}, {warehouseDetails.city}, {warehouseDetails.state}, {warehouseDetails.country}, {warehouseDetails.zipCode}
            </Typography>
          </Box>
          <Box textAlign="right" style={{Padding:'22px'}}>
            <Typography variant="body2">Invoice No: <strong>{dispatch.invoiceNumber || 'N/A'}</strong></Typography>
            <Typography variant="body2">Created Date: {new Date(dispatch.dispatchDate).toLocaleDateString()}</Typography>
            <Typography variant="body2">Store Name: <b>{dispatch.storeName}</b></Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, borderStyle: 'dotted', borderColor: 'gray', borderWidth: 1 }} />
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Box>
            <Typography variant="subtitle2">From</Typography>
            <Typography variant="body2">{warehouseDetails.contactPerson}</Typography>
            <Typography variant="body2">{warehouseDetails.address}</Typography>
            <Typography variant="body2">Email: {warehouseDetails.email}</Typography>
            <Typography variant="body2">PhoneNo: {warehouseDetails.phoneNo}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">To</Typography>
            <Typography variant="body2">{dispatch.customerName}</Typography>
            <Typography variant="body2">{dispatch.customerAddress}</Typography>
            <Typography variant="body2">{dispatch.mailId}</Typography>
            <Typography variant="body2">{dispatch.phoneNumber}</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, borderStyle: 'dotted', borderColor: 'gray', borderWidth: 1 }} />
        <Typography variant="body2" mb={2}>
          Invoice For: <strong>Product Purchase</strong>
        </Typography>
        <Table>
          <TableHead style={{ backgroundColor: '#f7f7f7' }}>
            <TableRow>
              <TableCell>Model No</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Single(Pic) Price</TableCell>
              <TableCell>Barcode(s)</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{dispatch.modelNo}</TableCell>
              <TableCell>{dispatch.quantity}</TableCell>
              <TableCell>₹{dispatch.price}</TableCell>
              <TableCell>{dispatch.barcodes?.join(', ')}</TableCell>
              <TableCell>₹{subtotal}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box mt={3} justifySelf={'flex-end'}>
          <Box display="flex" justifyContent="space-between">
            <Typography>Sub Total:</Typography>
            <Typography>₹{subtotal}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>Discount (0%):</Typography>
            <Typography>₹0</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="h6">Total Amount:</Typography>
            <Typography variant="h6">₹{totalAmount.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="caption">Amount in Words:</Typography>
            <Typography variant="caption">({convertToIndianCurrencyWords(totalAmount)}) Only -/</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, borderStyle: 'dotted', borderColor: 'gray', borderWidth: 1 }} />
        <Box mt={4} display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2">Terms and Conditions</Typography>
            <Typography variant="body2">Please pay within 15 days from the date of invoice. Overdue interest @14% will be charged on delayed payments.</Typography>
            <Typography variant="subtitle2" mt={2}>Notes</Typography>
            <Typography variant="body2">Please quote invoice number when remitting funds.</Typography>
          </Box>
          <Box textAlign="right">
            {/* <img src="/signature.png" alt="Signature" height={40} /> */}
            <Typography><b>{warehouseDetails.contactPerson}</b></Typography>
            <Typography variant="body2">Assistant Manager</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2, borderStyle: 'dotted', borderColor: 'gray', borderWidth: 0.1 }} />
        <Box textAlign="center">
          <img src={Logo} alt="Logo" height={50} />
          <Typography variant="body2" mt={1}>
            Payment Made Via bank transfer / Cheque in the name of Thomas Lawler<br />
            Bank Name: HDFC Bank | Account Number: 45366287987 | IFSC: HDFCO018159
          </Typography>
        </Box>
      </Box>
      <Box mt={2} textAlign="center">
        <Button variant="contained" color="primary" startIcon={<Print />} onClick={handlePrint} sx={{ mr: 2 }}>
          Print Invoice
        </Button>
        <Button variant="contained" color="primary" startIcon={<FileCopy />} onClick={handleDownload}>
          Download Invoice
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceDetails;
