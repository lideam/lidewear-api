const axios = require("axios");
const Order = require("../models/Order");

// ✅ Step 1: Init payment
exports.initiateChapaPayment = async (req, res) => {
  const orderId = req.params.id;
  const user = req.user;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const tx_ref = `order-${orderId}-${Date.now()}`;

    order.paymentResult = {
      id: null,
      status: "Pending",
      method: "Chapa",
      tx_ref,
    };
    await order.save();

    const chapaData = {
      amount: order.totalAmount,
      currency: "ETB",
      tx_ref,
      callback_url: `https://c8aa2993ef26.ngrok-free.app/api/orders/${orderId}/verify`, // 👈 webhook (Chapa posts here)
      return_url: `https://c8aa2993ef26.ngrok-free.app/payment/success?orderId=${orderId}&tx_ref=${tx_ref}`,
      customization: {
        title: "FashionStore",
        description: `Order-${orderId}`,
      },
      customer: {
        email: user.email || "test@example.com",
        first_name: user.name || "User",
        last_name: "Test",
      },
    };

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      chapaData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      checkout_url: response.data.data.checkout_url,
      tx_ref,
    });
  } catch (err) {
    console.error("Chapa Init Error:", err.response?.data || err.message);
    res.status(500).json({
      message: "Chapa payment init failed",
      error: err.response?.data || err.message,
    });
  }
};

// ✅ Step 2: Verify payment (callback)
exports.verifyChapaPayment = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Try tx_ref from callback body OR from order
    const tx_ref = req.body?.tx_ref || order.paymentResult?.tx_ref;
    if (!tx_ref) return res.status(400).json({ message: "No tx_ref found" });

    // Verify with Chapa API
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const result = response.data;

    if (result.status === "success" && result.data.status === "success") {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: result.data.tx_ref,
        status: "Completed",
        method: "Chapa",
        tx_ref,
      };
      await order.save();

      return res.json({ message: "Payment verified successfully", order });
    } else {
      return res
        .status(400)
        .json({ message: "Payment not successful", result });
    }
  } catch (err) {
    console.error("Verification error:", err.response?.data || err.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
