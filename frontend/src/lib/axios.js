import axios from "axios";

// Prefer Vite dev proxy with baseURL "/api"; allow override via VITE_API_URL for debugging
const API_URL = import.meta.env.VITE_API_URL || "/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
