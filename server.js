import express from "express";
import User from "./models/userModel";
const mongoose = require("mongoose");
import cors from "cors";
import jwt from "jsonwebtoken";
const app = express();
const uri =
  "mongodb+srv://trongnx:k5YM25DpYMB3lcsh@clusterstudy.zzwq3zp.mongodb.net/trong";
const PORT = 8000;
const ACCESS_TOKEN_SECRET = "trongnx";
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const createAccessToken = (user) => {
  return jwt.sign(
    { username: user.username, id: user._id },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "3d",
    }
  );
};

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      res.status(401).json({ error: "User not found" });
    }
    if (user.password !== req.body.password) {
      res.status(401).json({ error: "Password incorrect" });
    }
    const accessToken = await createAccessToken(user);
    res.status(200).json({ user, accessToken });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username });

    if (!user) {
      console.log("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Cannot connect to database", err);
  });
