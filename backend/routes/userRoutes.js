// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/").get(protect, authorize("admin"), getUsers);

module.exports = router;