// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAdminDashboard,
  updateUserStatus,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getAdminDashboard);
router.patch("/users/:id/status", updateUserStatus);

module.exports = router;