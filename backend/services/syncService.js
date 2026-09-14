// services/syncService.js
const SyncQueue = require("../models/SyncQueue");

const processSyncQueueItem = async (userId, action, payload) => {
  const syncItem = await SyncQueue.create({
    user: userId,
    action,
    payload,
    status: "Synced",
  });
  return syncItem;
};

const getUserSyncItems = async (userId) => {
  const items = await SyncQueue.find({ user: userId });
  return items;
};

module.exports = {
  processSyncQueueItem,
  getUserSyncItems,
};