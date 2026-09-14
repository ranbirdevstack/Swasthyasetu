// backend/controllers/doctorController.js
const Appointment = require("../models/Appointment");
const Referral = require("../models/Referral");
const User = require("../models/User");

// @desc    Get live doctor dashboard data
// @route   GET /api/doctor/dashboard
const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.id;

    // Fetch doctor profile details
    const doctorUser = await User.findById(doctorId).select("-password");

    // Fetch appointments, referrals, etc. dynamically tied to this doctor or general facility
    const appointments = await Appointment.find({ doctor: doctorId }).sort({ date: 1 });
    const referrals = await Referral.find({ doctor: doctorId }).sort({ createdAt: -1 });

    // Explicitly set headers to prevent 304 caching and ensure a 200 OK response
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.status(200).json({
      success: true,
      profile: {
        name: doctorUser?.name || "Dr. Sharma",
        specialization: doctorUser?.specialization || "General Physician",
        qualification: doctorUser?.qualification || "MBBS, MD",
        experience: doctorUser?.experience || "8 Years",
        facility: doctorUser?.facility || "SwasthyaSetu Community Health Centre",
        consultationHours: doctorUser?.consultationHours || "09:00 AM – 04:00 PM",
        phone: doctorUser?.phone || "9876543203",
        email: doctorUser?.email || "dr.sharma@swasthyasetu.in",
        registration: doctorUser?.registration || "MED-2026-78421",
        bio: doctorUser?.bio || "Experienced general physician focused on coordinated rural healthcare.",
        image: doctorUser?.image || "",
      },
      appointments: appointments.length > 0 ? appointments : [],
      referrals: referrals.length > 0 ? referrals : [],
    });
  } catch (error) {
    console.error("[Doctor Dashboard Error]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new referral from doctor workspace
// @route   POST /api/doctor/referrals
const createDoctorReferral = async (req, res) => {
  try {
    const { patient, destination, reason } = req.body;
    const newReferral = await Referral.create({
      doctor: req.user.id,
      patient,
      to: destination,
      reason,
      status: "Active",
    });

    res.status(201).json({ success: true, data: newReferral });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor profile settings
// @route   PUT /api/doctor/profile
const updateDoctorProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDoctorDashboard,
  createDoctorReferral,
  updateDoctorProfile,
};