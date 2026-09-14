// controllers/userController.js
const User = require("../models/User");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
};