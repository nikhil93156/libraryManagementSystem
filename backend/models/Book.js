const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true }, // Serves as Author or Director
  serialNo: { type: String, required: true, unique: true },
  category: { type: String, enum: ['Book', 'Movie'], default: 'Book' },
  available: { type: Boolean, default: true },
  addedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);