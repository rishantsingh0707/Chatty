import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { useAuthStore } from './Auth.Store.js';

export const useMessageStore = create((set, get) => ({
    friends: [],
    allUsers: [], // will show ONLY if no friends exist
    messages: [],
    isMessagesLoading: false,
    isUserloading: false,
    selectedUser: null,


    getUser: async () => {
        set({ isUserloading: true });
        try {
            // Fetch friends
            const friendsRes = await axiosInstance.get('/users/friends');
            const friends = friendsRes.data.friends;

            // If no friends, load all users instead
            if (friends.length === 0) {
                const allRes = await axiosInstance.get('/messages/');
                set({ friends: [], allUsers: allRes.data });
            } else {
                set({ friends, allUsers: [] });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Could not load users');
        } finally {
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
        const { messages, selectedUser } = get();
        const authUser = useAuthStore.getState().authUser;

        const isFriend = authUser?.friends?.includes(selectedUser._id);
        const hasFriends = authUser?.friends?.length > 0;

        if (!isFriend && hasFriends) {
            toast.error("You can only message your friends");
            return;
        }

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

    setSelectedUserSecure: (user) => {
        const authUser = useAuthStore.getState().authUser;

        const isFriend = authUser?.friends?.includes(user._id);
        const hasFriends = authUser?.friends?.length > 0;

        if (!isFriend && hasFriends) {
            toast.error("You can only chat with friends");
            return;
        }

        set({ selectedUser: user });
    },


}));
