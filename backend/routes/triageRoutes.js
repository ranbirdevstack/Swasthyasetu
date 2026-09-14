// routes/triageRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTriage,
  getTriages,
  getTriageById,
} = require("../controllers/triageController");
const { triageValidation } = require("../validators/triageValidator");
const { validate } = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .get(protect, getTriages)
  .post(protect, validate(triageValidation), createTriage);

router.route("/:id")
  .get(protect, getTriageById);

module.exports = router;