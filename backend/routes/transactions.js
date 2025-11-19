const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

// 1. Issue Book
router.post('/issue', async (req, res) => {
  const { bookId, userId } = req.body;
  
  try {
    const book = await Book.findById(bookId);
    if (book.available < 1) return res.status(400).json({ message: 'Book not available' });

    // Check if user already has this book
    const existing = await Transaction.findOne({ userId, bookId, status: 'Issued' });
    if (existing) return res.status(400).json({ message: 'You already have this book' });

    const transaction = new Transaction({ userId, bookId });
    await transaction.save();

    book.available -= 1;
    await book.save();

    res.json({ message: 'Book issued successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Return Book (Calculates Fine)
router.post('/return', async (req, res) => {
  const { bookId, userId } = req.body;

  try {
    const transaction = await Transaction.findOne({ userId, bookId, status: 'Issued' });
    if (!transaction) return res.status(400).json({ message: 'Transaction not found' });

    const book = await Book.findById(bookId);
    
    // logic: Calculate Fine (e.g., 10 currency units per day after 7 days)
    const returnDate = new Date();
    const issueDate = new Date(transaction.issueDate);
    const diffTime = Math.abs(returnDate - issueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    let fine = 0;
    if (diffDays > 7) {
        fine = (diffDays - 7) * 10; // 10 fine per late day
    }

    transaction.returnDate = returnDate;
    transaction.status = 'Returned';
    transaction.fine = fine;
    await transaction.save();

    book.available += 1;
    await book.save();

    res.json({ message: `Book returned. Fine to pay: ${fine}`, fineAmount: fine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Pay Fine
router.post('/pay-fine', async (req, res) => {
    const { userId, amount } = req.body;
    // In a real app, integrate Stripe/PayPal here. 
    // Here we just acknowledge the request.
    res.json({ message: `Payment of ${amount} received. Account cleared.` });
});

module.exports = router;
