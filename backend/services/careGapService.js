// backend/services/careGapService.js
const CareGap = require("../models/CareGap");
const Patient = require("../models/Patient");

const getCareGapsService = async (user) => {
  let filter = {};
  if (user.role === "patient") {
    const patientProfile = await Patient.findOne({ user: user._id });
    if (patientProfile) {
      filter.patient = patientProfile._id;
    } else {
      return [];
    }
  }
  return await CareGap.find(filter).populate("patient");
};

const createCareGapService = async (gapData) => {
  return await CareGap.create(gapData);
};

const updateCareGapService = async (gapId, updateData) => {
  return await CareGap.findByIdAndUpdate(gapId, updateData, { new: true });
};

module.exports = {
  getCareGaps: getCareGapsService,
  createCareGap: createCareGapService,
  updateCareGap: updateCareGapService,
};