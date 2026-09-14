// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} = require("../controllers/AppointmentController");
const { appointmentValidation, updateAppointmentValidation } = require("../validators/appointmentValidator");
const { validate } = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/")
  .get(protect, getAppointments)
  .post(protect, validate(appointmentValidation), createAppointment);

router.route("/:id")
  .put(protect, authorize("doctor", "admin", "worker"), validate(updateAppointmentValidation), updateAppointment)
  .delete(protect, cancelAppointment);

module.exports = router;