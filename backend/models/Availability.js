// models/Availability.js
const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: [true, "Please specify the day of the week"],
    },
    startTime: {
      type: String,
      required: [true, "Please specify start time (e.g., 09:00)"],
    },
    endTime: {
      type: String,
      required: [true, "Please specify end time (e.g., 17:00)"],
    },
    slotDurationMinutes: {
      type: Number,
      default: 15,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Availability", availabilitySchema);