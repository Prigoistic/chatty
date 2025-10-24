import axios from "axios";

// Always hit /api; Vite dev server will proxy to backend:3000
export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
