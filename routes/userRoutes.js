const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create User
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Users (populate address)
router.get("/", async (req, res) => {
  const users = await User.find().populate("addresses").populate("orders").populate("cart") ;
  res.json(users);
});

// Get User by ID (populate address)
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate("address");
  res.json(user);
});

// Update User
router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// Delete User
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
