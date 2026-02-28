const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Import User Model
const User = require("./models/userModel");
const Health = require("./models/healthModel");
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://aaicareuser:Aaicare0911@cluster0.lbxsftx.mongodb.net/aaicare?appName=Cluster0")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

// Test Route
app.get("/", (req, res) => {
  res.send("AaiCare Backend Running Successfully 🚀");
});

// Register User API
app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({
      message: "User Registered Successfully",
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Add Health Data API
app.post("/add-health", async (req, res) => {
  try {
    const healthData = new Health(req.body);
    await healthData.save();
    res.status(201).json({
      message: "Health Data Added Successfully",
      healthData
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 🟢 Healthy Baby Score API
app.get("/score/:userId", async (req, res) => {
  try {
    const health = await Health.findOne({ userId: req.params.userId });

    if (!health) {
      return res.status(404).json({ message: "Health data not found" });
    }

    let score = 0;

    if (health.bp < 140) score += 20;
    if (health.sugar < 140) score += 20;
    if (health.hemoglobin >= 11) score += 20;
    if (health.exercise) score += 20;
    if (health.weight >= 45) score += 20;

    let status = "";
    if (score >= 80) status = "Excellent";
    else if (score >= 60) status = "Moderate";
    else status = "High Risk";

    res.json({ score, status });

  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});