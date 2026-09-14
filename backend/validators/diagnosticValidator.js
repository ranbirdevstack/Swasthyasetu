// validators/diagnosticValidator.js
const { body } = require("express-validator");

const diagnosticValidation = [
  body("patient", "Patient ID is required").isMongoId(),
  body("facility", "Facility ID is required").isMongoId(),
  body("testName", "Test name is required").not().isEmpty().trim(),
];

const diagnosticUpdateValidation = [
  body("status", "Invalid status value").optional().isIn(["Ordered", "Sample Collected", "Completed", "Cancelled"]),
  body("results", "Results details required").optional().not().isEmpty(),
];

module.exports = {
  diagnosticValidation,
  diagnosticUpdateValidation,
};