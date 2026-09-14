// services/appointmentService.js
const Appointment = require("../models/Appointment");

const createAppointment = async (userId, data) => {
  const { doctor, facility, appointmentDate, symptoms } = data;

  const appointment = await Appointment.create({
    patient: userId,
    doctor,
    facility,
    appointmentDate,
    symptoms,
  });

  return appointment;
};

const getAppointments = async (user) => {
  let query = {};
  if (user.role === "patient") {
    query.patient = user._id;
  } else if (user.role === "doctor") {
    query.doctor = user._id;
  } else if (user.role === "admin") {
    query = {};
  }

  const appointments = await Appointment.find(query)
    .populate("patient", "name email phone")
    .populate("doctor", "name email specialization")
    .populate("facility", "name type address");

  return appointments;
};

const updateAppointment = async (appointmentId, data) => {
  let appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    const error = new Error("Appointment not found");
    error.statusCode = 404;
    throw error;
  }

  const { status, diagnosis, prescription } = data;

  appointment.status = status || appointment.status;
  appointment.diagnosis = diagnosis || appointment.diagnosis;
  appointment.prescription = prescription || appointment.prescription;

  const updatedAppointment = await appointment.save();
  return updatedAppointment;
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
};