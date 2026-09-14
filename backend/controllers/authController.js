// backend/controllers/authController.js
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const HealthWorker = require("../models/HealthWorker");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpire } = require("../config/env");

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpire });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, profileData } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Determine verification status: doctors and workers start unverified (false)
    const isVerified = role === "patient" || role === "admin" ? true : false;

    const user = await User.create({ name, email, password, phone, role, isVerified });

    // Create corresponding role-based profile using correct schema field references (userId)
    if (role === "patient" && profileData) {
      await Patient.create({ userId: user._id, ...profileData });
    } else if (role === "doctor" && profileData) {
      await Doctor.create({ userId: user._id, ...profileData });
    } else if (role === "worker" && profileData) {
      await HealthWorker.create({ userId: user._id, ...profileData });
    } else if (role === "admin" && profileData) {
      await Admin.create({ userId: user._id, ...profileData });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token (supports email or phone identifier)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;
    console.log("[Login Attempt] Payload received:", { identifier, role });

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Please provide credentials" });
    }

    const cleanId = identifier.trim().toLowerCase();

    // Search using $or to safely check both email and phone fields in MongoDB
    const user = await User.findOne({
      $or: [
        { email: cleanId },
        { phone: identifier.trim() }
      ]
    }).select("+password");

    if (!user) {
      console.log("[Login Error] User not found in database for identifier:", cleanId);
      return res.status(401).json({ success: false, message: "Incorrect username or password" });
    }

    const isMatch = await user.matchPassword(password.trim());
    console.log("[Login Check] Password matches:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect username or password" });
    }

    // Optional role check if role is passed
    if (role && user.role !== role && !(role === "worker" && user.role === "health-worker")) {
      console.log(`[Login Error] Role mismatch. User role: ${user.role}, Requested: ${role}`);
      return res.status(401).json({ success: false, message: "Incorrect username or password" });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("[Login Server Exception]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };