// jobs/followUpReminder.js
const cron = require("node-cron");
const FollowUp = require("../models/FollowUp");
const Notification = require("../models/Notification");
const logger = require("../utils/logger");

const initFollowUpReminderJob = () => {
  // Runs daily at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const followUps = await FollowUp.find({
        scheduledDate: { $gte: today, $lte: endOfDay },
        status: "Scheduled",
      });

      for (const fu of followUps) {
        await Notification.create({
          recipient: fu.patient,
          title: "Follow-Up Due Today",
          message: `You have a scheduled health follow-up today regarding: ${fu.purpose}.`,
          type: "FollowUp",
        });
      }
      logger.info(`Follow-up reminder job processed ${followUps.length} entries.`);
    } catch (error) {
      logger.error(`Error in follow-up reminder job: ${error.message}`);
    }
  });
};

module.exports = initFollowUpReminderJob;