// jobs/careGapChecker.js
const cron = require("node-cron");
const CareGap = require("../models/CareGap");
const Notification = require("../models/Notification");
const logger = require("../utils/logger");

const initCareGapCheckerJob = () => {
  // Runs daily at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();

      // Find open care gaps that have passed their due date
      const overdueGaps = await CareGap.find({
        dueDate: { $lt: now },
        status: "Open",
      });

      for (const gap of overdueGaps) {
        gap.status = "Overdue";
        await gap.save();

        await Notification.create({
          recipient: gap.patient,
          title: "Overdue Care Gap Alert",
          message: `Your care requirement for '${gap.gapType}' is now overdue. Please consult your health worker.`,
          type: "General",
        });
      }
      logger.info(`Care gap checker updated ${overdueGaps.length} gaps to overdue.`);
    } catch (error) {
      logger.error(`Error in care gap checker job: ${error.message}`);
    }
  });
};

module.exports = initCareGapCheckerJob;