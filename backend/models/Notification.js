// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add notification title"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please add notification message"],
    },
    type: {
      type: String,
      enum: ["Appointment", "Referral", "FollowUp", "General"],
      default: "General",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);