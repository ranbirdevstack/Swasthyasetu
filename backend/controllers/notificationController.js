// controllers/notificationController.js
const notificationService = require("../services/notificationService");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications(req.user._id);
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await notificationService.markAsRead(req.params.id);
    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};