const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();

// ✅ Create a new Cart (for a user)
router.post("/", async (req, res) => {
  try {
    const cart = new Cart(req.body);
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all Carts
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("user").populate("items.product");
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Cart by User ID
router.get("/user/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate("user")
      .populate("items.product");
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add Item to Cart
router.post("/:cartId/items", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update Item Quantity
router.put("/:cartId/items/:itemId", async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Remove Item from Cart
router.delete("/:cartId/items/:itemId", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items.id(req.params.itemId).deleteOne();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Cart
router.delete("/:cartId", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.cartId);
    res.json({ message: "Cart deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
