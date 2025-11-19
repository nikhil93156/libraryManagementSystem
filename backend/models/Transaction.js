const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Points to the logged-in user
  
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true }, // The promised return date (Max 15 days)
  
  // 👇 These fields are crucial for the Return/Fine logic
  actualReturnDate: { type: Date }, 
  fineAmount: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  remarks: { type: String },
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' }
});

module.exports = mongoose.model('Transaction', TransactionSchema);