import cloudinary from '../lib/cloudinary.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getUsersForSidebar = async (req, res) => {

    try {
        const loggedInUserId = req.user._id;

        // Fetch all users except the logged-in user
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

        return res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const getMessages = async (req, res) => {
    try {
        const userId = req.params.id;
        const loggedInUserId = req.user._id;

        // Fetch conversation messages between the two users
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId, receiverId: userId },
                { senderId: userId, receiverId: loggedInUserId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time ascending

        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        //image case

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // todo : realtime functionality using socket.io can be added here.


        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessages controller:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};

