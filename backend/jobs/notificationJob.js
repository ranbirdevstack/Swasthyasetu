// jobs/notificationJob.js
const initAllCronJobs = () => {
  const initAppointmentReminderJob = require("./appointmentReminder");
  const initFollowUpReminderJob = require("./followUpReminder");
  const initCareGapCheckerJob = require("./careGapChecker");

  initAppointmentReminderJob();
  initFollowUpReminderJob();
  initCareGapCheckerJob();

  console.log("All background cron jobs initialized successfully.");
};

module.exports = initAllCronJobs;