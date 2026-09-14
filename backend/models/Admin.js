// models/Admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: [true, "Please add a department"],
    },
    organization: {
      type: String,
      required: [true, "Please add an organization"],
    },
    accessLevel: {
      type: String,
      required: [true, "Please add an access level"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);