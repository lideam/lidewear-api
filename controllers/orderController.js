const Order = require("../models/Order");
const Cart = require("../models/Cart");

// POST /api/orders - place an order
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      isPaid: false,
    });

    await order.save();
    await Cart.findOneAndDelete({ user: req.user._id }); // clear cart after ordering

    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
  }
};

// GET /api/orders - get current user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get orders", error: err.message });
  }
};

// (Optional) GET /api/orders/all - get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get all orders", error: err.message });
  }
};

const axios = require("axios");

// PUT /api/orders/:id/pay
// PUT /api/orders/:id/pay
exports.verifyAndMarkAsPaid = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Use tx_ref saved in DB during initiateChapaPayment
    const tx_ref = order.paymentResult?.tx_ref;
    if (!tx_ref) {
      return res
        .status(400)
        .json({ message: "No tx_ref found for this order" });
    }

    // Verify transaction with Chapa
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const data = response.data;

    if (data.status === "success" && data.data.status === "success") {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        tx_ref, // ✅ keep reference
        id: data.data.transaction_id,
        status: data.data.status,
        method: "Chapa",
      };

      await order.save();

      return res.json({ message: "Order marked as paid", order });
    } else {
      return res.status(400).json({ message: "Payment not successful" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed to verify payment",
      error: err.response?.data || err.message,
    });
  }
};
