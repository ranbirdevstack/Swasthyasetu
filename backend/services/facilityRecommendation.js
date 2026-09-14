// Example usage in a facility controller/service
const mapService = require("../services/mapService");
const Facility = require("../models/Facility");

const getNearbyFacilities = async (req, res, next) => {
  try {
    const { lat, lng, maxDistanceKm = 50 } = req.query;
    const facilities = await Facility.find({});

    const nearby = facilities.map((facility) => {
      // Assuming facility has location.coordinates [lng, lat] or latitude/longitude fields
      const distance = mapService.calculateHaversineDistance(
        parseFloat(lat),
        parseFloat(lng),
        facility.latitude,
        facility.longitude
      );
      return { ...facility.toObject(), distanceKm: distance };
    }).filter(f => f.distanceKm <= maxDistanceKm);

    // Sort by closest distance
    nearby.sort((a, b) => a.distanceKm - b.distanceKm);

    res.status(200).json({ success: true, data: nearby });
  } catch (error) {
    next(error);
  }
};