const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
  userId: String,
  bp: Number,
  sugar: Number,
  hemoglobin: Number,
  weight: Number,
  exercise: Boolean,
  score: Number,
  status: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Health", healthSchema);