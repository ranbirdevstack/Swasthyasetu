// backend/routes/workerRoutes.js
const express = require("express");
const router = express.Router();
const { getWorkerDashboard, createWorkerReferral, updateWorkerProfile } = require("../controllers/workerController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("worker", "health-worker"));

router.get("/dashboard", getWorkerDashboard);
router.post("/referrals", createWorkerReferral);
router.put("/profile", updateWorkerProfile);

module.exports = router;