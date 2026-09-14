// controllers/careGapController.js
const careGapService = require("../services/careGapService");

const getCareGaps = async (req, res, next) => {
  try {
    const careGaps = await careGapService.getCareGaps(req.user);
    res.status(200).json({
      success: true,
      count: careGaps.length,
      data: careGaps,
    });
  } catch (error) {
    next(error);
  }
};

const createCareGap = async (req, res, next) => {
  try {
    const careGap = await careGapService.createCareGap(req.body);
    res.status(201).json({
      success: true,
      message: "Care gap recorded successfully",
      data: careGap,
    });
  } catch (error) {
    next(error);
  }
};

const updateCareGap = async (req, res, next) => {
  try {
    const updated = await careGapService.updateCareGap(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Care gap updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCareGaps,
  createCareGap,
  updateCareGap,
};