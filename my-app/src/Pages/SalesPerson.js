// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
// } from '@mui/material';
// import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
// import { useSnackbar } from 'notistack';
// import { Typography } from '@mui/material';
// import axios from 'axios';

// const SalesPerson = () => {
//   const { enqueueSnackbar } = useSnackbar();
//   const [open, setOpen] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [salesPersons, setSalesPersons] = useState([]);
//   const [formData, setFormData] = useState({
//     employeeName: '',
//     employeeId: '',
//     location: '',
//     mobileNo: '',
//   });
//   const [editIndex, setEditIndex] = useState(null);
//   const [deleteIndex, setDeleteIndex] = useState(null);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     fetchSalesPersons();
//   }, []);

//   const fetchSalesPersons = async () => {
//     try {
//       const response = await axios.get('https://stockhandle.onrender.com/api/salesPersons');
//       setSalesPersons(response.data);
//     } catch (error) {
//       console.error('Error fetching sales persons:', error);
//       enqueueSnackbar('Error fetching sales persons!', { variant: 'error' });
//     }
//   };

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setFormData({
//       employeeName: '',
//       employeeId: '',
//       location: '',
//       mobileNo: '',
//     });
//     setEditIndex(null);
//   };

//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSave = async () => {
//     try {
//       if (editIndex !== null) {
//         // Update existing sales person
//         await axios.put(`https://stockhandle.onrender.com/api/salesPersons/${salesPersons[editIndex]._id}`, formData);
//         enqueueSnackbar('Sales person updated successfully!', { variant: 'success' });
//       } else {
//         // Add new sales person
//         await axios.post('https://stockhandle.onrender.com/api/salesPersons', formData);
//         enqueueSnackbar('Sales person added successfully!', { variant: 'success' });
//       }
//       fetchSalesPersons();
//       handleClose();
//     } catch (error) {
//       console.error('Error saving sales person:', error);
//       enqueueSnackbar('Error saving sales person!', { variant: 'error' });
//     }
//   };

//   const handleEdit = (index) => {
//     const salesPerson = salesPersons[index];
//     setFormData({
//       employeeName: salesPerson.employeeName,
//       employeeId: salesPerson.employeeId,
//       location: salesPerson.location,
//       mobileNo: salesPerson.mobileNo,
//     });
//     setEditIndex(index);
//     setOpen(true);
//   };

//   const handleDeleteConfirmOpen = (index) => {
//     setDeleteIndex(index);
//     setConfirmOpen(true);
//   };

//   const handleDeleteConfirmClose = () => {
//     setConfirmOpen(false);
//     setDeleteIndex(null);
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`https://stockhandle.onrender.com/api/salesPersons/${salesPersons[deleteIndex]._id}`);
//       enqueueSnackbar('Sales person deleted successfully!', { variant: 'success' });
//       fetchSalesPersons();
//       handleDeleteConfirmClose();
//     } catch (error) {
//       console.error('Error deleting sales person:', error);
//       enqueueSnackbar('Error deleting sales person!', { variant: 'error' });
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <Box sx={{ padding: 2 }}>
//       <Typography variant="h4" gutterBottom>
//         Sales Person Details
//       </Typography>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, boxShadow: 3, p: 2 }}>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <TextField label="Filter Employee Name" variant="outlined" />
//           <TextField label="Filter Location" variant="outlined" />
//         </Box>
//         <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
//           Add Employee
//         </Button>
//       </Box>

//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle>{editIndex !== null ? 'Edit Sales Person' : 'Add Sales Person'}</DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             name="employeeName"
//             label="Employee Name"
//             fullWidth
//             value={formData.employeeName}
//             onChange={handleFormChange}
//           />
//           <TextField
//             margin="dense"
//             name="employeeId"
//             label="Employee ID"
//             fullWidth
//             value={formData.employeeId}
//             onChange={handleFormChange}
//           />
//           <TextField
//             margin="dense"
//             name="location"
//             label="Location"
//             fullWidth
//             value={formData.location}
//             onChange={handleFormChange}
//           />
//           <TextField
//             margin="dense"
//             name="mobileNo"
//             label="Mobile No"
//             fullWidth
//             value={formData.mobileNo}
//             onChange={handleFormChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary" startIcon={<CancelIcon />}>
//             Cancel
//           </Button>
//           <Button onClick={handleSave} color="primary" startIcon={<SaveIcon />}>
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={confirmOpen}
//         onClose={handleDeleteConfirmClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
//         <DialogContent id="alert-dialog-description">
//           Are you sure you want to delete this sales person?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDeleteConfirmClose} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} color="primary" autoFocus>
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Checkbox />
//               </TableCell>
//               <TableCell>ID</TableCell>
//               <TableCell>Employee Name</TableCell>
//               <TableCell>Employee ID</TableCell>
//               <TableCell>Location</TableCell>
//               <TableCell>Mobile No</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {salesPersons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((salesPerson, index) => (
//               <TableRow key={salesPerson._id}>
//                 <TableCell padding="checkbox">
//                   <Checkbox />
//                 </TableCell>
//                 <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                 <TableCell>{salesPerson.employeeName}</TableCell>
//                 <TableCell>{salesPerson.employeeId}</TableCell>
//                 <TableCell>{salesPerson.location}</TableCell>
//                 <TableCell>{salesPerson.mobileNo}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(index)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDeleteConfirmOpen(index)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={salesPersons.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>
//     </Box>
//   );
// };

// export default SalesPerson;











// src/Pages/SalesPerson.js
import React, { useState, useEffect, useCallback } from 'react';
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
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const API_BASE = 'https://stockhandle-taxr.onrender.com/api/salesPersons';

const emptyForm = {
  employeeName: '',
  employeeId: '',
  location: '',
  mobileNo: '',
};

const SalesPerson = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [salesPersons, setSalesPersons] = useState([]);

  const [formData, setFormData] = useState(emptyForm);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filters (optional UI fields you already have)
  const [filterEmployeeName, setFilterEmployeeName] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const fetchSalesPersons = useCallback(async () => {
    try {
      const response = await axios.get(API_BASE);
      setSalesPersons(response.data || []);
    } catch (error) {
      console.error('Error fetching sales persons:', error);
      enqueueSnackbar('Error fetching sales persons!', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchSalesPersons();
  }, [fetchSalesPersons]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(emptyForm);
    setEditIndex(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Basic validation (optional but useful)
      if (!formData.employeeName?.trim()) {
        enqueueSnackbar('Employee Name is required!', { variant: 'warning' });
        return;
      }

      if (editIndex !== null) {
        const id = salesPersons?.[editIndex]?._id;
        if (!id) {
          enqueueSnackbar('Unable to update: invalid record selected.', { variant: 'error' });
          return;
        }
        await axios.put(`${API_BASE}/${id}`, formData);
        enqueueSnackbar('Sales person updated successfully!', { variant: 'success' });
      } else {
        await axios.post(API_BASE, formData);
        enqueueSnackbar('Sales person added successfully!', { variant: 'success' });
      }

      await fetchSalesPersons();
      handleClose();
    } catch (error) {
      console.error('Error saving sales person:', error);
      enqueueSnackbar('Error saving sales person!', { variant: 'error' });
    }
  };

  const handleEdit = (indexOnPage) => {
    // IMPORTANT: convert page index -> absolute index
    const absoluteIndex = page * rowsPerPage + indexOnPage;
    const salesPerson = salesPersons[absoluteIndex];

    if (!salesPerson) return;

    setFormData({
      employeeName: salesPerson.employeeName || '',
      employeeId: salesPerson.employeeId || '',
      location: salesPerson.location || '',
      mobileNo: salesPerson.mobileNo || '',
    });
    setEditIndex(absoluteIndex);
    setOpen(true);
  };

  const handleDeleteConfirmOpen = (indexOnPage) => {
    const absoluteIndex = page * rowsPerPage + indexOnPage;
    setDeleteIndex(absoluteIndex);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  const handleDelete = async () => {
    try {
      const id = salesPersons?.[deleteIndex]?._id;
      if (!id) {
        enqueueSnackbar('Unable to delete: invalid record selected.', { variant: 'error' });
        return;
      }

      await axios.delete(`${API_BASE}/${id}`);
      enqueueSnackbar('Sales person deleted successfully!', { variant: 'success' });

      await fetchSalesPersons();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting sales person:', error);
      enqueueSnackbar('Error deleting sales person!', { variant: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Apply client-side filters
  const filteredSalesPersons = salesPersons.filter((sp) => {
    const nameOk = (sp.employeeName || '')
      .toLowerCase()
      .includes(filterEmployeeName.trim().toLowerCase());

    const locOk = (sp.location || '')
      .toLowerCase()
      .includes(filterLocation.trim().toLowerCase());

    return nameOk && locOk;
  });

  const paginated = filteredSalesPersons.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Optional: if filters reduce total rows, ensure current page is valid
  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredSalesPersons.length / rowsPerPage) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [filteredSalesPersons.length, rowsPerPage, page]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Sales Person Details
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, boxShadow: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Filter Employee Name"
            variant="outlined"
            value={filterEmployeeName}
            onChange={(e) => setFilterEmployeeName(e.target.value)}
          />
          <TextField
            label="Filter Location"
            variant="outlined"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Employee
        </Button>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? 'Edit Sales Person' : 'Add Sales Person'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="employeeName"
            label="Employee Name"
            fullWidth
            value={formData.employeeName}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="employeeId"
            label="Employee ID"
            fullWidth
            value={formData.employeeId}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="mobileNo"
            label="Mobile No"
            fullWidth
            value={formData.mobileNo}
            onChange={handleFormChange}
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

      {/* Delete Confirm Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent id="alert-dialog-description">
          Are you sure you want to delete this sales person?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((salesPerson, index) => (
              <TableRow key={salesPerson._id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>

                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>{salesPerson.employeeName}</TableCell>
                <TableCell>{salesPerson.employeeId}</TableCell>
                <TableCell>{salesPerson.location}</TableCell>
                <TableCell>{salesPerson.mobileNo}</TableCell>

                <TableCell>
                  <IconButton onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteConfirmOpen(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSalesPersons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default SalesPerson;
