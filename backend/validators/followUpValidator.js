// validators/followUpValidator.js
const { body } = require("express-validator");

const followUpValidation = [
  body("patient", "Patient ID is required").isMongoId(),
  body("facility", "Facility ID is required").isMongoId(),
  body("scheduledDate", "A valid scheduled date is required").isISO8601(),
  body("purpose", "Follow-up purpose is required").not().isEmpty().trim(),
];

const updateFollowUpValidation = [
  body("status", "Invalid status value").optional().isIn(["Scheduled", "Completed", "Missed", "Cancelled"]),
  body("notes", "Notes must be a string").optional().isString(),
];

module.exports = {
  followUpValidation,
  updateFollowUpValidation,
};