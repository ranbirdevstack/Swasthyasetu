// models/Doctor.js
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, "Please add a specialization"],
    },
    qualification: {
      type: String,
      required: [true, "Please add a qualification"],
    },
    experience: {
      type: String,
      required: [true, "Please add experience details"],
    },
    facility: {
      type: String,
      required: [true, "Please add an associated facility"],
    },
    consultationHours: {
      type: String,
      default: "",
    },
    registration: {
      type: String,
      required: [true, "Please add a medical registration number"],
    },
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);