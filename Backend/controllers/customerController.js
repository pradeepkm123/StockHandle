// controllers/customerController.js
const Customer = require('../models/CustomerModel');
const multer = require('multer');
const path = require('path');

// ---------- Multer Configuration ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------- Helpers ----------
/** Normalize incoming status to Boolean */
function normalizeStatus(input) {
  if (typeof input === 'boolean') return input;
  if (typeof input === 'string') {
    const v = input.trim().toLowerCase();
    if (['active', 'true', '1', 'yes'].includes(v)) return true;
    if (['inactive', 'false', '0', 'no'].includes(v)) return false;
  }
  return false; // default if omitted/unknown
}

/** Build DTO with statusText + profilePictureUrl */
function toDTO(doc, req) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    statusText: obj.status ? 'Active' : 'Inactive',
    profilePictureUrl: obj.profilePicture
      ? `${req.protocol}://${req.get('host')}/${obj.profilePicture.replace(/\\/g, '/')}`
      : null,
  };
}

// ---------- Controllers ----------

// Get all customers
// controllers/customerController.js
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    const result = customers.map(c => ({
      ...c.toObject(),
      status: c.status ? 'Active' : 'Inactive', // ✅ Convert boolean to text
    }));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
  }
};


// Get one customer
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(toDTO(customer, req));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customer', error: error.message });
  }
};

// Create new customer
exports.createCustomer = [
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      const customerData = { ...req.body };

      // Normalize status if provided (accepts "Active"/"Inactive" or boolean-like)
      if (customerData.status !== undefined) {
        customerData.status = normalizeStatus(customerData.status);
      }

      // Attach file path if uploaded
      if (req.file) {
        customerData.profilePicture = `uploads/${req.file.filename}`;
      }

      const newCustomer = new Customer(customerData);
      await newCustomer.save();

      res.status(201).json(toDTO(newCustomer, req));
    } catch (error) {
      res.status(400).json({ message: 'Failed to create customer', error: error.message });
    }
  },
];

// Update customer
exports.updateCustomer = [
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      const customerData = { ...req.body };

      // Normalize status (if sent)
      if (customerData.status !== undefined) {
        customerData.status = normalizeStatus(customerData.status);
      }

      // New profile picture (if uploaded)
      if (req.file) {
        customerData.profilePicture = `uploads/${req.file.filename}`;
      }

      const updatedCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        customerData,
        { new: true }
      );

      if (!updatedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json(toDTO(updatedCustomer, req));
    } catch (error) {
      res.status(400).json({ message: 'Failed to update customer', error: error.message });
    }
  },
];

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete customer', error: error.message });
  }
};
