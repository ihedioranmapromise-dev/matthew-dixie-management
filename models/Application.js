const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tier: { type: String, enum: ['explorer', 'builder', 'master'], required: true },
  investmentPlan: { type: String, enum: ['catalyst', 'venture_builder', 'legacy', 'community', null], default: null },
  referralCode: { type: String },
  answers: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'under_review', 'invoice_sent', 'payment_verified', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: { type: String },
  invoiceDetails: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
