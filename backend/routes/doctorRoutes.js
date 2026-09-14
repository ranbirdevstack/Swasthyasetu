// backend/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const {
  getDoctorDashboard,
  createDoctorReferral,
  updateDoctorProfile,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("doctor"));

router.route("/dashboard").get(getDoctorDashboard);
router.route("/referrals").post(createDoctorReferral);
router.route("/profile").put(updateDoctorProfile);

module.exports = router;