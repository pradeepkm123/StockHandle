// import React, { useState, useEffect } from 'react';
// import '../assets/css/ServiceDashboard.css';
// import axios from 'axios';
// import { useUser } from "./UserContext";
// import {
//     Pagination as MuiPagination,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Button as MuiButton,
//     TextField
// } from '@mui/material';

// const ServiceDashboard = () => {
//     const { user } = useUser();
//     const [services, setServices] = useState([]);
//     const [showPaymentDialog, setShowPaymentDialog] = useState(false);
//     const [showDetailsDialog, setShowDetailsDialog] = useState(false);
//     const [selectedService, setSelectedService] = useState(null);
//     const [paymentAmount, setPaymentAmount] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [statusFilter, setStatusFilter] = useState('All');
//     const [dispatchFilter, setDispatchFilter] = useState('All');

//     useEffect(() => {
//         const fetchServices = async () => {
//             try {
//                 const response = await axios.get('https://stockhandle.onrender.com/api/services');
//                 setServices(response.data);
//             } catch (error) {
//                 console.error('Error fetching services:', error);
//             }
//         };
//         fetchServices();
//     }, []);

//     const handlePaymentSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.put(`https://stockhandle.onrender.com/api/services/${selectedService._id}`, {
//                 paymentAmount: paymentAmount,
//                 status: 'PAYMENT_PROCESSED'
//             });
//             setServices(services.map(s => s._id === selectedService._id ? response.data : s));
//             setShowPaymentDialog(false);
//             setPaymentAmount('');
//         } catch (error) {
//             console.error('Error updating payment:', error);
//         }
//     };

//     const handleDispatchOrder = async (serviceId) => {
//         try {
//             const response = await axios.put(`https://stockhandle.onrender.com/api/services/${serviceId}`, {
//                 dispatchStatus: 'Dispatched',
//                 status: 'COMPLETED'
//             });
//             const updatedServicesResponse = await axios.get('https://stockhandle.onrender.com/api/services');
//             setServices(updatedServicesResponse.data);
//         } catch (error) {
//             console.error('Error updating dispatch status:', error);
//         }
//     };

//     // Filtering logic
//     const filteredServices = services.filter(service => {
//         const statusMatch = statusFilter === 'All' || service.status === statusFilter;
//         const dispatchMatch = dispatchFilter === 'All' || service.dispatchStatus === dispatchFilter;
//         return statusMatch && dispatchMatch;
//     });

//     // Pagination logic
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

//     // Stats
//     const totalServices = services.length;
//     const pendingPayment = services.filter(s => s.paymentAmount === 'Not Processed').length;
//     const paymentProcessed = services.filter(s => s.paymentAmount !== 'Not Processed').length;
//     const dispatched = services.filter(s => s.dispatchStatus === 'Dispatched').length;

//     return (
//         <div className="dashboard-container">
//             {/* Header and Stats Cards */}
//             <div className="header">
//                 <div className="header-title">
//                     <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                         <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                     <h1 className="header-title-h1">Our Services</h1>
//                 </div>
//             </div>
//             <div className="stats-grid">
//                 <div className="stat-card">
//                     <div className="stat-content">
//                         <div className="stat-text">
//                             <p className="stat-label">Total Services</p>
//                             <p className="stat-value">{totalServices}</p>
//                         </div>
//                         <div className="stat-icon stat-icon-blue">
//                             <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                 <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-content">
//                         <div className="stat-text">
//                             <p className="stat-label">Pending Payment</p>
//                             <p className="stat-value">{pendingPayment}</p>
//                         </div>
//                         <div className="stat-icon stat-icon-yellow">
//                             <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                 <circle cx="12" cy="12" r="10" strokeWidth="2" />
//                                 <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-content">
//                         <div className="stat-text">
//                             <p className="stat-label">Payment Processed</p>
//                             <p className="stat-value stat-value-blue">{paymentProcessed}</p>
//                         </div>
//                         <div className="stat-icon stat-icon-blue">
//                             <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                 <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" />
//                                 <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="stat-card">
//                     <div className="stat-content">
//                         <div className="stat-text">
//                             <p className="stat-label">Dispatched</p>
//                             <p className="stat-value stat-value-green">{dispatched}</p>
//                         </div>
//                         <div className="stat-icon stat-icon-green">
//                             <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" />
//                                 <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Filters */}
//             <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
//                 <FormControl className="mui-form-control" style={{
//                     minWidth: 180,
//                     padding: "8px 12px",
//                     marginRight: "16px",
//                 }}>
//                     <InputLabel>Status</InputLabel>
//                     <Select
//                         value={statusFilter}
//                         onChange={(e) => {
//                             setStatusFilter(e.target.value);
//                             setCurrentPage(1);
//                         }}
//                         label="Status"
//                         className="mui-select"
//                     >
//                         <MenuItem value="All">All</MenuItem>
//                         <MenuItem value="PENDING">Pending</MenuItem>
//                         <MenuItem value="PAYMENT_PROCESSED">Payment Processed</MenuItem>
//                         <MenuItem value="COMPLETED">Completed</MenuItem>
//                     </Select>
//                 </FormControl>
//                 <FormControl className="mui-form-control" style={{
//                     minWidth: 180,
//                     padding: "8px 12px",
//                     marginRight: "16px",
//                 }}>
//                     <InputLabel>Dispatch</InputLabel>
//                     <Select
//                         value={dispatchFilter}
//                         onChange={(e) => {
//                             setDispatchFilter(e.target.value);
//                             setCurrentPage(1);
//                         }}
//                         label="Dispatch"
//                         className="mui-select"
//                     >
//                         <MenuItem value="All">All</MenuItem>
//                         <MenuItem value="Dispatched">Dispatched</MenuItem>
//                         <MenuItem value="Not Dispatched">Not Dispatched</MenuItem>
//                     </Select>
//                 </FormControl>
//             </div>

//             {/* Table */}
//             <div className="table-container">
//                 <table className="services-table">
//                     <thead className="table-head">
//                         <tr>
//                             <th className="table-header-cell">Service ID</th>
//                             <th className="table-header-cell">Customer Name</th>
//                             <th className="table-header-cell">Model No</th>
//                             <th className="table-header-cell">Received Date</th>
//                             <th className="table-header-cell">Status</th>
//                             <th className="table-header-cell">Store Name</th>
//                             <th className="table-header-cell">Product Image</th>
//                             <th className="table-header-cell">Payment</th>
//                             <th className="table-header-cell">Dispatch</th>
//                             <th className="table-header-cell">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentServices.length > 0 ? (
//                             currentServices.map((service) => (
//                                 <tr key={service._id}>
//                                     <td className="table-cell" data-label="Service ID">{service.serviceId}</td>
//                                     <td className="table-cell" data-label="Customer Name">{service.customerName}</td>
//                                     <td className="table-cell" data-label="Model No">{service.modelNo}</td>
//                                     <td className="table-cell" data-label="Received Date">{new Date(service.receivedDate).toLocaleDateString()}</td>
//                                     <td className="table-cell" data-label="Status">
//                                         <span className={`status-badge status-${service.status.toLowerCase()}`}>{service.status}</span>
//                                     </td>
//                                     <td className="table-cell" data-label="Model No">{service.storeName}</td>
//                                     <td className="table-cell" data-label="Product Image">
//                                         <img
//                                             src={`https://stockhandle.onrender.com/uploads/${service.productImage}`}
//                                             alt="Product"
//                                             style={{
//                                                 width: '60px',
//                                                 height: '60px',
//                                                 objectFit: 'cover',
//                                                 borderRadius: '8px',
//                                                 border: '1px solid #ccc',
//                                                 backgroundColor: '#f8f8f8'
//                                             }}
//                                         />
//                                     </td>
//                                     <td className="table-cell" data-label="Payment">
//                                         <button
//                                             className="btn btn-payment"
//                                             onClick={() => {
//                                                 setSelectedService(service);
//                                                 setShowPaymentDialog(true);
//                                             }}
//                                         >
//                                             <span className="btn-icon">₹</span> Add Payment
//                                         </button>
//                                     </td>
//                                     <td className="table-cell" data-label="Dispatch">
//                                         {service.status === 'PAYMENT_PROCESSED' && service.dispatchStatus !== 'Dispatched' ? (
//                                             <button
//                                                 className="btn btn-dispatch"
//                                                 onClick={() => handleDispatchOrder(service._id)}
//                                             >
//                                                 Dispatch Order
//                                             </button>
//                                         ) : (
//                                             <span className={`dispatch-status ${service.dispatchStatus === 'Dispatched' ? 'green' : ''}`}>
//                                                 <svg className="clock-icon" viewBox="0 0 24 24" fill="none" stroke={service.dispatchStatus === 'Dispatched' ? 'green' : 'currentColor'}>
//                                                     {service.dispatchStatus === 'Dispatched' ? (
//                                                         <>
//                                                             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" />
//                                                             <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" />
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             <circle cx="12" cy="12" r="10" strokeWidth="2" />
//                                                             <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
//                                                         </>
//                                                     )}
//                                                 </svg>
//                                                 {service.dispatchStatus === 'Dispatched' ? 'Dispatched' : 'Not Dispatched'}
//                                             </span>
//                                         )}
//                                     </td>
//                                     <td className="table-cell" data-label="Actions">
//                                         <button
//                                             className="btn btn-view"
//                                             onClick={() => {
//                                                 setSelectedService(service);
//                                                 setShowDetailsDialog(true);
//                                             }}
//                                         >
//                                             <svg className="btn-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" />
//                                                 <circle cx="12" cy="12" r="3" strokeWidth="2" />
//                                             </svg>
//                                             View Details
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="8" style={{ textAlign: 'center' }}>No services found</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
//                 <MuiPagination
//                     count={totalPages}
//                     page={currentPage}
//                     onChange={(event, value) => setCurrentPage(value)}
//                     color="primary"
//                     shape="rounded"
//                     className="mui-pagination"
//                 />
//             </div>

//             {/* Payment Dialog (UPI ID removed) */}
//             {showPaymentDialog && selectedService && (
//                 <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} className="mui-dialog">
//                     <DialogTitle>Add Payment Details</DialogTitle>
//                     <DialogContent>
//                         <div style={{ marginBottom: '16px' }}>
//                             <p><strong>Service ID:</strong> {selectedService.serviceId}</p>
//                             <p><strong>Customer:</strong> {selectedService.customerName}</p>
//                         </div>
//                         <TextField
//                             label="Payment Amount (₹)"
//                             type="number"
//                             value={paymentAmount}
//                             onChange={(e) => setPaymentAmount(e.target.value)}
//                             fullWidth
//                             required
//                             className="mui-textfield"
//                         />
//                     </DialogContent>
//                     <DialogActions>
//                         <MuiButton onClick={() => setShowPaymentDialog(false)}>Cancel</MuiButton>
//                         <MuiButton onClick={handlePaymentSubmit} color="primary">Process Payment</MuiButton>
//                     </DialogActions>
//                 </Dialog>
//             )}

//             {/* Details Dialog */}
//             {showDetailsDialog && selectedService && (
//                 <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)} maxWidth="md" fullWidth className="mui-dialog">
//                     <DialogTitle>Service Details - {selectedService.serviceId}</DialogTitle>
//                     <DialogContent>
//                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
//                             <div>
//                                 <p><strong>Serial Number:</strong> {selectedService.serialNo}</p>
//                                 <p><strong>Model Number:</strong> {selectedService.modelNo}</p>
//                                 <p><strong>Warranty Status:</strong> {selectedService.warrantyStatus}</p>
//                                 <p><strong>Received Date:</strong> {new Date(selectedService.receivedDate).toLocaleDateString()}</p>
//                             </div>
//                             <div>
//                                 <p><strong>Customer Name:</strong> {selectedService.customerName}</p>
//                                 <p><strong>Customer Phone:</strong> {selectedService.customerPhone}</p>
//                                 <p><strong>Customer Address:</strong> {selectedService.customerAddress}</p>
//                                 <p><strong>Problem Description:</strong> {selectedService.problemDescription}</p>
//                             </div>
//                             <div>
//                                 <p><strong>Payment Amount:</strong> ₹ {selectedService.paymentAmount || 'Not Processed'}</p>
//                                 <p><strong>Dispatch Status:</strong> {selectedService.dispatchStatus || 'Not Dispatched'}</p>
//                                 <p><strong>Added By:</strong> {selectedService.createdBy || 'N/A'}</p>
//                             </div>
//                         </div>
//                     </DialogContent>
//                     <DialogActions>
//                         <MuiButton onClick={() => setShowDetailsDialog(false)}>Close</MuiButton>
//                     </DialogActions>
//                 </Dialog>
//             )}
//         </div>
//     );
// };

// export default ServiceDashboard;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../assets/css/ServiceDashboard.css';
import axios from 'axios';
import { useUser } from './UserContext';
import {
  Pagination as MuiPagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  TextField
} from '@mui/material';

const API_BASE = 'https://stockhandle-taxr.onrender.com/api';
const FILE_HOST = 'https://stockhandle-taxr.onrender.com';

const ServiceDashboard = () => {
  const { user } = useUser();

  const [services, setServices] = useState([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [statusFilter, setStatusFilter] = useState('All');
  const [dispatchFilter, setDispatchFilter] = useState('All');

  const fetchServices = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/services`);
      setServices(res.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService?._id) return;

    try {
      const res = await axios.put(`${API_BASE}/services/${selectedService._id}`, {
        paymentAmount,
        status: 'PAYMENT_PROCESSED',
      });

      setServices((prev) => prev.map((s) => (s._id === selectedService._id ? res.data : s)));
      setShowPaymentDialog(false);
      setPaymentAmount('');
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleDispatchOrder = async (serviceId) => {
    try {
      await axios.put(`${API_BASE}/services/${serviceId}`, {
        dispatchStatus: 'Dispatched',
        status: 'COMPLETED',
      });

      // refresh list
      fetchServices();
    } catch (error) {
      console.error('Error updating dispatch status:', error);
    }
  };

  // Filtering logic (includes store filter for non-admin)
  const filteredServices = useMemo(() => {
    return (services || []).filter((service) => {
      const statusMatch = statusFilter === 'All' || service.status === statusFilter;
      const dispatchMatch =
        dispatchFilter === 'All' || service.dispatchStatus === dispatchFilter;

      const storeMatch =
        !user?.role || user.role === 'admin'
          ? true
          : service.storeName?.toLowerCase() === user.role.toLowerCase();

      return statusMatch && dispatchMatch && storeMatch;
    });
  }, [services, statusFilter, dispatchFilter, user?.role]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  // Stats (based on filtered list so store users see their own stats)
  const totalServices = filteredServices.length;
  const pendingPayment = filteredServices.filter((s) => s.paymentAmount === 'Not Processed').length;
  const paymentProcessed = filteredServices.filter((s) => s.paymentAmount !== 'Not Processed').length;
  const dispatched = filteredServices.filter((s) => s.dispatchStatus === 'Dispatched').length;

  // reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dispatchFilter, user?.role]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <div className="header-title">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="header-title-h1">Our Services</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-text">
              <p className="stat-label">Total Services</p>
              <p className="stat-value">{totalServices}</p>
            </div>
            <div className="stat-icon stat-icon-blue">
              <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-text">
              <p className="stat-label">Pending Payment</p>
              <p className="stat-value">{pendingPayment}</p>
            </div>
            <div className="stat-icon stat-icon-yellow">
              <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-text">
              <p className="stat-label">Payment Processed</p>
              <p className="stat-value stat-value-blue">{paymentProcessed}</p>
            </div>
            <div className="stat-icon stat-icon-blue">
              <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" />
                <path
                  d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-text">
              <p className="stat-label">Dispatched</p>
              <p className="stat-value stat-value-green">{dispatched}</p>
            </div>
            <div className="stat-icon stat-icon-green">
              <svg className="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" />
                <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <FormControl
          className="mui-form-control"
          style={{ minWidth: 180, padding: '8px 12px', marginRight: '16px' }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
            className="mui-select"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PAYMENT_PROCESSED">Payment Processed</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          className="mui-form-control"
          style={{ minWidth: 180, padding: '8px 12px', marginRight: '16px' }}
        >
          <InputLabel>Dispatch</InputLabel>
          <Select
            value={dispatchFilter}
            onChange={(e) => setDispatchFilter(e.target.value)}
            label="Dispatch"
            className="mui-select"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Dispatched">Dispatched</MenuItem>
            <MenuItem value="Not Dispatched">Not Dispatched</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="services-table">
          <thead className="table-head">
            <tr>
              <th className="table-header-cell">Service ID</th>
              <th className="table-header-cell">Customer Name</th>
              <th className="table-header-cell">Model No</th>
              <th className="table-header-cell">Received Date</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Store Name</th>
              <th className="table-header-cell">Product Image</th>
              <th className="table-header-cell">Payment</th>
              <th className="table-header-cell">Dispatch</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentServices.length > 0 ? (
              currentServices.map((service) => (
                <tr key={service._id}>
                  <td className="table-cell" data-label="Service ID">
                    {service.serviceId}
                  </td>
                  <td className="table-cell" data-label="Customer Name">
                    {service.customerName}
                  </td>
                  <td className="table-cell" data-label="Model No">
                    {service.modelNo}
                  </td>
                  <td className="table-cell" data-label="Received Date">
                    {service.receivedDate ? new Date(service.receivedDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="table-cell" data-label="Status">
                    <span className={`status-badge status-${String(service.status || '').toLowerCase()}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="table-cell" data-label="Store Name">
                    {service.storeName}
                  </td>
                  <td className="table-cell" data-label="Product Image">
                    <img
                      src={`${FILE_HOST}/uploads/${service.productImage}`}
                      alt="Product"
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f8f8f8',
                      }}
                      onError={(e) => {
                        e.currentTarget.src = '/no-image.png';
                      }}
                    />
                  </td>
                  <td className="table-cell" data-label="Payment">
                    <button
                      className="btn btn-payment"
                      onClick={() => {
                        setSelectedService(service);
                        setShowPaymentDialog(true);
                      }}
                    >
                      <span className="btn-icon">₹</span> Add Payment
                    </button>
                  </td>
                  <td className="table-cell" data-label="Dispatch">
                    {service.status === 'PAYMENT_PROCESSED' && service.dispatchStatus !== 'Dispatched' ? (
                      <button className="btn btn-dispatch" onClick={() => handleDispatchOrder(service._id)}>
                        Dispatch Order
                      </button>
                    ) : (
                      <span className={`dispatch-status ${service.dispatchStatus === 'Dispatched' ? 'green' : ''}`}>
                        {service.dispatchStatus === 'Dispatched' ? 'Dispatched' : 'Not Dispatched'}
                      </span>
                    )}
                  </td>
                  <td className="table-cell" data-label="Actions">
                    <button
                      className="btn btn-view"
                      onClick={() => {
                        setSelectedService(service);
                        setShowDetailsDialog(true);
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
          color="primary"
          shape="rounded"
          className="mui-pagination"
        />
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && selectedService && (
        <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} className="mui-dialog">
          <DialogTitle>Add Payment Details</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: '16px' }}>
              <p>
                <strong>Service ID:</strong> {selectedService.serviceId}
              </p>
              <p>
                <strong>Customer:</strong> {selectedService.customerName}
              </p>
            </div>
            <TextField
              label="Payment Amount (₹)"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              fullWidth
              required
              className="mui-textfield"
            />
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setShowPaymentDialog(false)}>Cancel</MuiButton>
            <MuiButton onClick={handlePaymentSubmit} color="primary">
              Process Payment
            </MuiButton>
          </DialogActions>
        </Dialog>
      )}

      {/* Details Dialog */}
      {showDetailsDialog && selectedService && (
        <Dialog
          open={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          maxWidth="md"
          fullWidth
          className="mui-dialog"
        >
          <DialogTitle>Service Details - {selectedService.serviceId}</DialogTitle>
          <DialogContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <p>
                  <strong>Serial Number:</strong> {selectedService.serialNo}
                </p>
                <p>
                  <strong>Model Number:</strong> {selectedService.modelNo}
                </p>
                <p>
                  <strong>Warranty Status:</strong> {selectedService.warrantyStatus}
                </p>
                <p>
                  <strong>Received Date:</strong>{' '}
                  {selectedService.receivedDate ? new Date(selectedService.receivedDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p>
                  <strong>Customer Name:</strong> {selectedService.customerName}
                </p>
                <p>
                  <strong>Customer Phone:</strong> {selectedService.customerPhone}
                </p>
                <p>
                  <strong>Customer Address:</strong> {selectedService.customerAddress}
                </p>
                <p>
                  <strong>Problem Description:</strong> {selectedService.problemDescription}
                </p>
              </div>
              <div>
                <p>
                  <strong>Payment Amount:</strong> ₹ {selectedService.paymentAmount || 'Not Processed'}
                </p>
                <p>
                  <strong>Dispatch Status:</strong> {selectedService.dispatchStatus || 'Not Dispatched'}
                </p>
                <p>
                  <strong>Added By:</strong> {selectedService.createdBy || 'N/A'}
                </p>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <MuiButton onClick={() => setShowDetailsDialog(false)}>Close</MuiButton>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ServiceDashboard;
