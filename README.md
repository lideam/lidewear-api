# 🛍️ LideWear Backend

This is the **backend service** for **LideWear**, an e-commerce fashion store built with **Node.js**, **Express**, and **MongoDB**.  
It provides APIs for authentication, products, cart, wishlist, orders, and payments (via **Chapa**).

---

## 🚀 Features
- User authentication (JWT-based login/signup)
- Product management (CRUD, categories)
- Cart & Wishlist APIs
- Order placement and tracking
- Payment integration with **Chapa**
- Admin middleware for restricted routes
- MongoDB Atlas integration
- Uploads support for product images

---

## 📂 Project Structure
```
backend/
├── config/              # Database connection
├── controllers/         # Route logic
├── routes/              # API routes
├── models/              # MongoDB schemas
├── middlewares/         # Auth & Admin checks
├── uploads/             # Product images
├── utils/               # Helpers (future use)
├── .env                 # Environment variables
├── seed.js              # Seeding script for products
└── server.js            # Entry point
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/lidewear-backend.git
cd lidewear-backend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables  
Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt
CHAPA_SECRET_KEY=your_chapa_secret_key
```

### 4️⃣ Run the server
```bash
npm run dev
```

Server runs at:  
👉 `http://localhost:5000`

---

## 🛠️ API Endpoints

| Method | Endpoint         | Description              |
|--------|-----------------|--------------------------|
| POST   | /api/auth/signup | Register new user        |
| POST   | /api/auth/login  | Login user & get token   |
| GET    | /api/products    | Fetch all products       |
| POST   | /api/cart        | Add product to cart      |
| GET    | /api/orders      | Fetch user orders        |
| POST   | /api/wishlist    | Add product to wishlist  |
| POST   | /api/payment     | Process Chapa payment    |

---

## 🧪 Seeding Products
To add demo products into MongoDB:
```bash
node seed.js
```

---

## 🛡️ Security Notes
- Never commit `.env` to GitHub
- Use **strong JWT secret**
- For production: set `NODE_ENV=production`

---

## 📜 License
MIT License © 2025 **Lidetu Amare**
