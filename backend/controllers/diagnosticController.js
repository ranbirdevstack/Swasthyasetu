// controllers/diagnosticController.js
const diagnosticService = require("../services/diagnosticService");

const getDiagnostics = async (req, res, next) => {
  try {
    const diagnostics = await diagnosticService.getDiagnostics(req.user);
    res.status(200).json({
      success: true,
      count: diagnostics.length,
      data: diagnostics,
    });
  } catch (error) {
    next(error);
  }
};

const createDiagnostic = async (req, res, next) => {
  try {
    const diagnostic = await diagnosticService.createDiagnostic(req.body);
    res.status(201).json({
      success: true,
      message: "Diagnostic record created successfully",
      data: diagnostic,
    });
  } catch (error) {
    next(error);
  }
};

const updateDiagnostic = async (req, res, next) => {
  try {
    const updated = await diagnosticService.updateDiagnostic(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Diagnostic record updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDiagnostics,
  createDiagnostic,
  updateDiagnostic,
};