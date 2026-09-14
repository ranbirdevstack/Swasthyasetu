// controllers/availabilityController.js
const Facility = require("../models/Facility");

const checkAvailability = async (req, res, next) => {
  try {
    const facilities = await Facility.find({ availableBeds: { $gt: 0 } });
    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkAvailability,
};