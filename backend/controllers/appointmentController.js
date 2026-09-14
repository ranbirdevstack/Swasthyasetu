// controllers/appointmentController.js
const appointmentService = require("../services/appointmentService");

const createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.createAppointment(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getAppointments(req.user);
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const updatedAppointment = await appointmentService.updateAppointment(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    await appointmentService.updateAppointment(req.params.id, { status: "Cancelled" });
    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  cancelAppointment,
};