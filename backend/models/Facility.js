const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a facility name"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["PHC", "CHC", "District Hospital", "Clinic"],
      required: [true, "Please specify facility type"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Please add geographic coordinates"],
      },
    },
    phone: {
      type: String,
      required: [true, "Please add a contact phone number"],
    },
    services: [
      {
        type: String,
      },
    ],
    totalBeds: {
      type: Number,
      default: 0,
    },
    availableBeds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

facilitySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Facility", facilitySchema);