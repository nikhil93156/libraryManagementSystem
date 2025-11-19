const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const Member = require("../models/Member");
const User = require("../models/User");

// ---------------- ADD MEMBER ----------------
router.post("/add-member", async (req, res) => {
  try {
    const { name, membershipId, type } = req.body;

    let expiry = new Date();
    if (type === "6 months") expiry.setMonth(expiry.getMonth() + 6);
    if (type === "1 year") expiry.setFullYear(expiry.getFullYear() + 1);
    if (type === "2 years") expiry.setFullYear(expiry.getFullYear() + 2);

    await Member.create({ name, membershipId, type, expiryDate: expiry });

    res.json({ message: "Member Added Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- GET MEMBER ----------------
router.get("/get-member/:id", async (req, res) => {
  try {
    const member = await Member.findOne({ membershipId: req.params.id });
    if (!member) return res.status(404).json({ message: "Not Found" });

    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- UPDATE MEMBER ----------------
router.put("/update-member/:id", async (req, res) => {
  try {
    const { action } = req.body;
    const member = await Member.findOne({ membershipId: req.params.id });

    if (!member) return res.status(404).json({ message: "Not Found" });

    if (action === "extend") {
      const exp = new Date(member.expiryDate);
      exp.setMonth(exp.getMonth() + 6);
      member.expiryDate = exp;
    } else if (action === "cancel") {
      member.status = "Cancelled";
    }

    await member.save();
    res.json({ message: "Updated Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- ADD PRODUCT ----------------
router.post("/add-product", async (req, res) => {
  try {
    const { title, author, serialNo, category } = req.body;
    await Book.create({ title, author, serialNo, category });

    res.json({ message: `${category} Added Successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- GET PRODUCT ----------------
router.get("/get-book/:serialNo", async (req, res) => {
  try {
    const book = await Book.findOne({ serialNo: req.params.serialNo });
    if (!book) return res.status(404).json({ message: "Not Found" });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- UPDATE PRODUCT ----------------
router.put("/update-product/:serialNo", async (req, res) => {
  try {
    const updated = await Book.findOneAndUpdate(
      { serialNo: req.params.serialNo },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not Found" });

    res.json({ message: "Product Updated", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- ADD USER ----------------
router.post("/add-user", async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    await User.create({ username, password, name, role });

    res.json({ message: "User Created Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- GET USER ----------------
router.get("/get-user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) return res.status(404).json({ message: "Not Found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- UPDATE USER ----------------
router.put("/update-user/:username", async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not Found" });

    res.json({ message: "User Updated", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
