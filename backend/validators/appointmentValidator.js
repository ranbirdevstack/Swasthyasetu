// validators/appointmentValidator.js
const { body } = require("express-validator");

const appointmentValidation = [
  body("doctor", "Doctor ID is required").isMongoId(),
  body("facility", "Facility ID is required").isMongoId(),
  body("appointmentDate", "A valid appointment date and time is required").isISO8601(),
  body("reason", "Reason for appointment is required").not().isEmpty().trim(),
];

const updateAppointmentValidation = [
  body("status", "Invalid status value").optional().isIn(["Scheduled", "Completed", "Cancelled", "Missed"]),
];

module.exports = {
  appointmentValidation,
  updateAppointmentValidation,
};