// services/analyticsService.js
const Appointment = require("../models/Appointment");
const Referral = require("../models/Referral");
const Triage = require("../models/Triage");
const User = require("../models/User");
const Facility = require("../models/Facility");

const fetchPlatformAnalytics = async () => {
  const totalPatients = await User.countDocuments({ role: "patient" });
  const totalDoctors = await User.countDocuments({ role: "doctor" });
  const totalHealthWorkers = await User.countDocuments({ role: "worker" });
  const totalFacilities = await Facility.countDocuments();
  
  const totalAppointments = await Appointment.countDocuments();
  const completedAppointments = await Appointment.countDocuments({ status: "Completed" });
  
  const totalReferrals = await Referral.countDocuments();
  const emergencyReferrals = await Referral.countDocuments({ urgency: "Emergency" });
  
  const totalTriages = await Triage.countDocuments();

  return {
    users: {
      patients: totalPatients,
      doctors: totalDoctors,
      healthWorkers: totalHealthWorkers,
    },
    facilities: totalFacilities,
    appointments: {
      total: totalAppointments,
      completed: completedAppointments,
    },
    referrals: {
      total: totalReferrals,
      emergency: emergencyReferrals,
    },
    triages: {
      total: totalTriages,
    },
  };
};

module.exports = {
  fetchPlatformAnalytics,
};