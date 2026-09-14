// validators/triageValidator.js
const { body } = require("express-validator");

const triageValidation = [
  body("patient", "Patient ID is required").isMongoId(),
  body("facility", "Facility ID is required").isMongoId(),
  body("symptoms", "Symptoms array or description is required").not().isEmpty(),
  body("priority", "Invalid priority level").optional().isIn(["Routine", "Urgent", "Emergency"]),
];

module.exports = {
  triageValidation,
};