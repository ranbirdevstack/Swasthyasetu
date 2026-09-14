// jobs/appointmentReminder.js
const cron = require("node-cron");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
const logger = require("../utils/logger");

const initAppointmentReminderJob = () => {
  // Runs every hour to check for upcoming appointments
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Find appointments happening roughly 24 hours from now
      const appointments = await Appointment.find({
        appointmentDate: {
          $gte: now,
          $lte: tomorrow,
        },
        status: "Scheduled",
      }).populate("patient doctor");

      for (const appt of appointments) {
        if (appt.patient) {
          await Notification.create({
            recipient: appt.patient._id,
            title: "Appointment Reminder",
            message: `You have an upcoming appointment scheduled for ${new Date(appt.appointmentDate).toLocaleString()}.`,
            type: "Appointment",
          });
        }
      }
      logger.info(`Appointment reminder job ran successfully. Processed ${appointments.length} notices.`);
    } catch (error) {
      logger.error(`Error in appointment reminder job: ${error.message}`);
    }
  });
};

module.exports = initAppointmentReminderJob;