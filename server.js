const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/products");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payment");

dotenv.config();

const app = express();

// ✅ Allow cross-origin requests
app.use(
  cors({
    origin: "*", // you can restrict later to your Flutter app domain if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Connect to DB
connectDB();

// ✅ Healthcheck route
app.get("/", (req, res) => res.send("🚀 LideWear API is running..."));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ Use process.env.PORT (important for Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
