import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:4000' : '/';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('auth/check')
            get().connectSocket();
            set({ authUser: res.data })

        } catch (error) {
            console.log("Auth Check Error: ", error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('auth/signup', data)
            set({ authUser: res.data })
            get().connectSocket();
            toast.success("Created account successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('auth/logout')
            get().disconnectSocket();
            toast.success("Logged out successfully!");
            set({ authUser: null })
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed. Please try again.");
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('auth/login', data)
            set({ authUser: res.data })
            toast.success("Logged in successfully!");
            get().connectSocket();
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('auth/update-profile', data)
            set({ authUser: res.data })
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.log("Profile Update Error: ", error);
            toast.error(error.response?.data?.message || "Profile update failed. Please try again.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BACKEND_URL, {
            query: { userId: authUser._id }
        });
        socket.on('online-users', (userIds) => {

            set({ onlineUsers: userIds });
        });
        set({ socket: socket });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
        set({ socket: null });
    }

}));