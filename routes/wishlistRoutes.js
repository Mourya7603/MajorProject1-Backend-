const express = require("express");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const router = express.Router();

// ✅ Create Wishlist
router.post("/", async (req, res) => {
  try {
    const wishlist = new Wishlist(req.body);
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all Wishlists
router.get("/", async (req, res) => {
  try {
    const wishlists = await Wishlist.find().populate("user").populate("products");
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Wishlist by User ID
router.get("/user/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.params.userId })
      .populate("user")
      .populate("products");
    if (!wishlist) return res.status(404).json({ error: "Wishlist not found" });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add Product to Wishlist
router.post("/:wishlistId/products", async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) return res.status(404).json({ error: "Wishlist not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Remove Product from Wishlist
router.delete("/:wishlistId/products/:productId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.wishlistId);
    if (!wishlist) return res.status(404).json({ error: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    );
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Wishlist
router.delete("/:wishlistId", async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.wishlistId);
    res.json({ message: "Wishlist deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
