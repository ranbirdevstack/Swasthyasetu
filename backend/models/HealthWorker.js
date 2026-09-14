// models/HealthWorker.js
const mongoose = require("mongoose");

const healthWorkerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    facility: {
      type: String,
      required: [true, "Please add an associated facility"],
    },
    department: {
      type: String,
      required: [true, "Please add a department"],
    },
    employeeId: {
      type: String,
      required: [true, "Please add an employee ID"],
      unique: true,
    },
    experience: {
      type: String,
      required: [true, "Please add experience details"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HealthWorker", healthWorkerSchema);