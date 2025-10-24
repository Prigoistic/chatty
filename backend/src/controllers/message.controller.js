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

        // Fetch user details by ID, excluding password
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};