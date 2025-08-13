// models/CustomerModel.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    customerName: { type: String, required: true },
    gstNo: { type: String, required: true },
    address: { type: String },
    mailId: { type: String, required: true },
    phoneNo: { type: String, required: true },
    storeHandle: { type: String, required: true },
    status: { type: Boolean, default: false }, // false = Inactive, true = Active
    profilePicture: { type: String }, // stored file path: "uploads/12345.png"
  },
  { timestamps: true }
);

// Virtual field to expose "Active"/"Inactive"
customerSchema.virtual('statusText').get(function () {
  return this.status ? 'Active' : 'Inactive';
});

// Ensure virtuals appear in JSON/Object outputs
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Customer', customerSchema);
