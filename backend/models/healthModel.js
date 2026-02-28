const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
  userId: String,
  weight: Number,
  bp: Number,
  sugar: Number,
  hemoglobin: Number,
  exercise: Boolean
});

module.exports = mongoose.model("Health", healthSchema);