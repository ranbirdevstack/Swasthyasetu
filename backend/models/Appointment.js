const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facility: {
      type: String,
      required: [true, "Please specify the healthcare facility"],
      trim: true,
    },
    doctor: {
      type: String,
      default: "General Physician",
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "General Consultation",
        "Specialist Consultation",
        "Health Check-up",
        "Follow-up Consultation",
      ],
      default: "General Consultation",
    },
  date: {
    type: String,
    required: [true, "Please provide an appointment date"],
    default: () => new Date().toISOString().split("T")[0],
  },
  time: {
    type: String,
    required: [true, "Please provide an appointment time"],
    default: "10:30 AM",
  },
    location: {
      type: String,
      default: "Choubeypur",
    },
    status: {
      type: String,
      enum: ["Upcoming", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);