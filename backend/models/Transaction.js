const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  issueDate: { type: Date, default: Date.now },
  returnDate: { type: Date },
  fine: { type: Number, default: 0 },
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
