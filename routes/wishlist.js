const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const wishlistController = require("../controllers/wishlistController");

// All routes protected
router.use(protect);

// Get all favorites
router.get("/", wishlistController.getWishlist);

// Toggle add/remove favorite
router.post("/", wishlistController.toggleWishlist);

module.exports = router;
