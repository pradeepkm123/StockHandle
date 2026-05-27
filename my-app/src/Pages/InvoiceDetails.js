// // import React, { useState, useEffect, useRef } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell, Divider } from '@mui/material';
// // import { Print, FileCopy, Padding } from '@mui/icons-material';
// // import axios from 'axios';
// // import html2pdf from 'html2pdf.js';
// // import Logo from '../assets/img/Lookman.png';
// // import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// // const convertToIndianCurrencyWords = (amount) => {
// //   const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
// //   const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
// //   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

// //   const convertLessThanOneThousand = (number) => {
// //     let word = '';
// //     if (number % 100 < 10) {
// //       word = ones[number % 10];
// //       number = Math.floor(number / 10);
// //     } else if (number % 100 < 20) {
// //       word = teens[number % 10];
// //       number = Math.floor(number / 10);
// //     } else {
// //       word = ones[number % 10];
// //       number = Math.floor(number / 10);
// //       word = tens[number % 10] + ' ' + word;
// //       number = Math.floor(number / 10);
// //     }
// //     if (number === 0) return word;
// //     return ones[number] + ' Hundred ' + word;
// //   };

// //   const convert = (number) => {
// //     if (number === 0) return 'Zero';
// //     let word = '';
// //     if ((number / 10000000) >= 1) {
// //       word += convertLessThanOneThousand(Math.floor(number / 10000000)) + ' Crore ';
// //       number %= 10000000;
// //     }
// //     if ((number / 100000) >= 1) {
// //       word += convertLessThanOneThousand(Math.floor(number / 100000)) + ' Lakh ';
// //       number %= 100000;
// //     }
// //     if ((number / 1000) >= 1) {
// //       word += convertLessThanOneThousand(Math.floor(number / 1000)) + ' Thousand ';
// //       number %= 1000;
// //     }
// //     if ((number / 100) >= 1) {
// //       word += convertLessThanOneThousand(Math.floor(number / 100)) + ' Hundred ';
// //       number %= 100;
// //     }
// //     if (number > 0) {
// //       word += convertLessThanOneThousand(number);
// //     }
// //     return word.trim();
// //   };

// //   const rupees = Math.floor(amount);
// //   const paise = Math.round((amount - rupees) * 100);

// //   let amountInWords = convert(rupees) + ' Rupees';
// //   if (paise > 0) {
// //     amountInWords += ' and ' + convert(paise) + ' Paise';
// //   }

// //   return amountInWords;
// // };

// // const InvoiceDetails = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const invoiceRef = useRef();
// //   const [dispatch, setDispatch] = useState(null);
// //   const [warehouseDetails, setWarehouseDetails] = useState({
// //     address: '',
// //     city: '',
// //     state: '',
// //     country: '',
// //     zipCode: '',
// //     contactPerson: '',
// //     email: '',
// //     phoneNo: '',
// //   });

// //   useEffect(() => {
// //     const fetchWarehouseDetails = async () => {
// //       try {
// //         const response = await axios.get('https://stockhandle.onrender.com/api/warehouses');
// //         if (response.data.length > 0) {
// //           const warehouse = response.data[0];
// //           setWarehouseDetails({
// //             address: warehouse.address,
// //             city: warehouse.city,
// //             state: warehouse.state,
// //             country: warehouse.country,
// //             zipCode: warehouse.zipCode,
// //             contactPerson: warehouse.contactPerson,
// //             email: warehouse.email,
// //             phoneNo: warehouse.phoneNo,
// //           });
// //         }
// //       } catch (error) {
// //         console.error('Error fetching warehouse details:', error);
// //       }
// //     };

// //     const fetchDispatch = async () => {
// //       try {
// //         const response = await axios.get(`https://stockhandle.onrender.com/api/dispatch/${id}`);
// //         setDispatch(response.data);
// //       } catch (error) {
// //         console.error('Error fetching dispatch details:', error);
// //       }
// //     };

// //     fetchWarehouseDetails();
// //     fetchDispatch();
// //   }, [id]);

// //   const handleDownload = () => {
// //     const element = invoiceRef.current;
// //     const opt = {
// //       margin: 0.5,
// //       filename: `Invoice_${dispatch.invoiceId?.invoiceNumber || id}.pdf`,
// //       image: { type: 'jpeg', quality: 0.98 },
// //       html2canvas: {},
// //       jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
// //     };
// //     html2pdf().set(opt).from(element).save();
// //   };

// //   const handlePrint = () => {
// //     const printContent = invoiceRef.current.innerHTML;
// //     const originalContents = document.body.innerHTML;
// //     document.body.innerHTML = printContent;
// //     window.print();
// //     document.body.innerHTML = originalContents;
// //     window.location.reload();
// //   };

// //   if (!dispatch) return <Typography>Loading...</Typography>;

// //   const subtotal = dispatch.quantity * dispatch.price;
// //   const totalAmount = subtotal;

// //   return (
// //     <Box sx={{ p: 4, backgroundColor: '#f9f9f9' }}>
// //       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// //         <Typography variant="h6" gutterBottom>
// //           Invoice Details
// //         </Typography>
// //         <Button
// //           variant="contained"
// //           color="primary"
// //           startIcon={<ArrowBackIcon />}
// //           onClick={() => navigate('/invoice')}
// //         >
// //           Go Back to Invoice
// //         </Button>
// //       </Box>
// //       <Box ref={invoiceRef} sx={{ backgroundColor: '#fff', p: 3, borderRadius: 2 }}>
// //         <Box display="flex" justifyContent="space-between" mb={4}>
// //           <Box>
// //             <img src={Logo} alt="Logo" height={80} />
// //             <Typography variant="body2">
// //               {warehouseDetails.address}, {warehouseDetails.city}, {warehouseDetails.state}, {warehouseDetails.country}, {warehouseDetails.zipCode}
// //             </Typography>
// //           </Box>
// //           <Box textAlign="right" style={{Padding:'22px'}}>
// //             <Typography variant="body2">Invoice No: <strong>{dispatch.invoiceNumber || 'N/A'}</strong></Typography>
// //             <Typography variant="body2">Created Date: {new Date(dispatch.dispatchDate).toLocaleDateString()}</Typography>
// //             <Typography variant="body2">Store Name: <b>{dispatch.storeName}</b></Typography>
// //           </Box>
// //         </Box>
// //         <Divider sx={{ my: 2, borderStyle: 'dotted', borderColor: 'gray', borderWidth: 1 }} />
// //         <Box display="flex" justifyContent="space-between" mb={4}>
// //           <Box>
// //             <Typography variant="subtitle2">From</Typography>
// //             <Typography variant="body2">{warehouseDetails.contactPerson}</Typography>
// //             <Typography variant="body2">{warehouseDetails.address}</Typography>
// //             <Typography variant="body2">Email: {warehouseDetails.email}</Typography>
// //             <Typography variant="body2">PhoneNo: {warehouseDetails.phoneNo}</Typography>
// //           </Box>
// //           <Box>
// //             <Typography variant="subtitle2">To</Typography>
// //             <Typography variant="body2">{dispatch.customerName}</Typography>
// //             <Typography variant="body2">{dispatch.customerAddress}</Typography>
// //             <Typography variant="body2">{dispatch.mailId}</Typography>
// //             <Typography variant="body2">{dispatch.phoneNumber}</Typography>
// //           </Box>
// //         </Box>
// //         <Divider sx={{ my: 2, borderStyle: 'dotted', borderColor: 'gray', borderWidth: 1 }} />
// //         <Typography variant="body2" mb={2}>
// //           Invoice For: <strong>Product Purchase</strong>
// //         </Typography>
// //         <Table>
// //           <TableHead style={{ backgroundColor: '#f7f7f7' }}>
// //             <TableRow>
// //               <TableCell>Model No</TableCell>
// //               <TableCell>Qty</TableCell>
// //               <TableCell>Single(Pic) Price</TableCell>
// //               <TableCell>Barcode(s)</TableCell>
// //               <TableCell>Total</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             <TableRow>
// //               <TableCell>{dispatch.modelNo}</TableCell>
// //               <TableCell>{dispatch.quantity}</TableCell>
// //               <TableCell>₹{dispatch.price}</TableCell>
// //               <TableCell>{dispatch.barcodes?.join(', ')}</TableCell>
// //               <TableCell>₹{subtotal}</TableCell>
// //             </TableRow>
// //           </TableBody>
// //         </Table>
// //         <Box mt={3} justifySelf={'flex-end'}>
// //           <Box display="flex" justifyContent="space-between">
// //             <Typography>Sub Total:</Typography>
// //             <Typography>₹{subtotal}</Typography>
// //           </Box>
// //           <Box display="flex" justifyContent="space-between">
// //             <Typography>Discount (0%):</Typography>
// //             <Typography>₹0</Typography>
// //           </Box>
// //           <Box display="flex" justifyContent="space-between" mt={1}>
// //             <Typography variant="h6">Total Amount:</Typography>
// //             <Typography variant="h6">₹{totalAmount.toFixed(2)}</Typography>
// //           </Box>
// //           <Box display="flex" justifyContent="space-between">
// //             <Typography variant="caption">Amount in Words:</Typography>
// //             <Typography variant="caption">({convertToIndianCurrencyWords(totalAmount)}) Only -/</Typography>
// //           </Box>
// //         </Box>
// //         <Divider sx={{ my: 2, borderStyle: 'dotted', borderColor: 'gray', borderWidth: 1 }} />
// //         <Box mt={4} display="flex" justifyContent="space-between">
// //           <Box textAlign="right">
// //             {/* <img src="/signature.png" alt="Signature" height={40} /> */}
// //             <Typography><b>{warehouseDetails.contactPerson}</b></Typography>
// //             <Typography variant="body2">Assistant Manager</Typography>
// //           </Box>
// //         </Box>
// //         <Divider sx={{ my: 2, borderStyle: 'dotted', borderColor: 'gray', borderWidth: 0.1 }} />
// //         <Box textAlign="center">
// //           <img src={Logo} alt="Logo" height={50} />
// //         </Box>
// //       </Box>
// //       <Box mt={2} textAlign="center">
// //         <Button variant="contained" color="primary" startIcon={<Print />} onClick={handlePrint} sx={{ mr: 2 }}>
// //           Print Invoice
// //         </Button>
// //         <Button variant="contained" color="primary" startIcon={<FileCopy />} onClick={handleDownload}>
// //           Download Invoice
// //         </Button>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default InvoiceDetails;















// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   Button,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Divider
// } from '@mui/material';
// import { Print, FileCopy } from '@mui/icons-material';
// import axios from 'axios';
// import html2pdf from 'html2pdf.js';
// import Logo from '../assets/img/Lookman.png';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const convertToIndianCurrencyWords = (amount) => {
//   const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//   const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

//   const convertLessThanOneThousand = (number) => {
//     let word = '';
//     if (number % 100 < 10) {
//       word = ones[number % 10];
//       number = Math.floor(number / 10);
//     } else if (number % 100 < 20) {
//       word = teens[number % 10];
//       number = Math.floor(number / 10);
//     } else {
//       word = ones[number % 10];
//       number = Math.floor(number / 10);
//       word = tens[number % 10] + ' ' + word;
//       number = Math.floor(number / 10);
//     }
//     if (number === 0) return word;
//     return ones[number] + ' Hundred ' + word;
//   };

//   const convert = (number) => {
//     if (number === 0) return 'Zero';
//     let word = '';
//     if (number >= 10000000) {
//       word += convertLessThanOneThousand(Math.floor(number / 10000000)) + ' Crore ';
//       number %= 10000000;
//     }
//     if (number >= 100000) {
//       word += convertLessThanOneThousand(Math.floor(number / 100000)) + ' Lakh ';
//       number %= 100000;
//     }
//     if (number >= 1000) {
//       word += convertLessThanOneThousand(Math.floor(number / 1000)) + ' Thousand ';
//       number %= 1000;
//     }
//     if (number >= 100) {
//       word += convertLessThanOneThousand(Math.floor(number / 100)) + ' Hundred ';
//       number %= 100;
//     }
//     if (number > 0) {
//       word += convertLessThanOneThousand(number);
//     }
//     return word.trim();
//   };

//   const rupees = Math.floor(amount);
//   const paise = Math.round((amount - rupees) * 100);

//   let amountInWords = convert(rupees) + ' Rupees';
//   if (paise > 0) {
//     amountInWords += ' and ' + convert(paise) + ' Paise';
//   }

//   return amountInWords;
// };

// const InvoiceDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const invoiceRef = useRef(null);

//   const [dispatch, setDispatch] = useState(null);
//   const [warehouseDetails, setWarehouseDetails] = useState({
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//     zipCode: '',
//     contactPerson: '',
//     email: '',
//     phoneNo: '',
//   });

//   useEffect(() => {
//     const fetchWarehouseDetails = async () => {
//       try {
//         const res = await axios.get('https://stockhandle.onrender.com/api/warehouses');
//         if (res.data.length > 0) {
//           const w = res.data[0];
//           setWarehouseDetails({
//             address: w.address,
//             city: w.city,
//             state: w.state,
//             country: w.country,
//             zipCode: w.zipCode,
//             contactPerson: w.contactPerson,
//             email: w.email,
//             phoneNo: w.phoneNo,
//           });
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     const fetchDispatch = async () => {
//       try {
//         const res = await axios.get(`https://stockhandle.onrender.com/api/dispatch/${id}`);
//         setDispatch(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchWarehouseDetails();
//     fetchDispatch();
//   }, [id]);

//   const handleDownload = () => {
//     html2pdf().from(invoiceRef.current).save(`Invoice_${id}.pdf`);
//   };

//   const handlePrint = () => {
//     const printContent = invoiceRef.current.innerHTML;
//     const originalContents = document.body.innerHTML;
//     document.body.innerHTML = printContent;
//     window.print();
//     document.body.innerHTML = originalContents;
//     window.location.reload();
//   };

//   if (!dispatch) return <Typography>Loading...</Typography>;

//   const subtotal = dispatch.quantity * dispatch.price;

//   return (
//     <Box sx={{ p: 4, backgroundColor: '#f9f9f9' }}>
//       <Box display="flex" justifyContent="space-between" mb={2}>
//         <Typography variant="h6">Invoice Details</Typography>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/invoice')}>
//           Back
//         </Button>
//       </Box>

//       <Box ref={invoiceRef} sx={{ backgroundColor: '#fff', p: 3 }}>
//         <img src={Logo} alt="Logo" height={70} />
//         <Divider sx={{ my: 2 }} />

//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Model</TableCell>
//               <TableCell>Qty</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Barcodes</TableCell>
//               <TableCell>Total</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow>
//               <TableCell>{dispatch.modelNo}</TableCell>
//               <TableCell>{dispatch.quantity}</TableCell>
//               <TableCell>₹{dispatch.price}</TableCell>
//               <TableCell>{dispatch.barcodes?.join(', ')}</TableCell>
//               <TableCell>₹{subtotal}</TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>

//         <Divider sx={{ my: 2 }} />

//         <Typography variant="body2">
//           Amount in Words: ({convertToIndianCurrencyWords(subtotal)}) Only
//         </Typography>
//       </Box>

//       <Box mt={2} textAlign="center">
//         <Button startIcon={<Print />} onClick={handlePrint} sx={{ mr: 2 }}>
//           Print
//         </Button>
//         <Button startIcon={<FileCopy />} onClick={handleDownload}>
//           Download
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default InvoiceDetails;




import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Grid,
} from '@mui/material';
import { Print, FileCopy } from '@mui/icons-material';
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
    if (number === 0) return word.trim();
    return (ones[number] + ' Hundred ' + word).trim();
  };

  const convert = (number) => {
    if (number === 0) return 'Zero';
    let word = '';
    if (number >= 10000000) {
      word += convertLessThanOneThousand(Math.floor(number / 10000000)) + ' Crore ';
      number %= 10000000;
    }
    if (number >= 100000) {
      word += convertLessThanOneThousand(Math.floor(number / 100000)) + ' Lakh ';
      number %= 100000;
    }
    if (number >= 1000) {
      word += convertLessThanOneThousand(Math.floor(number / 1000)) + ' Thousand ';
      number %= 1000;
    }
    if (number > 0) {
      word += convertLessThanOneThousand(number);
    }
    return word.trim();
  };

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let amountInWords = convert(rupees) + ' Rupees';
  if (paise > 0) amountInWords += ' and ' + convert(paise) + ' Paise';
  return amountInWords;
};

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);

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
        const res = await axios.get('https://stockhandle-taxr.onrender.com/api/warehouses');
        if (Array.isArray(res.data) && res.data.length > 0) {
          const w = res.data[0];
          setWarehouseDetails({
            address: w.address || '',
            city: w.city || '',
            state: w.state || '',
            country: w.country || '',
            zipCode: w.zipCode || '',
            contactPerson: w.contactPerson || '',
            email: w.email || '',
            phoneNo: w.phoneNo || '',
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDispatch = async () => {
      try {
        const res = await axios.get(`https://stockhandle-taxr.onrender.com/api/dispatch/${id}`);
        setDispatch(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWarehouseDetails();
    fetchDispatch();
  }, [id]);

  const handleDownload = () => {
    if (!invoiceRef.current) return;
    html2pdf().from(invoiceRef.current).save(`Invoice_${id}.pdf`);
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printContent = invoiceRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const subtotal = useMemo(() => {
    if (!dispatch) return 0;
    const qty = Number(dispatch.quantity || 0);
    const price = Number(dispatch.price || 0);
    return qty * price;
  }, [dispatch]);

  if (!dispatch) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9' }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Invoice Details</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/invoice')}>
          Back
        </Button>
      </Box>

      <Box ref={invoiceRef} sx={{ backgroundColor: '#fff', p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box>
            <img src={Logo} alt="Logo" height={70} />
            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 700 }}>
              Warehouse / Seller Details
            </Typography>

            {/* ✅ warehouseDetails USED HERE (fixes no-unused-vars) */}
            <Typography variant="body2">
              {warehouseDetails.address}
              {(warehouseDetails.city || warehouseDetails.state || warehouseDetails.zipCode) ? ',' : ''}
              {' '}
              {warehouseDetails.city}
              {warehouseDetails.state ? `, ${warehouseDetails.state}` : ''}
              {warehouseDetails.zipCode ? ` - ${warehouseDetails.zipCode}` : ''}
              {warehouseDetails.country ? `, ${warehouseDetails.country}` : ''}
            </Typography>

            {warehouseDetails.contactPerson && (
              <Typography variant="body2">Contact: {warehouseDetails.contactPerson}</Typography>
            )}
            {warehouseDetails.phoneNo && (
              <Typography variant="body2">Phone: {warehouseDetails.phoneNo}</Typography>
            )}
            {warehouseDetails.email && (
              <Typography variant="body2">Email: {warehouseDetails.email}</Typography>
            )}
          </Box>

          <Box textAlign="right">
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Invoice ID
            </Typography>
            <Typography variant="body2">{id}</Typography>

            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 700 }}>
              Date
            </Typography>
            <Typography variant="body2">
              {dispatch.createdAt ? new Date(dispatch.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Optional: Customer / Receiver details if available */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Dispatch Details
            </Typography>
            <Typography variant="body2">Model: {dispatch.modelNo}</Typography>
            <Typography variant="body2">Quantity: {dispatch.quantity}</Typography>
            <Typography variant="body2">Price: ₹{dispatch.price}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Additional Info
            </Typography>
            <Typography variant="body2">Store: {dispatch.storeName || '-'}</Typography>
            <Typography variant="body2">Sales Person: {dispatch.salePerson || '-'}</Typography>
          </Grid>
        </Grid>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Barcodes</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>{dispatch.modelNo}</TableCell>
              <TableCell>{dispatch.quantity}</TableCell>
              <TableCell>₹{dispatch.price}</TableCell>
              <TableCell>
                {Array.isArray(dispatch.barcodes) ? dispatch.barcodes.join(', ') : dispatch.barcodes || '-'}
              </TableCell>
              <TableCell>₹{subtotal}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} flexWrap="wrap">
          <Typography variant="body2">
            Amount in Words: ({convertToIndianCurrencyWords(subtotal)}) Only
          </Typography>

          <Box textAlign="right">
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Subtotal
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              ₹{subtotal}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={2} textAlign="center">
        <Button startIcon={<Print />} onClick={handlePrint} sx={{ mr: 2 }}>
          Print
        </Button>
        <Button startIcon={<FileCopy />} onClick={handleDownload}>
          Download
        </Button>
      </Box>
    </Box>
  );
};

export default InvoiceDetails;
