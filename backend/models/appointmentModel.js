const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: String,
  date: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Appointment", appointmentSchema);