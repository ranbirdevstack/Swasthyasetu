// backend/routes/consultationRoutes.js
const express = require("express");
const router = express.Router();
const { endConsultationSession } = require("../controllers/consultationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/end-call", protect, endConsultationSession);

module.exports = router;