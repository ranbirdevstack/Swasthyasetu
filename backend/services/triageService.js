// services/triageService.js
const Triage = require("../models/Triage");

const createTriageAssessment = async (workerId, data) => {
  const { patient, facility, symptoms, vitals, urgencyLevel, notes } = data;

  const triage = await Triage.create({
    patient,
    healthWorker: workerId,
    facility,
    symptoms,
    vitals,
    urgencyLevel,
    notes,
  });

  return triage;
};

const getTriageAssessments = async (user) => {
  let query = {};
  if (user.role === "patient") {
    query.patient = user._id;
  } else if (user.role === "worker") {
    query.healthWorker = user._id;
  }

  const assessments = await Triage.find(query)
    .populate("patient", "name email phone")
    .populate("healthWorker", "name email")
    .populate("facility", "name type address");

  return assessments;
};

module.exports = {
  createTriageAssessment,
  getTriageAssessments,
};