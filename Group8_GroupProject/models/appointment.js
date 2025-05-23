const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
{ 
  date: { type: String, required: true },
  time: { type: String, required: true },
  isTimeSlotAvailable: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model("Appointment", appointmentSchema);