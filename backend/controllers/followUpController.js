// controllers/followUpController.js
const followUpService = require("../services/followUpService");

const createFollowUp = async (req, res, next) => {
  try {
    const followUp = await followUpService.createFollowUp(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Follow-up created successfully",
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};

const getFollowUps = async (req, res, next) => {
  try {
    const followUps = await followUpService.getFollowUps(req.user);
    res.status(200).json({
      success: true,
      count: followUps.length,
      data: followUps,
    });
  } catch (error) {
    next(error);
  }
};

const updateFollowUp = async (req, res, next) => {
  try {
    const updatedFollowUp = await followUpService.updateFollowUp(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Follow-up updated successfully",
      data: updatedFollowUp,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFollowUp,
  getFollowUps,
  updateFollowUp,
};