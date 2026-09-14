// backend/config/env.js
const dotenv = require("dotenv");
dotenv.config();

const validateEnv = () => {
  const requiredEnvs = ["PORT", "MONGO_URI", "JWT_SECRET"];
  const missing = requiredEnvs.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

validateEnv();

module.exports = {
  port: process.env.PORT || 5002,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "30d",
  mapboxToken: process.env.MAPBOX_ACCESS_TOKEN || "",
  nodeEnv: process.env.NODE_ENV || "development",
};