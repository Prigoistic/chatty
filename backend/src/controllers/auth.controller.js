import { generateToken } from '../lib/utils.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';



export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try{

        if(!fullname || !email || !password){
            return res.status(400).json({ message: "All fields are required." });
        }

        //hashing
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ message: "Email already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =  await bcrypt.hash(password, salt); 

        // Create a new user
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });

        if(!newUser){
            return res.status(400).json({ message: "Invalid user data." });
        }

        // generate jwt token (may set cookies on res)
        generateToken(newUser._id, res);
        await newUser.save();
        return res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            profilepic: newUser.profilepic
        });

    } catch(error){
        console.log("Error in signup controller:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }

};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilepic: user.profilepic
        });
    } catch (error) {
        console.log("Error in login controller:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};
export const logout = (req, res) => {
    try{
        res.clearCookie('token', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV !== 'development' });

    } catch (error) {
        console.log("Error in logout controller:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
    return res.status(200).json({ message: "Logout successful." });

   
};


export const updateProfile = async (req, res) => {
    const { fullname, email, profilepic } = req.body;
};