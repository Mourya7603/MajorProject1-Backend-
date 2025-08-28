const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Add product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products (with optional filters + sorting) 
router.get("/", async (req, res) => {
  try {
    const { category, rating, sort, arrivals } = req.query; // Added 'arrivals' parameter
    let filter = {};

    console.log("Received query:", { category, rating, sort, arrivals });

    // Filter by category
    if (category) {
      filter.category = { $in: category.split(",") };
    }

    // Filter by rating
    if (rating) {
      filter.ratings = { $gte: Number(rating) };
      console.log("Filtering by rating >= ", rating);
    }

    // Filter by arrivals - NEW: Add this filter
    if (arrivals) {
      // Handle case sensitivity by converting to proper case
      const arrivalsMap = {
        'winter': 'Winter',
        'summer': 'Summer', 
        'limited': 'Limited',
        'new': 'New'
      };
      
      const arrivalsValue = arrivalsMap[arrivals.toLowerCase()] || arrivals;
      filter.Arrivals = arrivalsValue;
      console.log("Filtering by arrivals:", arrivalsValue);
    }

    console.log("Final filter:", filter);

    // Build query
    let query = Product.find(filter);

    // Sorting by price
    if (sort === "lowtohigh") {
      query = query.sort({ price: 1 });
    } else if (sort === "hightolow") {
      query = query.sort({ price: -1 });
    }

    const products = await query.exec();
    console.log("Found products:", products.length);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;