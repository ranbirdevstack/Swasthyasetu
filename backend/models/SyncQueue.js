// models/SyncQueue.js
const mongoose = require("mongoose");

const syncQueueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: [true, "Please specify sync action (e.g., CREATE_APPOINTMENT, SUBMIT_TRIAGE)"],
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Synced", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SyncQueue", syncQueueSchema);