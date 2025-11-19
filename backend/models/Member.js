const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  membershipId: { type: String, required: true, unique: true },
  
  // 👇 Stores "6 months", "1 year", etc.
  type: { 
    type: String, 
    enum: ['6 months', '1 year', '2 years'], 
    required: true 
  },
  
  // 👇 Calculated by the backend before saving
  expiryDate: { type: Date, required: true },
  
  status: { type: String, enum: ['Active', 'Cancelled'], default: 'Active' },
  startDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);