import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Checkbox,
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
    Badge,
    Typography
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'notistack';

const Location = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({
        locationName: '',
        createdOn: new Date(),
        status: true,
    });
    const [editId, setEditId] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/locations');
            setLocations(response.data);
        } catch (error) {
            enqueueSnackbar('Error fetching locations!', { variant: 'error' });
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            locationName: '',
            createdOn: new Date(),
            status: true,
        });
        setEditId(null);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            createdOn: date,
        });
    };

    const handleSave = async () => {
        try {
            if (editId !== null) {
                await axios.put(`http://localhost:5000/api/locations/${editId}`, formData);
                enqueueSnackbar('Location updated successfully!', { variant: 'success' });
            } else {
                await axios.post('http://localhost:5000/api/locations', formData);
                enqueueSnackbar('Location added successfully!', { variant: 'success' });
            }
            fetchLocations();
            handleClose();
        } catch (error) {
            enqueueSnackbar('Error saving location!', { variant: 'error' });
        }
    };

    const handleEdit = (location) => {
        setFormData({
            locationName: location.locationName,
            createdOn: new Date(location.createdOn),
            status: location.status,
        });
        setEditId(location._id);
        setOpen(true);
    };

    const handleDeleteConfirmOpen = (id = null) => {
        setConfirmOpen(true);
        if (id) {
            setSelected([id]);
        }
    };

    const handleDeleteConfirmClose = () => {
        setConfirmOpen(false);
        setSelected([]);
    };

    const handleDelete = async () => {
        try {
            await Promise.all(
                selected.map((id) => axios.delete(`http://localhost:5000/api/locations/${id}`))
            );
            enqueueSnackbar('Location(s) deleted successfully!', { variant: 'success' });
            fetchLocations();
            handleDeleteConfirmClose();
        } catch (error) {
            enqueueSnackbar('Error deleting location(s)!', { variant: 'error' });
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = locations.map((location) => location._id);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    const filteredLocations = locations.filter((location) =>
        location.locationName.toLowerCase().includes(filterText.toLowerCase())
    );

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Location
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    placeholder="Search Locations"
                    value={filterText}
                    onChange={handleFilterChange}
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

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{editId !== null ? 'Edit Location' : 'Add Location'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="locationName"
                        label="Location Name"
                        fullWidth
                        value={formData.locationName}
                        onChange={handleFormChange}
                    />
                    <Box sx={{mt:3}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Created On"
                                value={formData.createdOn}
                                onChange={handleDateChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        margin="dense"
                                    />
                                )} sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Box>


                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                            />
                        }
                        label="Status"
                        sx={{ mt: 1 }}
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

            <Dialog open={confirmOpen} onClose={handleDeleteConfirmClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete the selected location ?</DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < locations.length}
                                    checked={locations.length > 0 && selected.length === locations.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell>Location Name</TableCell>
                            <TableCell>Created On</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLocations
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((location) => {
                                const isItemSelected = isSelected(location._id);
                                return (
                                    <TableRow
                                        key={location._id}
                                        hover
                                        onClick={(event) => handleClick(event, location._id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={isItemSelected} />
                                        </TableCell>
                                        <TableCell>{location.locationName}</TableCell>
                                        <TableCell>
                                            {new Date(location.createdOn).toISOString().split('T')[0]}
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    color: 'white',
                                                    backgroundColor: location.status ? '#4caf50' : '#f44336', // Green for Active, Red for Inactive
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    display: 'inline-block',
                                                    minWidth: '60px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {location.status ? 'Active' : 'Inactive'}
                                            </Box>
                                        </TableCell>


                                        <TableCell>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(location);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteConfirmOpen(location._id);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredLocations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Box>
    );
};

export default Location;
