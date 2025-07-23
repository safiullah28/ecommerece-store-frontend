import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useCartStore } from "./useCartStore";

const useUserStore = create((set) => ({
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
      toast.success("User created successfully");
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  },
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/api/auth/login", { email, password });

      set({ user: res.data.user, loading: false });
      useCartStore.getState().getCartItems();
      if (res?.data?.user?.role === "admin") toast.success("welcome admin");
      else toast.success("Logged in successfuly");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message);
    }
  },

  logout: async () => {
    try {
      await axios.post("/api/auth/logout");
      set({ user: null });
      useCartStore.getState().clearCart();
      toast.success("Logged out of your account");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/api/auth/profile");
      set({ user: response.data, checkingAuth: false });
      useCartStore.getState().getCartItems();
    } catch (error) {
      console.log(error.message);
      console.log(error);

      set({ checkingAuth: false, user: null });
      useCartStore.getState().clearCart();
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
      toast.error(error?.response?.data?.message);
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
      toast.error(error?.response?.data?.message);
    }
  },
}));

export default useUserStore;
