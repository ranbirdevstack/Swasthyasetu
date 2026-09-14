// validators/medicineValidator.js
const { body } = require("express-validator");

const medicineValidation = [
  body("name", "Medicine name is required").not().isEmpty().trim(),
  body("category", "Category is required").not().isEmpty().trim(),
  body("facility", "Facility ID is required").isMongoId(),
  body("stockQuantity", "Stock quantity must be a valid number").isNumeric(),
  body("expiryDate", "A valid expiration date is required").isISO8601(),
];

const stockUpdateValidation = [
  body("stockQuantity", "Stock quantity must be a valid number").isNumeric(),
];

module.exports = {
  medicineValidation,
  stockUpdateValidation,
};