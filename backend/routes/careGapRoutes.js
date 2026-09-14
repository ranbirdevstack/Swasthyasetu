// routes/careGapRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCareGaps,
  createCareGap,
  updateCareGap,
} = require("../controllers/careGapController");
const { careGapValidation } = require("../validators/careGapValidator");
const { validate } = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/")
  .get(protect, getCareGaps)
  .post(protect, authorize("admin", "worker", "doctor"), validate(careGapValidation), createCareGap);

router.route("/:id")
  .put(protect, authorize("admin", "worker", "doctor"), updateCareGap);

module.exports = router;