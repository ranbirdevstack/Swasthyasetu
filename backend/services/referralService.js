// Example usage inside referral creation
const mapService = require("../services/mapService");

const calculateReferralRoute = async (sourceCoords, targetCoords) => {
  // sourceCoords: [lng, lat], targetCoords: [lng, lat]
  const coordinatesString = `${sourceCoords[0]},${sourceCoords[1]};${targetCoords[0]},${targetCoords[1]}`;
  
  try {
    const routeInfo = await mapService.getRouteDistanceMatrix(coordinatesString);
    return routeInfo; // Returns { distanceKm, durationMinutes }
  } catch (error) {
    // Fallback to haversine if Mapbox API fails
    const fallbackDist = mapService.calculateHaversineDistance(
      sourceCoords[1], sourceCoords[0], targetCoords[1], targetCoords[0]
    );
    return { distanceKm: fallbackDist, durationMinutes: fallbackDist * 2 };
  }
};