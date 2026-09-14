// backend/routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const { getPatientDashboard, bookPatientAppointment } = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/dashboard").get(protect, authorize("patient"), getPatientDashboard);
router.route("/appointments").post(protect, authorize("patient"), bookPatientAppointment);

module.exports = router;