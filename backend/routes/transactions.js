const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// 1. ISSUE BOOK
router.post('/issue', async (req, res) => {
  const { bookId, userId, issueDate, returnDate } = req.body;

  try {
    // Backend Validation: 15 Day Rule (Security)
    const start = new Date(issueDate);
    const end = new Date(returnDate);
    const diffTime = end - start;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 15) {
      return res.status(400).json({ message: "Validation Error: Return date > 15 days" });
    }

    // Check Availability
    const book = await Book.findById(bookId);
    if(book){
      book.quantity=book.quantity-1;
    }
    if (!book || !book.available) {
      return res.status(400).json({ message: "Book is currently unavailable" });
    }

    // Create Transaction
    const transaction = new Transaction({
      bookId,
      userId,
      issueDate,
      returnDate
    });

    // Atomic Update: Mark book unavailable
    book.available = false;
    
    await transaction.save();
    await book.save();

    res.status(201).json({ message: "Book issued successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CALCULATE FINE (Pre-return check)
router.post('/calculate-fine', async (req, res) => {
  const { bookId } = req.body;
  try {
    // Find the active transaction for this book (where actualReturnDate is null)
    const transaction = await Transaction.findOne({ bookId, actualReturnDate: null });
    
    if (!transaction) {
      return res.status(404).json({ message: "No active transaction found for this book" });
    }

    const today = new Date();
    const promisedDate = new Date(transaction.returnDate);
    
    let fine = 0;
    // Fine Logic: 10 currency units per day late
    if (today > promisedDate) {
      const diffTime = Math.abs(today - promisedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 10; 
    }

    res.json({ fine, transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. RETURN BOOK
router.post('/return', async (req, res) => {
  const { transactionId, finePaid, remarks } = req.body;

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    const book = await Book.findById(transaction.bookId);

    // Update Transaction
    transaction.actualReturnDate = new Date();
    transaction.finePaid = finePaid;
    transaction.remarks = remarks;
    transaction.status = 'Returned'; // Assuming you added this field to schema

    // Update Book to Available
    book.available = true;

    await transaction.save();
    await book.save();

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;