import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try{
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

        if(newUser){
            //generate jwt token
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({_id: newUser._id, fullname: newUser.fullname, email: newUser.email, profilepic: newUser.profilepic});

        }else{
            res.status(400).json({ message: "Invalid user data." });
        }

        await newUser.save();
        res.status(201).json({ message: "User created successfully." });

    } catch(error){
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal server error." });
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

        res.status(200).json({ message: "Login successful." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};
export const logout = (req, res) => {
   res.status(200).json({ message: "Logout successful." });
};
