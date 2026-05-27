// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   InputAdornment,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   FormControlLabel,
//   Switch,
//   Typography
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Save as SaveIcon,
//   Cancel as CancelIcon,
//   Search as SearchIcon,
// } from '@mui/icons-material';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { useSnackbar } from 'notistack';
// import Select from 'react-select';

// const Location = () => {
//   const { enqueueSnackbar } = useSnackbar();

//   const [open, setOpen] = useState(false);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [selected, setSelected] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [warehouses, setWarehouses] = useState([]);
//   const [editId, setEditId] = useState(null);

//   const [formData, setFormData] = useState({
//     locationName: '',
//     warehouse: null,
//     createdOn: new Date(),
//     status: true,
//   });

//   const [filterText, setFilterText] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // ================= FETCH FUNCTIONS =================

//   const fetchLocations = useCallback(async () => {
//     try {
//       const res = await axios.get('https://stockhandle.onrender.com/api/locations');
//       setLocations(res.data);
//     } catch {
//       enqueueSnackbar('Error fetching locations!', { variant: 'error' });
//     }
//   }, [enqueueSnackbar]);

//   const fetchWarehouses = useCallback(async () => {
//     try {
//       const res = await axios.get('https://stockhandle.onrender.com/api/warehouses');
//       setWarehouses(res.data);
//     } catch {
//       enqueueSnackbar('Error fetching warehouses!', { variant: 'error' });
//     }
//   }, [enqueueSnackbar]);

//   // ================= USE EFFECT =================

//   useEffect(() => {
//     fetchLocations();
//     fetchWarehouses();
//   }, [fetchLocations, fetchWarehouses]);

//   // ================= HANDLERS =================

//   const handleOpen = () => {
//     setOpen(true);
//     fetchWarehouses();
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setEditId(null);
//     setFormData({
//       locationName: '',
//       warehouse: null,
//       createdOn: new Date(),
//       status: true,
//     });
//   };

//   const handleSave = async () => {
//     try {
//       const payload = {
//         locationName: formData.locationName,
//         warehouseId: formData.warehouse?._id,
//         createdOn: formData.createdOn,
//         status: formData.status,
//       };

//       if (editId) {
//         await axios.put(`https://stockhandle.onrender.com/api/locations/${editId}`, payload);
//         enqueueSnackbar('Location updated successfully!', { variant: 'success' });
//       } else {
//         await axios.post('https://stockhandle.onrender.com/api/locations', payload);
//         enqueueSnackbar('Location added successfully!', { variant: 'success' });
//       }

//       fetchLocations();
//       handleClose();
//     } catch {
//       enqueueSnackbar('Error saving location!', { variant: 'error' });
//     }
//   };

//   const handleEdit = (location) => {
//     const wh = warehouses.find(w => w._id === location.warehouseId);
//     setFormData({
//       locationName: location.locationName,
//       warehouse: wh || null,
//       createdOn: new Date(location.createdOn),
//       status: location.status,
//     });
//     setEditId(location._id);
//     setOpen(true);
//   };

//   const handleDelete = async () => {
//     try {
//       await Promise.all(
//         selected.map(id =>
//           axios.delete(`https://stockhandle.onrender.com/api/locations/${id}`)
//         )
//       );
//       enqueueSnackbar('Location(s) deleted!', { variant: 'success' });
//       fetchLocations();
//       setConfirmOpen(false);
//       setSelected([]);
//     } catch {
//       enqueueSnackbar('Delete failed!', { variant: 'error' });
//     }
//   };

//   const filteredLocations = locations.filter(l =>
//     l.locationName.toLowerCase().includes(filterText.toLowerCase())
//   );

//   const warehouseOptions = warehouses.map(w => ({
//     value: w._id,
//     label: w.warehouse,
//     ...w
//   }));

//   // ================= UI =================

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h4" sx={{ mb: 3 }}>
//         Location
//       </Typography>

//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//         <TextField
//           placeholder="Search location"
//           value={filterText}
//           onChange={(e) => setFilterText(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
//           Add Location
//         </Button>
//       </Box>

//       {/* TABLE */}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Location</TableCell>
//               <TableCell>Warehouse</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredLocations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map(loc => (
//                 <TableRow key={loc._id}>
//                   <TableCell>{loc.locationName}</TableCell>
//                   <TableCell>
//                     {warehouses.find(w => w._id === loc.warehouseId)?.warehouse || 'N/A'}
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{
//                       bgcolor: loc.status ? 'green' : 'red',
//                       color: '#fff',
//                       px: 1,
//                       borderRadius: 1,
//                       display: 'inline-block'
//                     }}>
//                       {loc.status ? 'Active' : 'Inactive'}
//                     </Box>
//                   </TableCell>
//                   <TableCell align="right">
//                     <IconButton onClick={() => handleEdit(loc)}>
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton onClick={() => {
//                       setSelected([loc._id]);
//                       setConfirmOpen(true);
//                     }}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>

//         <TablePagination
//           component="div"
//           count={filteredLocations.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={(e, p) => setPage(p)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       </TableContainer>

//       {/* ADD / EDIT DIALOG */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle>{editId ? 'Edit Location' : 'Add Location'}</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             label="Location Name"
//             sx={{ mt: 2 }}
//             value={formData.locationName}
//             onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
//           />

//           <Box sx={{ mt: 2 }}>
//             <Select
//               options={warehouseOptions}
//               value={formData.warehouse ? {
//                 value: formData.warehouse._id,
//                 label: formData.warehouse.warehouse
//               } : null}
//               onChange={(opt) => setFormData({ ...formData, warehouse: opt })}
//               placeholder="Select Warehouse"
//             />
//           </Box>

//           <FormControlLabel
//             sx={{ mt: 2 }}
//             control={
//               <Switch
//                 checked={formData.status}
//                 onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
//               />
//             }
//             label="Active"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button startIcon={<CancelIcon />} onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button startIcon={<SaveIcon />} onClick={handleSave}>
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* DELETE CONFIRM */}
//       <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogActions>
//           <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
//           <Button color="error" onClick={handleDelete}>Delete</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Location;




import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
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
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Select from 'react-select';

// ✅ Use these since we are showing Created On picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const API_BASE = 'https://stockhandle-taxr.onrender.com/api';

const Location = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selected, setSelected] = useState([]);
  const [locations, setLocations] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    locationName: '',
    warehouse: null,
    createdOn: new Date(),
    status: true,
  });

  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ================= FETCH FUNCTIONS =================

  const fetchLocations = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/locations`);
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch {
      enqueueSnackbar('Error fetching locations!', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const fetchWarehouses = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/warehouses`);
      setWarehouses(Array.isArray(res.data) ? res.data : []);
    } catch {
      enqueueSnackbar('Error fetching warehouses!', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  // ================= USE EFFECT =================

  useEffect(() => {
    fetchLocations();
    fetchWarehouses();
  }, [fetchLocations, fetchWarehouses]);

  // ================= HANDLERS =================

  const handleOpen = () => {
    setOpen(true);
    fetchWarehouses();
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setFormData({
      locationName: '',
      warehouse: null,
      createdOn: new Date(),
      status: true,
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.locationName?.trim()) {
        enqueueSnackbar('Location name is required!', { variant: 'warning' });
        return;
      }
      if (!formData.warehouse?._id) {
        enqueueSnackbar('Please select warehouse!', { variant: 'warning' });
        return;
      }

      const payload = {
        locationName: formData.locationName.trim(),
        warehouseId: formData.warehouse._id,
        createdOn: formData.createdOn,
        status: formData.status,
      };

      if (editId) {
        await axios.put(`${API_BASE}/locations/${editId}`, payload);
        enqueueSnackbar('Location updated successfully!', { variant: 'success' });
      } else {
        await axios.post(`${API_BASE}/locations`, payload);
        enqueueSnackbar('Location added successfully!', { variant: 'success' });
      }

      await fetchLocations();
      handleClose();
    } catch {
      enqueueSnackbar('Error saving location!', { variant: 'error' });
    }
  };

  const handleEdit = (location) => {
    const wh = warehouses.find((w) => w._id === location.warehouseId) || null;

    setFormData({
      locationName: location.locationName || '',
      warehouse: wh,
      createdOn: location.createdOn ? new Date(location.createdOn) : new Date(),
      status: !!location.status,
    });

    setEditId(location._id);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selected.map((id) => axios.delete(`${API_BASE}/locations/${id}`))
      );
      enqueueSnackbar('Location(s) deleted!', { variant: 'success' });

      await fetchLocations();
      setConfirmOpen(false);
      setSelected([]);
    } catch {
      enqueueSnackbar('Delete failed!', { variant: 'error' });
    }
  };

  const filteredLocations = locations.filter((l) =>
    (l.locationName || '').toLowerCase().includes(filterText.toLowerCase())
  );

  const warehouseOptions = warehouses.map((w) => ({
    value: w._id,
    label: w.warehouse,
    ...w,
  }));

  // ================= UI =================

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Location
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search location"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Location
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredLocations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((loc) => (
                <TableRow key={loc._id}>
                  <TableCell>{loc.locationName}</TableCell>
                  <TableCell>
                    {warehouses.find((w) => w._id === loc.warehouseId)?.warehouse || 'N/A'}
                  </TableCell>

                  <TableCell>
                    {loc.createdOn ? new Date(loc.createdOn).toLocaleDateString() : '—'}
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        bgcolor: loc.status ? 'green' : 'red',
                        color: '#fff',
                        px: 1,
                        borderRadius: 1,
                        display: 'inline-block',
                        fontSize: 12,
                      }}
                    >
                      {loc.status ? 'Active' : 'Inactive'}
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(loc)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelected([loc._id]);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {filteredLocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No locations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredLocations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* ADD / EDIT DIALOG */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Edit Location' : 'Add Location'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Location Name"
            sx={{ mt: 2 }}
            value={formData.locationName}
            onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
          />

          <Box sx={{ mt: 2 }}>
            <Select
              options={warehouseOptions}
              value={
                formData.warehouse
                  ? { value: formData.warehouse._id, label: formData.warehouse.warehouse }
                  : null
              }
              onChange={(opt) => setFormData({ ...formData, warehouse: opt })}
              placeholder="Select Warehouse"
            />
          </Box>

          {/* ✅ Created On DatePicker */}
          <Box sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Created On"
                value={formData.createdOn}
                onChange={(newDate) => setFormData({ ...formData, createdOn: newDate || new Date() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>

          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Switch
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              />
            }
            label="Active"
          />
        </DialogContent>

        <DialogActions>
          <Button startIcon={<CancelIcon />} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Location;
