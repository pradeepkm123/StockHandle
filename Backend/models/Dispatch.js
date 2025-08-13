const mongoose = require('mongoose');

const DispatchSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true }, 
  modelNo: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  salePerson: { type: String, required: true },
  barcodes: { type: [String], required: true },
  dispatchDate: { type: Date, default: Date.now },
  customerName: { type: String },
  customerAddress: { type: String },
  mailId: { type: String },
  storeName: { type: String},
  phoneNumber: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Dispatch', DispatchSchema);
