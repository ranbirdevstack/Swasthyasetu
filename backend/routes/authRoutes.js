const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/authController");
const { loginValidation, registerValidation } = require("../validators/authValidator");

// Pass the array directly as middleware — Express handles execution automatically
router.post("/login", loginValidation, loginUser);
router.post("/register", registerValidation, registerUser);

module.exports = router;