// routes/medicineRoutes.js
const express = require("express");
const router = express.Router();
const {
  getMedicines,
  addMedicine,
  updateStock,
} = require("../controllers/medicineController");
const { medicineValidation } = require("../validators/medicineValidator");
const { validate } = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.route("/")
  .get(protect, getMedicines)
  .post(protect, authorize("admin", "worker"), validate(medicineValidation), addMedicine);

router.route("/:id/stock")
  .put(protect, authorize("admin", "worker"), updateStock);

module.exports = router;