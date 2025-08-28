const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const cartController = require("../controllers/cartController");

// All routes below are protected
router.use(protect);

// GET /api/cart
router.get("/", cartController.getCart);

// POST /api/cart
router.post("/", cartController.addToCart);

// DELETE /api/cart/:productId
router.delete("/:productId", cartController.removeFromCart);

module.exports = router;
