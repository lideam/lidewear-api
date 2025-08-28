const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile); // 🔧 Add this

module.exports = router;
