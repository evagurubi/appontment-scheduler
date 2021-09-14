const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: { type: String },
  startTime: { type: String },
  endTime: { type: String },
});

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema,
  "Appointments"
);
