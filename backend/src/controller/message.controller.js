import cloudinary from '../lib/cloudinary.js';
import Message from '../model/Message.Model.js';
import User from '../model/User.Model.js';
import { io, getReceiverSocketId } from '../lib/socket.js';

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const user = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching users for sidebar:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = null;
        if (image) {
            const uploadMessage = await cloudinary.uploader.upload(image);
            imageUrl = uploadMessage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message: text,
            image: imageUrl,
        });

        await newMessage.save();
        res.status(201).json(newMessage);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new-message', newMessage);
        }

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error' });
    }
}