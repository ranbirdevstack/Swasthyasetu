// backend/models/ConsultationLog.js
const mongoose = require("mongoose");

const consultationLogSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  callType: { type: String, enum: ["video", "voice"], required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: { type: String, enum: ["Completed", "Missed", "Cancelled"], default: "Completed" },
  clinicalNotes: { type: String, default: "" },
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
}, { timestamps: true });

module.exports = mongoose.model("ConsultationLog", consultationLogSchema);