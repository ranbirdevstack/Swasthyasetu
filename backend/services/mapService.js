// services/mapService.js
const mapboxClient = require("../config/mapbox");

const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const getRouteDistanceMatrix = async (coordinates) => {
  try {
    const response = await mapboxClient.get(
      `/directions/v5/mapbox/driving/${coordinates}`,
      {
        params: {
          geometries: "geojson",
          overview: "simplified",
        },
      }
    );

    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      return {
        distanceKm: route.distance / 1000,
        durationMinutes: route.duration / 60,
      };
    }
    throw new Error("No route found");
  } catch (error) {
    throw new Error(`Mapbox API error: ${error.message}`);
  }
};

const geocodeAddress = async (query) => {
  try {
    const response = await mapboxClient.get(
      `/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      {
        params: {
          limit: 1,
        },
      }
    );

    if (response.data && response.data.features && response.data.features.length > 0) {
      const [longitude, latitude] = response.data.features[0].center;
      return { latitude, longitude, placeName: response.data.features[0].place_name };
    }
    throw new Error("Location not found");
  } catch (error) {
    throw new Error(`Geocoding error: ${error.message}`);
  }
};

module.exports = {
  calculateHaversineDistance,
  getRouteDistanceMatrix,
  geocodeAddress,
};