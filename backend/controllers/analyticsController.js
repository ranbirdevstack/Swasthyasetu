// controllers/analyticsController.js
const analyticsService = require("../services/analyticsService");

const getSystemAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAnalyticsData();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSystemAnalytics,
};