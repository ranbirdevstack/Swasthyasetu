// validators/referralValidator.js
const { body } = require("express-validator");

const referralValidation = [
  body("patient", "Patient ID is required").isMongoId(),
  body("sourceFacility", "Source facility ID is required").isMongoId(),
  body("targetFacility", "Target facility ID is required").isMongoId(),
  body("reason", "Reason for referral is required").not().isEmpty().trim(),
  body("urgency", "Invalid urgency level").isIn(["Routine", "Urgent", "Emergency"]),
];

module.exports = {
  referralValidation,
};