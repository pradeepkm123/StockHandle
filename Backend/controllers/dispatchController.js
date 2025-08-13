const Dispatch = require('../models/Dispatch');
const Product = require('../models/Product');
const { generateInvoiceNumber } = require('../utils/invoiceUtils');

// Create a new dispatch
exports.createDispatch = async (req, res) => {
  try {
    const {
      modelNo,
      quantity,
      price,
      salePerson,
      barcodes,
      dispatchDate,
      customerName,
      storeName,
      customerAddress,
      mailId,
      phoneNumber
    } = req.body;

    const invoiceNumber = await generateInvoiceNumber(); // ✅ FIXED

    const newDispatch = new Dispatch({
      invoiceNumber,
      modelNo,
      quantity,
      price,
      salePerson,
      barcodes,
      storeName,
      dispatchDate,
      customerName,
      customerAddress,
      mailId,
      phoneNumber
    });

    await newDispatch.save();

    // Reduce stock
    const product = await Product.findOne({ model: modelNo });
    if (!product) {
      return res.status(404).json({ message: 'Product not found for model: ' + modelNo });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock for dispatch' });
    }

    product.quantity -= quantity;
    await product.save();

    res.status(201).json({
      message: 'Dispatch created and product stock updated',
      dispatch: newDispatch
    });
  } catch (error) {
    console.error('Dispatch Error:', error.message);
    res.status(500).json({ message: 'Failed to create dispatch', error: error.message });
  }
};

// Get all dispatch records
exports.getDispatches = async (req, res) => {
  try {
    const dispatches = await Dispatch.find().sort({ createdAt: -1 });
    res.json(dispatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single dispatch by ID
exports.getDispatchById = async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id);
    if (!dispatch) {
      return res.status(404).json({ message: 'Dispatch not found' });
    }
    res.json(dispatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a dispatch
exports.updateDispatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedDispatch = await Dispatch.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDispatch) {
      return res.status(404).json({ message: 'Dispatch not found' });
    }
    res.json(updatedDispatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a dispatch
exports.deleteDispatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDispatch = await Dispatch.findByIdAndDelete(id);
    if (!deletedDispatch) {
      return res.status(404).json({ message: 'Dispatch not found' });
    }
    res.json({ message: 'Dispatch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In your dispatch controller
exports.getDispatches = async (req, res) => {
  try {
    const { storeName } = req.query;
    const filter = storeName ? { storeName } : {};
    const data = await Dispatch.find(filter);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
