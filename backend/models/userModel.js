const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  bloodGroup: String,
  pregnancyMonth: Number,
  medicalHistory: String,
  familyGeneticHistory: String
});

module.exports = mongoose.model("User", userSchema);