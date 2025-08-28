const mongoose = require("mongoose");
const User = require("../models/User");

// GET /api/wishlist - Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist || []);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch wishlist", error: err.message });
  }
};

// POST /api/wishlist - Toggle product in wishlist
exports.toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const user = await User.findById(req.user._id);

    // Properly compare ObjectIds with String
    const index = user.wishlist.findIndex((id) => id.toString() === productId);

    if (index >= 0) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(new mongoose.Types.ObjectId(productId));
    }

    await user.save();

    // Repopulate to return full product objects
    const updatedUser = await User.findById(req.user._id).populate("wishlist");

    res.json(updatedUser.wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update wishlist", error: err.message });
  }
};
