// controllers/medicalRecordController.js
const MedicalRecord = require("../models/MedicalRecord");

const getMedicalRecords = async (req, res, next) => {
  try {
    const query = req.user.role === "patient" ? { patient: req.user._id } : {};
    const records = await MedicalRecord.find(query).populate("patient doctor facility");
    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

const createMedicalRecord = async (req, res, next) => {
  try {
    req.body.doctor = req.user._id;
    const record = await MedicalRecord.create(req.body);
    res.status(201).json({
      success: true,
      message: "Medical record created successfully",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedicalRecords,
  createMedicalRecord,
};