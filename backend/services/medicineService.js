// backend/services/medicineService.js
const Medicine = require("../models/Medicine");

const getMedicinesService = async (facilityId) => {
  let filter = {};
  if (facilityId) {
    filter.facility = facilityId;
  }
  return await Medicine.find(filter).populate("facility", "name type");
};

const getMedicineByIdService = async (medicineId) => {
  return await Medicine.findById(medicineId).populate("facility", "name type");
};

const createMedicineService = async (medicineData) => {
  return await Medicine.create(medicineData);
};

const updateMedicineService = async (medicineId, updateData) => {
  return await Medicine.findByIdAndUpdate(medicineId, updateData, { new: true, runValidators: true });
};

const deleteMedicineService = async (medicineId) => {
  return await Medicine.findByIdAndDelete(medicineId);
};

module.exports = {
  getMedicines: getMedicinesService,
  getMedicineById: getMedicineByIdService,
  createMedicine: createMedicineService,
  updateMedicine: updateMedicineService,
  deleteMedicine: deleteMedicineService,
};