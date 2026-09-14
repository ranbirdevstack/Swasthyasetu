// controllers/syncController.js
const syncService = require("../services/syncService");

const processSync = async (req, res, next) => {
  try {
    const result = await syncService.processSyncAction(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: "Sync processed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processSync,
};