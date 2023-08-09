const express = require("express");
const mongoose = require("mongoose");
// const { default: Product } = require("./models/productModel");
import Product from "./models/productModel";

const uri =
  "mongodb+srv://trongnx:k5YM25DpYMB3lcsh@clusterstudy.zzwq3zp.mongodb.net/";

const PORT = 8000;

const app = express();
app.use(express.json());
//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/blog", (req, res) => {
  res.send("Hello Blog!");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      console.log("Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.updateOne({ _id: id }, req.body);
    return res.status(200).json(product);
  } catch {}
});

// create product
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

//
mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Cannot connect to database", err);
  });
