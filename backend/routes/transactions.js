const express = require('express');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Issue book
router.post('/issue', protect, async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.available < 1) return res.status(400).json({ message: 'Book not available' });
    book.available -= 1;
    await book.save();
    const tx = await Transaction.create({ book: bookId, user: userId || req.user.id, type: 'issue' });
    res.json(tx);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Return book
router.post('/return', protect, async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(400).json({ message: 'Book not found' });
    book.available += 1;
    await book.save();
    const tx = await Transaction.create({ book: bookId, user: userId || req.user.id, type: 'return' });
    res.json(tx);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get transactions (admins see all; users see their own)
router.get('/', protect, async (req, res) => {
  const q = req.query;
  const filter = {};
  if (req.user.role !== 'admin') filter.user = req.user.id;
  if (q.userId) filter.user = q.userId;
  if (q.bookId) filter.book = q.bookId;
  const list = await Transaction.find(filter).populate('book').populate('user').sort({ date: -1 });
  res.json(list);
});

module.exports = router;
