// src/service/AxiosOrder.jsx
import axios from "axios";

// baseURL should point to your backend root (not /api) because auth lives at /auth
const instance = axios.create({
  baseURL: "http://localhost:8080",
  // DON'T set Authorization here with a static value (will be stale).
});

// Add request interceptor to attach fresh token from localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("user-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default instance;
