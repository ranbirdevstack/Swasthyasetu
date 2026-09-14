// services/notificationService.js
const Notification = require("../models/Notification");

const sendNotification = async (recipientId, title, message, type = "General") => {
  const notification = await Notification.create({
    recipient: recipientId,
    title,
    message,
    type,
  });
  return notification;
};

const getNotifications = async (userId) => {
  const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
  return notifications;
};

const markAsRead = async (notificationId) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }
  notification.isRead = true;
  await notification.save();
  return notification;
};

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead,
};