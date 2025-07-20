import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async (name, email, password, confirmPassword) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
      });
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/api/auth/login", { email, password });

      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },

  logout: async () => {
    try {
      await axios.post("/api/auth/logout");
      set({ user: null });
    } catch (error) {
      console.log(error);
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/api/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);
      set({ checkingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/api/auth/refreshToken");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
  forgotPassword: async (email) => {
    set({ loading: true });

    try {
      await axios.post("/api/auth/forgotPassword", {
        email,
      });
      set({ loading: false });
      toast.success("Reset Password Link has been sent to your email");
    } catch (error) {
      console.log(error);
    }
  },
  resetPassword: async (password, confirmPassword, token) => {
    set({ loading: true });

    try {
      await axios.post("/api/auth/resetPassword/" + token, {
        password,
        confirmPassword,
      });
      set({ loading: false });
      toast.success("Your password has been reset");
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useUserStore;
