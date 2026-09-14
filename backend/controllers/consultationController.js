// backend/controllers/consultationController.js
const ConsultationLog = require("../models/ConsultationLog");
const Appointment = require("../models/Appointment");

// Save log and mark appointment as completed when call ends
exports.endConsultationSession = async (req, res) => {
  try {
    const { roomId, patientId, doctorId, callType, clinicalNotes, appointmentId } = req.body;

    // 1. Create Consultation Log
    const log = await ConsultationLog.create({
      roomId,
      patientId,
      doctorId,
      callType,
      endTime: new Date(),
      clinicalNotes,
    });

    // 2. Update associated appointment status if appointmentId is provided
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: "Completed" });
    }

    res.status(200).json({ success: true, message: "Consultation logged successfully", log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};