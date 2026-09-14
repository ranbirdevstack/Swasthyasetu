// validators/careGapValidator.js
const { body } = require("express-validator");

const careGapValidation = [
  body("patient", "Patient ID is required").isMongoId(),
  body("gapType", "Gap type is required").not().isEmpty().trim(),
  body("description", "Description is required").not().isEmpty().trim(),
  body("dueDate", "A valid due date is required").isISO8601(),
];

const updateCareGapValidation = [
  body("status", "Invalid status value").isIn(["Open", "Resolved", "Overdue"]),
];

module.exports = {
  careGapValidation,
  updateCareGapValidation,
};