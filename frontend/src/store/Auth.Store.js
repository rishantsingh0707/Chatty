import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";

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
      const friends = await get().fetchFriends();

      set({
        authUser: {
          ...res.data.user,
          friends,
        },
      });

      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      const friends = [];

      set({
        authUser: {
          ...res.data.user,
          friends,
        },
      });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const friends = await get().fetchFriends();

      set({
        authUser: {
          ...res.data.user,
          friends,
        },
      });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
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
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      const friends = await get().fetchFriends();

      set({
        authUser: {
          ...res.data.user,
          friends,
        },
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },


  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  fetchFriends: async () => {
    try {
      const res = await axiosInstance.get("/users/friends");

      return res.data.friends.map(f => f._id);
    } catch (error) {
      console.error("Error fetching friends:", error);
      return [];
    }
  },

  addFriend: async (friendId) => {
    const { authUser } = get();
    try {
      if (authUser.friends.includes(friendId)) {
        toast.error("User is already your friend");
        return;
      }
      await axiosInstance.post(`/users/add-friend/${friendId}`);
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error(error.response?.data?.message || "Failed to add friend");
    }
  },

  removeFriend: async (friendId) => {
    const { authUser } = get();
    try {
      if (!authUser.friends.includes(friendId)) {
        toast.error("User is not your friend");
        return;
      }
      await axiosInstance.post(`/users/remove-friend/${friendId}`);
      return toast.success("Friend removed successfully");
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error(error.response?.data?.message || "Failed to remove friend");
    }
  },
})
);