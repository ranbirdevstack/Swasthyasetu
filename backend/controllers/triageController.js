// controllers/triageController.js
const triageService = require("../services/triageService");

const createTriage = async (req, res, next) => {
  try {
    const triage = await triageService.createTriage(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Triage assessment recorded successfully",
      data: triage,
    });
  } catch (error) {
    next(error);
  }
};

const getTriages = async (req, res, next) => {
  try {
    const triages = await triageService.getTriages(req.user);
    res.status(200).json({
      success: true,
      count: triages.length,
      data: triages,
    });
  } catch (error) {
    next(error);
  }
};

const getTriageById = async (req, res, next) => {
  try {
    const triage = await triageService.getTriageById(req.params.id);
    res.status(200).json({
      success: true,
      data: triage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTriage,
  getTriages,
  getTriageById,
};