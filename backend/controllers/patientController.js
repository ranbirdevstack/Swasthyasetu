// backend/controllers/patientController.js
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Referral = require("../models/Referral");
const Diagnostic = require("../models/Diagnostic");

// @desc    Get live patient dashboard data from database
// @route   GET /api/patients/dashboard
// @desc    Get live patient dashboard data from database
// @route   GET /api/patients/dashboard
const getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch live profile based on logged-in user ID
    const patientProfile = await Patient.findOne({ userId }) || {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      location: "Choubeypur, Varanasi",
      age: "21",
      emergencyContact: "Family Contact",
      profilePicture: "",
    };

    // Fetch live appointments
    const liveAppointments = await Appointment.find({ patient: userId }).sort({ date: 1 });

    // Fetch live referrals
    const liveReferrals = await Referral.find({ patient: userId }).sort({ date: -1 });

    // Fetch live diagnostics
    const liveDiagnostics = await Diagnostic.find({ patient: userId }).sort({ date: -1 });

    // Explicitly prevent browser caching to guarantee a 200 OK status response
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json({
      success: true,
      profile: {
        name: patientProfile.name || req.user.name,
        age: patientProfile.age || "21",
        phone: patientProfile.phone || req.user.phone,
        email: patientProfile.email || req.user.email,
        location: patientProfile.address || patientProfile.location || "Choubeypur, Varanasi",
        emergencyContact: patientProfile.emergencyContact || "Family Contact",
        profilePicture: patientProfile.profilePicture || "",
      },
      appointments: liveAppointments.length > 0 ? liveAppointments : [],
      referrals: liveReferrals.length > 0 ? liveReferrals : [],
      diagnostics: liveDiagnostics.length > 0 ? liveDiagnostics : [],
    });
  } catch (error) {
    console.error("[Patient Dashboard Error]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book appointment for live patient
// @route   POST /api/patients/appointments
const bookPatientAppointment = async (req, res) => {
  try {
    const { facility, type, date, time } = req.body;
    const newAppt = await Appointment.create({
      patient: req.user.id,
      facility,
      type,
      date,
      time,
      doctor: "General Physician",
      location: "Choubeypur",
      status: "Confirmed",
    });

    res.status(201).json({ success: true, data: newAppt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  
};

module.exports = { getPatientDashboard, bookPatientAppointment };