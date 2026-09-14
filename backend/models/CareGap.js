// models/CareGap.js
const mongoose = require("mongoose");

const careGapSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gapType: {
      type: String,
      required: [true, "Please specify the care gap type (e.g., Vaccination, Chronic Monitoring)"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide details about the care gap"],
    },
    dueDate: {
      type: Date,
      required: [true, "Please specify a target due date"],
    },
    status: {
      type: String,
      enum: ["Open", "In-Progress", "Closed", "Overdue"],
      default: "Open",
    },
    identifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CareGap", careGapSchema);