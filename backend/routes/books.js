const express = require('express');
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET all books (auth required)
router.get('/', protect, async (req, res) => {
  const q = req.query;
  const filter = {};
  if (q.category) filter.category = q.category;
  const books = await Book.find(filter).sort({ title: 1 });
  res.json(books);
});

// CREATE book (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  const { title, author, category, copies } = req.body;
  const book = await Book.create({
    title, author, category,
    copies: copies || 1,
    available: copies || 1
  });
  res.json(book);
});

// UPDATE book (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

// DELETE book (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
