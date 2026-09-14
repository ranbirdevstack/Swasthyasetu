// routes/syncRoutes.js
const express = require("express");
const router = express.Router();
const { processSync } = require("../controllers/syncController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, processSync);

module.exports = router;