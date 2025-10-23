import jwt from 'jsonwebtoken';

export const generateToken = (userId,res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Generate JWT token
    res.cookie('token', token, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV !== 'development' }); // Set token in HTTP-only cookie
    return token;  
};

