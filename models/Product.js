const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    category: { type: String },
    description: { type: String },
    countInStock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
