import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";
const ENABLE_SOCKET = import.meta.env.VITE_ENABLE_SOCKET === "true";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      const user = normalizeUser(res.data);
      set({ authUser: user });
      get().connectSocket();
    } catch (error) {
      console.log("[checkAuth] error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        url: error?.config?.baseURL + error?.config?.url,
        method: error?.config?.method,
      });
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      // Map frontend camelCase to backend expected keys
      const payload = { fullname: data.fullName, email: data.email, password: data.password };
      console.log("[signup] POST /api/auth/signup payload:", payload);
      const res = await axiosInstance.post("/auth/signup", payload);
      const user = normalizeUser(res.data);
      set({ authUser: user });
      toast.success("Account created successfully");
      get().connectSocket();
      return true;
    } catch (error) {
      console.log("[signup] error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        url: error?.config?.baseURL + error?.config?.url,
        method: error?.config?.method,
      });
      toast.error(error?.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log("[login] POST /api/auth/login payload:", { email: data?.email, passwordLen: data?.password?.length });
      const res = await axiosInstance.post("/auth/login", data);
      const user = normalizeUser(res.data);
      set({ authUser: user });
      toast.success("Logged in successfully");

      get().connectSocket();
      return true;
    } catch (error) {
      console.log("[login] error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
        url: error?.config?.baseURL + error?.config?.url,
        method: error?.config?.method,
      });
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      return true;
    } catch {
      // Even if API fails, force local logout so UI redirects; don't alarm user
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out");
      return false;
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      const user = normalizeUser(res.data);
      set({ authUser: user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    // Only connect sockets when explicitly enabled and we have a valid user id
    if (!ENABLE_SOCKET) return;
    if (!authUser || !authUser._id || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    try {
      socket.connect();
    } catch {
      // ignore connection errors when server is not available
      return;
    }

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

// Map backend snake/lowercase keys to frontend camelCase expectations
function normalizeUser(u) {
  if (!u || typeof u !== 'object') return u;
  return {
    _id: u._id,
    fullName: u.fullname ?? u.fullName,
    email: u.email,
    profilePic: u.profilepic ?? u.profilePic ?? "",
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}
