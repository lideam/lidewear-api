const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  verifyAndMarkAsPaid,
} = require("../controllers/orderController");

const {
  initiateChapaPayment,
  verifyChapaPayment,
} = require("../controllers/paymentController");

router.use(protect);

// Orders
router.post("/", placeOrder); // POST /api/orders
router.get("/", getUserOrders); // GET /api/orders
router.get("/all", adminMiddleware, getAllOrders); // Admin route

// Payments
router.post("/:id/pay/init", initiateChapaPayment); // start chapa checkout
router.post("/:id/verify", verifyChapaPayment); // chapa callback
router.put("/:id/pay", verifyAndMarkAsPaid); // optional manual verify

module.exports = router;
