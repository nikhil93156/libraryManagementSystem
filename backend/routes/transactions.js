const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// ISSUE BOOK (With 15-day Validation)
router.post('/issue', async (req, res) => {
  const { bookId, userId, issueDate, returnDate } = req.body;

  try {
    // Validate 15 Days Logic
    const start = new Date(issueDate);
    const end = new Date(returnDate);
    const diffDays = (end - start) / (1000 * 60 * 60 * 24);

    if (diffDays > 15) {
      return res.status(400).json({ message: "Return date cannot be more than 15 days from issue date." });
    }

    const book = await Book.findById(bookId);
    if (!book.available) return res.status(400).json({ message: "Book not available" });

    const transaction = new Transaction({ bookId, userId, issueDate, returnDate });
    await transaction.save();

    book.available = false;
    await book.save();

    res.json({ message: "Book issued successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CALCULATE FINE (Pre-Return Check)
router.post('/calculate-fine', async (req, res) => {
    const { bookId } = req.body;
    try {
        const trans = await Transaction.findOne({ bookId, actualReturnDate: null }).populate('bookId');
        if (!trans) return res.status(404).json({ message: "Transaction not found" });

        const today = new Date();
        const promised = new Date(trans.returnDate);
        let fine = 0;

        // Logic: 10 Rs per day late
        if (today > promised) {
            const diffTime = Math.abs(today - promised);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            fine = diffDays * 10;
        }

        res.json({ transaction: trans, fine, today });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// COMPLETE RETURN
router.post('/return', async (req, res) => {
    const { transactionId, finePaid, remarks } = req.body;
    try {
        const trans = await Transaction.findById(transactionId);
        const book = await Book.findById(trans.bookId);

        trans.actualReturnDate = new Date();
        trans.finePaid = finePaid;
        trans.remarks = remarks;
        trans.save();

        book.available = true;
        book.save();

        res.json({ message: "Book Returned" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;