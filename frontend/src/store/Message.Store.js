import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { useAuthStore } from './Auth.Store.js';

export const useMessageStore = create((set, get) => ({
    users: [],
    messages: [],
    isMessagesLoading: false,
    isUserloading: false,
    selectedUser: null,


    getUser: async () => {
        set({ isUserloading: true });
        try {
            const res = await axiosInstance.get('/messages/');
            set({ users: res.data });
        } catch (error) {
            console.error('Error fetching users for sidebar:', error);
            toast.error('Could not find users');
        }
        finally {
            set({ isUserloading: false });
        }
    },

    getMessages: async (userId) => {

        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        }
        catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Error fetching messages');
        }
        finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { messages, selectedUser } = get()

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error('Error sending message');
            console.error('Error sending message:', error);
        }

    },

    subscribeToNewMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;


        socket.on('new-message', (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({ messages: [...get().messages, newMessage] });
        });
    },

    unsusbscribeToNewMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('new-message');
    },

    setSelectedUser: async (user) => set({ selectedUser: user }),

}));
