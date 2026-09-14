// routes/medicalRecordRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMedicalRecords,
  createMedicalRecord,
} = require("../controllers/medicalRecordController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/")
  .get(protect, getMedicalRecords)
  .post(protect, authorize("doctor", "worker"), createMedicalRecord);

module.exports = router;