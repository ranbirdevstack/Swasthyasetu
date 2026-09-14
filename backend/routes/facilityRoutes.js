// routes/facilityRoutes.js
const express = require("express");
const router = express.Router();
const {
  getFacilities,
  getRecommendedFacilities,
  createFacility,
} = require("../controllers/facilityController");
const { facilityValidation } = require("../validators/facilityValidator");
const { validate } = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/")
  .get(getFacilities)
  .post(protect, authorize("admin"), validate(facilityValidation), createFacility);

router.route("/recommend").get(getRecommendedFacilities);

module.exports = router;