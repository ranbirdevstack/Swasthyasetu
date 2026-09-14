// models/MedicalRecord.js
const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    diagnosis: {
      type: String,
      required: [true, "Please add a diagnosis"],
    },
    symptoms: {
      type: String,
      required: [true, "Please add symptoms"],
    },
    vitals: {
      bp: String,
      temperature: String,
      pulse: String,
      spo2: String,
    },
    prescriptions: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);