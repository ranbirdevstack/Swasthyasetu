// models/Patient.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: [true, "Please add age"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    emergencyContact: {
      type: String,
      required: [true, "Please add an emergency contact number"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);