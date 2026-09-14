// routes/availabilityRoutes.js
const express = require("express");
const router = express.Router();
const { checkAvailability } = require("../controllers/availabilityController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, checkAvailability);

module.exports = router;