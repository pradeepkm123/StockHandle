import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TablePagination,
} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Invoice() {
  const [dispatches, setDispatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDispatches = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dispatch');
        setDispatches(response.data);
      } catch (error) {
        console.error('Error fetching dispatches:', error);
      }
    };
    fetchDispatches();
  }, []);

  const handleView = (id) => {
    navigate(`/invoicedetails/${id}`);
  };

  const handleDelete = async (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/dispatch/${selectedId}`);
      setDispatches(dispatches.filter(dispatch => dispatch._id !== selectedId));
    } catch (error) {
      console.error('Error deleting dispatch:', error);
    }
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Box sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Invoices
        </Typography>
        <Typography variant="p">
          Manage your stock invoices
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice No</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Sales Person</TableCell>
              <TableCell>Barcode Scanned</TableCell>
              <TableCell>Dispatch Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dispatches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dispatch) => (
              <TableRow key={dispatch._id}>
                <TableCell>{dispatch.invoiceNumber}</TableCell>
                <TableCell>{dispatch.customerName}</TableCell>
                <TableCell>{dispatch.price}</TableCell>
                <TableCell>{dispatch.quantity}</TableCell>
                <TableCell>{dispatch.salePerson}</TableCell>
                <TableCell>{dispatch.barcodes.join(', ')}</TableCell>
                <TableCell>{new Date(dispatch.dispatchDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(dispatch._id)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(dispatch._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dispatches.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Invoice;
