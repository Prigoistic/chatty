import express from 'express';
import {login, logout, signup} from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

// Define your authentication routes here
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectedRoute, updateProfile);

export default router;