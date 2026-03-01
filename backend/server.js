const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const User = require("./models/userModel");
const Health = require("./models/healthModel");
const Appointment = require("./models/appointmentModel");

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* ---------------- MONGODB CONNECTION ---------------- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Error:", err));

/* ---------------- ROOT ---------------- */
app.get("/", (req, res) => {
  res.send("AaiCare Backend Running 🚀");
});

/* ---------------- REGISTER ---------------- */
app.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ---------------- LOGIN ---------------- */
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: { $regex: new RegExp("^" + email + "$", "i") }
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json({ user });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ---------------- ADD HEALTH ---------------- */
app.post("/add-health", async (req, res) => {
  try {
    const { bp, sugar, hemoglobin, weight, exercise, userId } = req.body;

    let score = 0;

    if (bp < 140) score += 20;
    if (sugar < 140) score += 20;
    if (hemoglobin >= 11) score += 20;
    if (exercise) score += 20;
    if (weight >= 45) score += 20;

    let status =
      score >= 80 ? "Excellent" :
      score >= 60 ? "Moderate" :
      "High Risk";

    const health = new Health({
      userId,
      bp,
      sugar,
      hemoglobin,
      weight,
      exercise,
      score,
      status,
      date: new Date()
    });

    await health.save();

    res.status(201).json({
      message: "Health data saved",
      health
    });

  } catch (error) {
    res.status(500).json({ message: "Health save failed" });
  }
});

/* ---------------- GET HEALTH HISTORY ---------------- */
app.get("/health-history/:userId", async (req, res) => {
  try {
    const data = await Health.find({ userId: req.params.userId })
      .sort({ date: 1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ---------------- GET LATEST SCORE ---------------- */
app.get("/score/:userId", async (req, res) => {
  try {
    const latest = await Health.findOne({ userId: req.params.userId })
      .sort({ date: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No health data found" });
    }

    res.json({
      score: latest.score,
      status: latest.status
    });

  } catch (error) {
    res.status(500).json({ message: "Score fetch failed" });
  }
});

/* ---------------- ADD APPOINTMENT ---------------- */
app.post("/add-appointment", async (req, res) => {
  try {
    const appointment = new Appointment({
      userId: req.body.userId,
      date: req.body.date
    });

    await appointment.save();
    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({ message: "Appointment save failed" });
  }
});

/* ---------------- GET APPOINTMENT ---------------- */
app.get("/appointment/:userId", async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      userId: req.params.userId
    }).sort({ date: -1 });

    res.json(appointment);

  } catch (error) {
    res.status(500).json({ message: "Appointment fetch failed" });
  }
});

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});