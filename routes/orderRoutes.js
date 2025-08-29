const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create Order
router.post("/", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json(order);
});

// Get all Orders (populate user + products)
router.get("/", async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate("items.product");
  res.json(orders);
});

// Get Order by ID (populate user + products)
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user")
    .populate("items.product");
  res.json(order);
});

// Update Order
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

// Delete Order
router.delete("/:id", async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted" });
});

module.exports = router;
