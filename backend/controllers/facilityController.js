// controllers/facilityController.js
const Facility = require("../models/Facility");
const { recommendFacilities } = require("../services/facilityRecommendation");

const getFacilities = async (req, res, next) => {
  try {
    const facilities = await Facility.find({});
    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    next(error);
  }
};

const getRecommendedFacilities = async (req, res, next) => {
  try {
    const { lng, lat, service } = req.query;

    if (!lng || !lat) {
      res.status(400);
      throw new Error("Please provide longitude (lng) and latitude (lat)");
    }

    const facilities = await recommendFacilities(lng, lat, service);

    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    next(error);
  }
};

const createFacility = async (req, res, next) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({
      success: true,
      message: "Facility created successfully",
      data: facility,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFacilities,
  getRecommendedFacilities,
  createFacility,
};