// backend/services/diagnosticService.js
const Diagnostic = require("../models/Diagnostic");
const Patient = require("../models/Patient");

const getDiagnosticsService = async (user) => {
  let filter = {};
  if (user.role === "patient") {
    const patientProfile = await Patient.findOne({ user: user._id });
    if (patientProfile) {
      filter.patient = patientProfile._id;
    } else {
      return [];
    }
  }
  return await Diagnostic.find(filter).populate("patient prescribedBy");
};

const getDiagnosticByIdService = async (diagnosticId) => {
  return await Diagnostic.findById(diagnosticId).populate("patient prescribedBy");
};

const createDiagnosticService = async (diagnosticData) => {
  return await Diagnostic.create(diagnosticData);
};

const updateDiagnosticService = async (diagnosticId, updateData) => {
  return await Diagnostic.findByIdAndUpdate(diagnosticId, updateData, { new: true, runValidators: true });
};

module.exports = {
  getDiagnostics: getDiagnosticsService,
  getDiagnosticById: getDiagnosticByIdService,
  createDiagnostic: createDiagnosticService,
  updateDiagnostic: updateDiagnosticService,
};