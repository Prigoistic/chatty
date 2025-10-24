import axios from "axios";

// Prefer env override for deployments; default to "/api" for dev proxy and same-origin prod
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});
