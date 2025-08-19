const express = require("express");
const router = express.Router();
const Address = require("../models/Address");

// Create Address
router.post("/", async (req, res) => {
  const address = new Address(req.body);
  await address.save();
  res.json(address);
});

// Get all Addresses
router.get("/", async (req, res) => {
  const addresses = await Address.find();
  res.json(addresses);
});

// Get Address by ID
router.get("/:id", async (req, res) => {
  const address = await Address.findById(req.params.id);
  res.json(address);
});

// Update Address
router.put("/:id", async (req, res) => {
  const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(address);
});

// Delete Address
router.delete("/:id", async (req, res) => {
  await Address.findByIdAndDelete(req.params.id);
  res.json({ message: "Address deleted" });
});

module.exports = router;
