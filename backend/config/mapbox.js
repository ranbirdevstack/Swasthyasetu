// config/mapbox.js
const axios = require("axios");
const env = require("./env");

const mapboxClient = axios.create({
  baseURL: "https://api.mapbox.com",
  params: {
    access_token: env.mapboxToken || process.env.MAPBOX_ACCESS_TOKEN,
  },
});

module.exports = mapboxClient;