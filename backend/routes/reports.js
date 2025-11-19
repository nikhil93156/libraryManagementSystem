const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');

// 1. Master List of Books
router.get('/master-books', async (req, res) => {
  try {
    const books = await Book.find({ category: 'Book' });
    res.json(books);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. Master List of Movies
router.get('/master-movies', async (req, res) => {
  try {
    const movies = await Book.find({ category: 'Movie' });
    res.json(movies);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. Master List of Memberships
router.get('/master-members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 4. Active Issues (Books currently out)
router.get('/active-issues', async (req, res) => {
  try {
    const issues = await Transaction.find({ actualReturnDate: null })
      .populate('bookId')
      .populate('userId'); // or memberId depending on your schema
    res.json(issues);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 5. Overdue Returns (Due date passed)
router.get('/overdue-returns', async (req, res) => {
  try {
    const today = new Date();
    const overdue = await Transaction.find({ 
      actualReturnDate: null,
      returnDate: { $lt: today } 
    }).populate('bookId').populate('userId');
    res.json(overdue);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;