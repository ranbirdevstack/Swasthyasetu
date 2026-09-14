// models/Diagnostic.js
const mongoose = require("mongoose");

const diagnosticSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testName: {
      type: String,
      required: [true, "Please specify the diagnostic test name"],
      trim: true,
    },
    results: {
      type: String,
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Ordered", "Sample Collected", "Completed", "Cancelled"],
      default: "Ordered",
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

module.exports = mongoose.model("Diagnostic", diagnosticSchema);