// services/followUpService.js
const FollowUp = require("../models/FollowUp");

const createFollowUp = async (userId, data) => {
  const { patient, facility, scheduledDate, purpose, notes } = data;

  const followUp = await FollowUp.create({
    patient,
    assignedTo: userId,
    facility,
    scheduledDate,
    purpose,
    notes,
  });

  return followUp;
};

const getFollowUps = async (user) => {
  let query = {};
  if (user.role === "patient") {
    query.patient = user._id;
  } else if (user.role === "worker" || user.role === "doctor") {
    query.assignedTo = user._id;
  }

  const followUps = await FollowUp.find(query)
    .populate("patient", "name phone")
    .populate("assignedTo", "name role")
    .populate("facility", "name type");

  return followUps;
};

const updateFollowUpStatus = async (followUpId, status, notes) => {
  let followUp = await FollowUp.findById(followUpId);

  if (!followUp) {
    const error = new Error("Follow-up record not found");
    error.statusCode = 404;
    throw error;
  }

  followUp.status = status || followUp.status;
  if (notes) followUp.notes = notes;

  const updated = await followUp.save();
  return updated;
};

module.exports = {
  createFollowUp,
  getFollowUps,
  updateFollowUpStatus,
};