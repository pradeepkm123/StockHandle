// models/StoreInward.js
const mongoose = require('mongoose');

const StoreInwardSchema = new mongoose.Schema({
  modelNo: { type: String, required: true },
  quantity: { type: Number, required: true },
  scanningCode: { type: String, default: '' },
  scannedBarcode: {
    type: [String],
    default: [],
    required: true
  },
  userId: { type: String, required: true },
  storeName: { type: String, required: true },
  brand: { type: String, default: '' },
  dealerPrice: { type: Number, default: 0 },
  mrp: { type: Number, default: 0 },
  model: { type: String, default: '' },
  subCategory: { type: String, default: '' },
  category: { type: String, default: '' },
  currentStock: { type: Number, default: 0 },
  pricePerUnit: { type: Number, default: 0 },
  salePerson: { type: String, default: '' },
  owner: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StoreInward', StoreInwardSchema);
