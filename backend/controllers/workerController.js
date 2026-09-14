// backend/controllers/workerController.js
const Patient = require("../models/Patient");
const Referral = require("../models/Referral");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc    Get complete health worker dashboard data from database
// @route   GET /api/worker/dashboard
const getWorkerDashboard = async (req, res) => {
  try {
    const workerId = req.user.id;

    // Fetch worker profile
    const workerUser = await User.findById(workerId).select("-password");

    // Fetch live collections
    const [patients, referrals, notifications] = await Promise.all([
      Patient.find({}).sort({ createdAt: -1 }),
      Referral.find({}).sort({ createdAt: -1 }),
      Notification.find({ user: workerId }).sort({ createdAt: -1 }),
    ]);

    // Explicitly prevent caching to guarantee a 200 OK status response
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.status(200).json({
      success: true,
      profile: {
        name: workerUser?.name || "Ravi Kumar",
        role: "Community Health Worker",
        facility: workerUser?.facility || "PHC Choubeypur",
        department: "Primary Healthcare Services",
        employeeId: workerUser?.employeeId || "CHW-1024",
        phone: workerUser?.phone || "9876543210",
        email: workerUser?.email || "ravi.worker@swasthyasetu.in",
        experience: workerUser?.experience || "5 Years",
        image: workerUser?.image || "",
      },
      patients: patients.map((p) => ({
        id: p._id,
        name: p.name,
        age: p.age || 30,
        gender: p.gender || "Not Specified",
        phone: p.phone || "N/A",
        condition: p.condition || "General",
        lastVisit: "Recent",
        risk: p.risk || "Low",
        village: p.village || "Choubeypur",
        assignedDoctor: p.assignedDoctor || "Dr. Sharma",
        status: p.status || "Active",
      })),
      referrals: referrals.map((r) => ({
        id: r._id,
        patient: r.patientName || "Patient",
        from: r.from || "PHC Choubeypur",
        to: r.to || "District Hospital",
        reason: r.reason || "Consultation",
        date: new Date(r.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: r.status || "In Progress",
      })),
      triageCases: [],
      followUps: [],
    });
  } catch (error) {
    console.error("[Worker Dashboard Error]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new referral from worker portal
// @route   POST /api/worker/referrals
const createWorkerReferral = async (req, res) => {
  try {
    const { patient, destination, reason } = req.body;
    const newReferral = await Referral.create({
      worker: req.user.id,
      patientName: patient,
      from: "PHC Choubeypur",
      to: destination,
      reason,
      status: "Pending",
    });

    res.status(201).json({ success: true, data: newReferral });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update health worker profile
// @route   PUT /api/worker/profile
const updateWorkerProfile = async (req, res) => {
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
  getWorkerDashboard,
  createWorkerReferral,
  updateWorkerProfile,
};