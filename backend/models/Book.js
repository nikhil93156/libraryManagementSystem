const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true }, // Serves as "Director" if category is Movie
  serialNo: { type: String, required: true, unique: true },
  
  // 👇 This field matches the radio buttons in your frontend
  category: { 
    type: String, 
    enum: ['Book', 'Movie'], 
    required: true, 
    default: 'Book' 
  },
  
  available: { type: Boolean, default: true },
  addedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);