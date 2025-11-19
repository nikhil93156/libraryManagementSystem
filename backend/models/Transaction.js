const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who issued it
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true }, // Promised return date
  actualReturnDate: { type: Date },
  fineAmount: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  remarks: { type: String }
});

module.exports = mongoose.model('Transaction', TransactionSchema);