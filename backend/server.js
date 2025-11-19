require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
console.log("Loaded MONGO_URI:", MONGO_URI);
mongoose.connect(MONGO_URI)
  .then(()=>console.log('MongoDB connected'))
  .catch(err=>console.error('MongoDB error:', err));

// routes
app.use('/auth', require('./routes/auth'));
app.use('/books', require('./routes/books'));
app.use('/transactions', require('./routes/transactions'));
app.use('/maintenance', require('./routes/maintenance'));
app.use('/reports', require('./routes/reports')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
