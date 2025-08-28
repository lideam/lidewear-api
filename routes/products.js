const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", protect, adminMiddleware, createProduct);
router.put("/:id", protect, adminMiddleware, updateProduct);
router.delete("/:id", protect, adminMiddleware, deleteProduct);

module.exports = router;
