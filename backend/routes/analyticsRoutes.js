// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const { getSystemAnalytics } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/").get(protect, authorize("admin"), getSystemAnalytics);

module.exports = router;