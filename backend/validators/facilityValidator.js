// validators/facilityValidator.js
const { body } = require("express-validator");

const facilityValidation = [
  body("name", "Facility name is required").not().isEmpty().trim(),
  body("type", "Facility type is required").not().isEmpty().trim(),
  body("address", "Address is required").not().isEmpty().trim(),
];

module.exports = {
  facilityValidation,
};