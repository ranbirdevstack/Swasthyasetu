// models/FollowUp.js
const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, "Please set a follow-up date"],
    },
    purpose: {
      type: String,
      required: [true, "Please specify the follow-up purpose"],
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Missed", "Cancelled"],
      default: "Scheduled",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FollowUp", followUpSchema);