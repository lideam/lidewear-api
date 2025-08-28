const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,

    // ✅ Payment details
    paymentResult: {
      id: { type: String }, // Chapa transaction ID
      status: { type: String }, // e.g. "Pending", "Completed"
      method: { type: String }, // "Chapa"
      tx_ref: { type: String }, // our unique transaction reference
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
