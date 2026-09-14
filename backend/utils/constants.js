// utils/constants.js
const ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  WORKER: "worker",
  ADMIN: "admin",
};

const APPOINTMENT_STATUS = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  MISSED: "Missed",
};

const URGENCY_LEVELS = {
  ROUTINE: "Routine",
  URGENT: "Urgent",
  EMERGENCY: "Emergency",
};

module.exports = {
  ROLES,
  APPOINTMENT_STATUS,
  URGENCY_LEVELS,
};