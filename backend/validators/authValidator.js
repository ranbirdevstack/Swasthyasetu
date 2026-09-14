// backend/validators/authValidator.js
const { body, validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body("name", "Name is required").not().isEmpty().trim(),
  body("email", "Please include a valid email").optional().isEmail(),
  body("phone", "Phone number is required").not().isEmpty().trim(),
  body("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
  body("role", "Invalid role specified").optional().isIn(["patient", "doctor", "worker", "admin"]),
  validateResult,
];

const loginValidation = [
  body().custom((value, { req }) => {
    if (!req.body.identifier && !req.body.email && !req.body.phone) {
      throw new Error("Please provide either email or phone number to log in");
    }
    return true;
  }),
  body("password", "Password is required").exists(),
  validateResult,
];

module.exports = {
  registerValidation,
  loginValidation,
};