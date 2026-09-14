// routes/followUpRoutes.js
const express = require("express");
const router = express.Router();
const {
  createFollowUp,
  getFollowUps,
  updateFollowUp,
} = require("../controllers/followUpController");
const { followUpValidation } = require("../validators/followUpValidator");
const { validate } = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/")
  .get(protect, getFollowUps)
  .post(protect, authorize("doctor", "worker", "admin"), validate(followUpValidation), createFollowUp);

router.route("/:id")
  .put(protect, authorize("doctor", "worker", "admin"), updateFollowUp);

module.exports = router;