const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  modelNo: { type: String, required: true },
  location: { type: String, required: true },
  quantity: { type: Number, required: true },
  shd: { type: String },
  scannedCodes: { type: String, required: true },
  brand: { type: String, required: true },
  dealerPrice: { type: Number, required: true }, // ✅ FIXED from String to Number
  mrp: { type: Number, required: true },         // ✅ ADDED mrp field
  model: { type: String, required: true },
  subCategory: { type: String, required: true },
  category: { type: String, required: true },
  currentStock: { type: Number, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', InventorySchema);
