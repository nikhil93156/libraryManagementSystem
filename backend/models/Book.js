const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  category: String,
  copies: { type: Number, default: 1 },
  available: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
