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
//   Badge,
//   FormControlLabel,
// } from '@mui/material';
// import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { Switch } from '@mui/material';
// import { Typography } from '@mui/material';

// const SubCategoryManagement = () => {
//   const [subCategories, setSubCategories] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     createdOn: new Date(),
//     status: true,
//     image: null,
//   });
//   const [filterText, setFilterText] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     fetchSubCategories();
//   }, []);

//   const fetchSubCategories = async () => {
//     try {
//       const response = await fetch('https://stockhandle.onrender.com/api/subcategories');
//       const data = await response.json();
//       setSubCategories(data);
//     } catch (error) {
//       console.error('Error fetching subcategories:', error);
//     }
//   };

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedSubCategory(null);
//     setFormData({
//       name: '',
//       createdOn: new Date(),
//       status: true,
//       image: null,
//     });
//   };

//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleDateChange = (date) => {
//     setFormData({
//       ...formData,
//       createdOn: date,
//     });
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/tiff')) {
//       setFormData({
//         ...formData,
//         image: file,
//       });
//     }
//   };

//   const handleSave = async () => {
//     const formDataToSend = new FormData();
//     formDataToSend.append('name', formData.name);
//     formDataToSend.append('status', formData.status);
//     formDataToSend.append('createdOn', formData.createdOn.toISOString());

//     if (formData.image instanceof File) {
//       formDataToSend.append('image', formData.image);
//     }

//     try {
//       if (selectedSubCategory) {
//         const response = await fetch(`https://stockhandle.onrender.com/api/subcategories/${selectedSubCategory._id}`, {
//           method: 'PUT',
//           body: formDataToSend,
//         });
//         const data = await response.json();
//         setSubCategories(subCategories.map(subCategory => (subCategory._id === selectedSubCategory._id ? data : subCategory)));
//       } else {
//         const response = await fetch('https://stockhandle.onrender.com/api/subcategories', {
//           method: 'POST',
//           body: formDataToSend,
//         });
//         const data = await response.json();
//         setSubCategories([...subCategories, data]);
//       }
//       handleClose();
//     } catch (error) {
//       console.error('Error saving subcategory:', error);
//     }
//   };

//   const handleEdit = (subCategory) => {
//     setSelectedSubCategory(subCategory);
//     setFormData({
//       name: subCategory.name,
//       createdOn: new Date(subCategory.createdOn),
//       status: subCategory.status,
//       image: subCategory.image,
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`https://stockhandle.onrender.com/api/subcategories/${id}`, {
//         method: 'DELETE',
//       });
//       setSubCategories(subCategories.filter(subCategory => subCategory._id !== id));
//     } catch (error) {
//       console.error('Error deleting subcategory:', error);
//     }
//   };

//   const handleFilterChange = (event) => {
//     setFilterText(event.target.value);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const filteredSubCategories = subCategories.filter(subCategory =>
//     subCategory.name.toLowerCase().includes(filterText.toLowerCase())
//   );

//   const formatDate = (date) => {
//     if (!date) return '';
//     const parsedDate = new Date(date);
//     if (isNaN(parsedDate.getTime())) return '';
//     return parsedDate.toISOString().split('T')[0];
//   };

//   return (
//     <Box sx={{ padding: 2 }}>
//       <Typography variant="h4" gutterBottom>
//         Sub Category
//       </Typography>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, boxShadow: 3, p: 2 }}>
//         <TextField
//           label="Filter Sub Category"
//           variant="outlined"
//           value={filterText}
//           onChange={handleFilterChange}
//         />
//         <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
//           Add Sub Category
//         </Button>
//       </Box>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Sub Category Name</TableCell>
//               <TableCell>Created On</TableCell>
//               <TableCell>Sub Category Image</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredSubCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subCategory) => (
//               <TableRow key={subCategory._id}>
//                 <TableCell>{subCategory.name}</TableCell>
//                 <TableCell>{formatDate(subCategory.createdOn)}</TableCell>
//                 <TableCell>
//                   {subCategory.image && (
//                     <img
// <<<<<<< HEAD
//                       src={`https://stockhandle.onrender.com/${subCategory.image}`}
// =======
//                       src={`http://localhost:5000/${subCategory.image}`}
// >>>>>>> 31d76e31ea2ed9e2fc722a7f9133118915ac4b07
//                       alt="Sub Category"
//                       style={{ width: 50, height: 50, objectFit: 'cover' }}
//                     />
//                   )}
//                 </TableCell>
//                 <TableCell>
//                   <Badge
//                     color={subCategory.status ? 'success' : 'error'}
//                     badgeContent={subCategory.status ? 'Active' : 'Inactive'}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(subCategory)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(subCategory._id)}>
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
//           count={filteredSubCategories.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle>{selectedSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}</DialogTitle>
//         <DialogContent>
//           <TextField
//             margin="dense"
//             name="name"
//             label="Sub Category Name"
//             fullWidth
//             value={formData.name}
//             onChange={handleFormChange}
//           />
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Created On"
//               value={formData.createdOn}
//               onChange={handleDateChange}
//               slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
//             />
//           </LocalizationProvider>
//           <FormControlLabel
//             control={
//               <Switch
//                 name="status"
//                 checked={formData.status}
//                 onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
//               />
//             }
//             label="Status"
//           />
//           <Box sx={{ mt: 2 }}>
//             <Button
//               variant="contained"
//               component="label"
//               startIcon={<CloudUploadIcon />}
//               fullWidth
//             >
//               Upload Image
//               <input
//                 type="file"
//                 hidden
//                 accept="image/png, image/jpeg, image/tiff"
//                 onChange={handleImageUpload}
//               />
//             </Button>
//             {formData.image && (
//               <Box sx={{ mt: 2, textAlign: 'center' }}>
//                 <img
//                   src={formData.image instanceof File ? URL.createObjectURL(formData.image) : `https://stockhandle.onrender.com/${formData.image}`}
//                   alt="Preview"
//                   style={{ maxWidth: '100%', height: 'auto' }}
//                 />
//               </Box>
//             )}
//           </Box>
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
//     </Box>
//   );
// };

// export default SubCategoryManagement;

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
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
  Chip,
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
} from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const API_BASE = 'https://stockhandle-taxr.onrender.com';

const SubCategoryManagement = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    createdOn: new Date(),
    status: true,
    image: null, // File OR string path
  });

  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/subcategories`);
      const data = await res.json();
      setSubCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setSelectedSubCategory(null);
    setFormData({
      name: '',
      createdOn: new Date(),
      status: true,
      image: null,
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((p) => ({ ...p, createdOn: date || new Date() }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const okTypes = ['image/png', 'image/jpeg', 'image/tiff'];
    if (okTypes.includes(file.type)) {
      setFormData((p) => ({ ...p, image: file }));
    }
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('status', String(formData.status));
    formDataToSend.append('createdOn', (formData.createdOn || new Date()).toISOString());

    if (formData.image instanceof File) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (selectedSubCategory?._id) {
        const res = await fetch(`${API_BASE}/api/subcategories/${selectedSubCategory._id}`, {
          method: 'PUT',
          body: formDataToSend,
        });
        const updated = await res.json();
        setSubCategories((prev) =>
          prev.map((s) => (s._id === selectedSubCategory._id ? updated : s))
        );
      } else {
        const res = await fetch(`${API_BASE}/api/subcategories`, {
          method: 'POST',
          body: formDataToSend,
        });
        const created = await res.json();
        setSubCategories((prev) => [...prev, created]);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  const handleEdit = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setFormData({
      name: subCategory?.name || '',
      createdOn: subCategory?.createdOn ? new Date(subCategory.createdOn) : new Date(),
      status: Boolean(subCategory?.status),
      image: subCategory?.image || null,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/api/subcategories/${id}`, { method: 'DELETE' });
      setSubCategories((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleFilterChange = (event) => setFilterText(event.target.value);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredSubCategories = useMemo(() => {
    const q = (filterText || '').toLowerCase();
    return (subCategories || []).filter((s) => (s?.name || '').toLowerCase().includes(q));
  }, [subCategories, filterText]);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const imgSrcFor = (image) => {
    if (!image) return '';
    if (image instanceof File) return URL.createObjectURL(image);
    // backend returns path like "uploads/xxx.png" or "/uploads/xxx.png"
    const cleaned = String(image).startsWith('/') ? String(image) : `/${image}`;
    return `${API_BASE}${cleaned}`;
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Sub Category
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          boxShadow: 3,
          p: 2,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Filter Sub Category"
          variant="outlined"
          value={filterText}
          onChange={handleFilterChange}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Sub Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sub Category Name</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Sub Category Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredSubCategories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((subCategory) => (
                <TableRow key={subCategory._id}>
                  <TableCell>{subCategory.name}</TableCell>
                  <TableCell>{formatDate(subCategory.createdOn)}</TableCell>

                  <TableCell>
                    {subCategory.image ? (
                      <img
                        src={imgSrcFor(subCategory.image)}   // ✅ single src (no duplicate props)
                        alt="Sub Category"
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={subCategory.status ? 'Active' : 'Inactive'}
                      color={subCategory.status ? 'success' : 'error'}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleEdit(subCategory)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(subCategory._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {filteredSubCategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No subcategories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSubCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Sub Category Name"
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
                onChange={(e) => setFormData((p) => ({ ...p, status: e.target.checked }))}
              />
            }
            label="Status"
          />

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} fullWidth>
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
                  src={imgSrcFor(formData.image)}
                  alt="Preview"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
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

export default SubCategoryManagement;
