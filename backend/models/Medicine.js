// models/Medicine.js
const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a medicine name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please specify the category (e.g., Antibiotic, Analgesic, Vaccine)"],
      trim: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, "Please specify stock quantity"],
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      default: "strips", // e.g., strips, bottles, vials, tablets
    },
    expiryDate: {
      type: Date,
      required: [true, "Please specify the expiration date"],
    },
    reorderLevel: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Medicine", medicineSchema);