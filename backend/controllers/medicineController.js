// controllers/medicineController.js
const medicineService = require("../services/medicineService");

const getMedicines = async (req, res, next) => {
  try {
    const { facilityId } = req.query;
    const medicines = await medicineService.getMedicines(facilityId);
    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error) {
    next(error);
  }
};

const addMedicine = async (req, res, next) => {
  try {
    const medicine = await medicineService.addMedicine(req.body);
    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: medicine,
    });
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { stockQuantity } = req.body;
    const updated = await medicineService.updateStock(req.params.id, stockQuantity);
    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedicines,
  addMedicine,
  updateStock,
};