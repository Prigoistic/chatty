import express from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users', protectedRoute, getUsersForSidebar);
router.get('/users/:id', protectedRoute, getMessages); // Optional: Fetch specific user details  



export default router;