// models/Referral.js
const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sourceFacility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    targetFacility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: [true, "Please provide a reason for referral"],
    },
    urgency: {
      type: String,
      enum: ["Routine", "Urgent", "Emergency"],
      default: "Routine",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Cancelled"],
      default: "Pending",
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

module.exports = mongoose.model("Referral", referralSchema);