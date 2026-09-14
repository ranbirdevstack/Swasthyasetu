// backend/controllers/adminController.js
const User = require("../models/User");
const Facility = require("../models/Facility");
const Referral = require("../models/Referral");
const CareGap = require("../models/CareGap");
const Notification = require("../models/Notification");

// @desc    Get complete administrative dashboard data from database
// @route   GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Fetch admin profile
    const adminUser = await User.findById(adminId).select("-password");

    // Fetch all network data live from collections
    const [users, facilities, referrals, careGaps, notifications] = await Promise.all([
      User.find({}).select("-password").sort({ createdAt: -1 }),
      Facility.find({}).sort({ createdAt: -1 }),
      Referral.find({}).sort({ createdAt: -1 }),
      CareGap.find({}).sort({ createdAt: -1 }),
      Notification.find({ user: adminId }).sort({ createdAt: -1 }),
    ]);

    // Explicitly prevent caching to guarantee a 200 OK status response
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.status(200).json({
      success: true,
      profile: {
        name: adminUser?.name || "SwasthyaSetu Admin",
        role: "System Administrator",
        department: "Healthcare Network Administration",
        organization: "SwasthyaSetu",
        accessLevel: "Full Network Access",
        email: adminUser?.email || "admin@swasthyasetu.in",
        phone: adminUser?.phone || "9876543210",
        image: adminUser?.image || "",
      },
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        role: u.role === "doctor" ? "Doctor" : u.role === "worker" ? "Health Worker" : "Patient",
        phone: u.phone || "N/A",
        email: u.email,
        facility: u.facility || "Primary Health Centre",
        status: u.status || "Active",
        joined: new Date(u.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      })),
      facilities,
      referrals: referrals.map((r) => ({
        id: r._id,
        patient: r.patientName || "Patient",
        from: r.from || "CHC Choubeypur",
        to: r.to || "District Hospital",
        reason: r.reason || "Consultation",
        date: new Date(r.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: r.status || "In Progress",
      })),
      careGaps: careGaps.map((cg) => ({
        id: cg._id,
        patient: cg.patientName || "Patient",
        gap: cg.description || "Care gap identified",
        facility: cg.facility || "PHC Choubeypur",
        priority: cg.priority || "Medium",
        lastContact: "Recent",
        status: cg.status || "Open",
      })),
      notifications: notifications.map((n) => ({
        id: n._id,
        title: n.title,
        message: n.message,
        time: "Recently",
        read: n.read || false,
      })),
    });
  } catch (error) {
    console.error("[Admin Dashboard Error]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status (Approve/Reject/Suspend)
// @route   PATCH /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  updateUserStatus,
};