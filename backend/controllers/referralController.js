// controllers/referralController.js
const referralService = require("../services/referralService");

const createReferral = async (req, res, next) => {
  try {
    const referral = await referralService.createReferral(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Referral created successfully",
      data: referral,
    });
  } catch (error) {
    next(error);
  }
};

const getReferrals = async (req, res, next) => {
  try {
    const referrals = await referralService.getReferrals(req.user);
    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals,
    });
  } catch (error) {
    next(error);
  }
};

const updateReferralStatus = async (req, res, next) => {
  try {
    const updatedReferral = await referralService.updateReferralStatus(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Referral status updated successfully",
      data: updatedReferral,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReferral,
  getReferrals,
  updateReferralStatus,
};