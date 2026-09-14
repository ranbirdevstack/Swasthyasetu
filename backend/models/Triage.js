// models/Triage.js
const mongoose = require("mongoose");

const triageSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    healthWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    symptoms: [
      {
        type: String,
        required: true,
      },
    ],
    vitals: {
      temperature: { type: String, required: true },
      heartRate: { type: String, required: true },
      bloodPressure: { type: String, required: true },
      oxygenSaturation: { type: String, required: true },
      respiratoryRate: { type: String },
    },
    urgencyLevel: {
      type: String,
      enum: ["Green", "Yellow", "Red"],
      required: true,
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

module.exports = mongoose.model("Triage", triageSchema);