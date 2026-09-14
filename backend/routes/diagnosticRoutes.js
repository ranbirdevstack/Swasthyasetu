// routes/diagnosticRoutes.js
const express = require("express");
const router = express.Router();
const {
  getDiagnostics,
  createDiagnostic,
  updateDiagnostic,
} = require("../controllers/diagnosticController");
const { diagnosticValidation } = require("../validators/diagnosticValidator");
const { validate } = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/")
  .get(protect, getDiagnostics)
  .post(protect, authorize("doctor", "worker", "admin"), validate(diagnosticValidation), createDiagnostic);

router.route("/:id")
  .put(protect, authorize("doctor", "worker", "admin"), updateDiagnostic);

module.exports = router;