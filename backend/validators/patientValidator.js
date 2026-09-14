// validators/patientValidator.js
const { body } = require("express-validator");

const patientProfileValidation = [
  body("gender", "Gender is required and must be Male, Female, or Other").optional().isIn(["Male", "Female", "Other"]),
  body("bloodGroup", "Invalid blood group format").optional().isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  body("emergencyContact", "Emergency contact phone is required").optional().not().isEmpty().trim(),
  body("address", "Address must be a valid string").optional().isString().trim(),
];

const updatePatientValidation = [
  body("gender", "Invalid gender specified").optional().isIn(["Male", "Female", "Other"]),
  body("bloodGroup", "Invalid blood group format").optional().isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  body("emergencyContact", "Invalid emergency contact").optional().not().isEmpty().trim(),
  body("address", "Address must be a valid string").optional().isString().trim(),
];

module.exports = {
  patientProfileValidation,
  updatePatientValidation,
};