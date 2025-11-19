const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  membershipId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['6 months', '1 year', '2 years'], default: '6 months' },
  status: { type: String, enum: ['Active', 'Cancelled'], default: 'Active' },
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true }
});

module.exports = mongoose.model('Member', MemberSchema);