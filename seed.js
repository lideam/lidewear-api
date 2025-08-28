const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const seedProducts = [
  {
    name: "Red T-Shirt",
    imageUrl:
      "https://images.pexels.com/photos/15033211/pexels-photo-15033211.jpeg",
    price: 19.99,
    rating: 4,
    category: "Clothing",
    description: "A stylish red t-shirt",
    countInStock: 50,
  },
  {
    name: "Blue Jeans",
    imageUrl:
      "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
    price: 49.99,
    rating: 5,
    category: "Clothing",
    description: "Classic blue denim jeans",
    countInStock: 30,
  },
  {
    name: "Running Shoes",
    imageUrl:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    price: 89.99,
    rating: 4.5,
    category: "Shoes",
    description: "Comfortable running shoes",
    countInStock: 20,
  },
];

mongoose
  .connect("mongodb://127.0.0.1:27017/fashionstore", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");

    // clear old products
    await Product.deleteMany();

    // insert new ones
    const inserted = await Product.insertMany(seedProducts);
    console.log("Products seeded:", inserted);

    mongoose.connection.close();
  })
  .catch((err) => console.error(err));
