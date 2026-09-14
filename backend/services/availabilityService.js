// services/availabilityService.js
const Availability = require("../models/Availability");

const setAvailability = async (doctorId, data) => {
  const { facility, dayOfWeek, startTime, endTime, slotDurationMinutes } = data;

  const availability = await Availability.create({
    doctor: doctorId,
    facility,
    dayOfWeek,
    startTime,
    endTime,
    slotDurationMinutes,
  });

  return availability;
};

const getAvailability = async (query) => {
  const availabilities = await Availability.find(query)
    .populate("doctor", "name phone")
    .populate("facility", "name type address");

  return availabilities;
};

module.exports = {
  setAvailability,
  getAvailability,
};