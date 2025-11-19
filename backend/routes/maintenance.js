const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Member = require('../models/Member');

// ADD PRODUCT (Book or Movie)
router.post('/add-product', async (req, res) => {
    try {
        const { title, author, serialNo, category } = req.body;
        const newBook = new Book({ title, author, serialNo, category });
        await newBook.save();
        res.json({ message: `${category} Added Successfully` });
    } catch (err) {
        res.status(500).json({ message: "Error adding product" });
    }
});

// ADD MEMBERSHIP
router.post('/add-member', async (req, res) => {
    try {
        const { name, membershipId, type } = req.body;
        
        // Calculate Expiry
        let expiry = new Date();
        if (type === '6 months') expiry.setMonth(expiry.getMonth() + 6);
        if (type === '1 year') expiry.setFullYear(expiry.getFullYear() + 1);
        if (type === '2 years') expiry.setFullYear(expiry.getFullYear() + 2);

        const member = new Member({ name, membershipId, type, expiryDate: expiry });
        await member.save();
        res.json({ message: "Member Added Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding member" });
    }
});

module.exports = router;