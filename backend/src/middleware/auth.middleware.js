import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import cookieParser from 'cookie-parser';

export const protectedRoute = async (req, res, next) => {
    try{
        const jtoken = req.cookies.token;
        if(!jtoken){
            return res.status(401).json({ message: "Unauthorized. No token provided." });
        }

        // Verify token
        const decoded = jwt.verify(jtoken, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: "Unauthorized. Invalid token." });
        }

        // Fetch user from DB
        const user = await User.findById(decoded.id).select('-password'); // Exclude password
        if(!user){
            return res.status(401).json({ message: "Unauthorized. User not found." });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    }catch (error) {
        console.log("Error in protectedRoute middleware:", error.message);
        return res.status(401).json({ message: "Unauthorized access." });
    }
}
