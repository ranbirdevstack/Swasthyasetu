// routes/referralRoutes.js
const express = require("express");
const router = express.Router();
const {
  createReferral,
  getReferrals,
  updateReferralStatus,
} = require("../controllers/referralController");
const { referralValidation, updateReferralValidation } = require("../validators/referralValidator");
const { validate } = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/")
  .get(protect, getReferrals)
  .post(protect, validate(referralValidation), createReferral);

router.route("/:id")
  .put(protect, authorize("doctor", "admin", "worker"), validate(updateReferralValidation), updateReferralStatus);

module.exports = router;