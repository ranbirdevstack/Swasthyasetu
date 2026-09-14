// utils/scoring.js
const calculateFacilityScore = (distanceKm, capacityAvailable, urgencyLevel) => {
  let score = 100;
  
  // Penalize for distance (e.g., 5 points per km)
  score -= distanceKm * 5;

  // Boost or penalize based on capacity
  if (capacityAvailable) {
    score += 20;
  }

  // Adjust for urgency requirements
  if (urgencyLevel === "Emergency") {
    score += 30;
  }

  return Math.max(0, Math.round(score));
};

module.exports = { calculateFacilityScore };