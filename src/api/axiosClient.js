// src/api/axiosClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5003/api", // adjust to your backend port
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically append auth token and prevent 304 cache responses on GET
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.method === "get") {
    config.params = { ...config.params, _t: Date.now() };
  }

  return config;
});

export default apiClient;