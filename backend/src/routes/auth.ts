import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getProfile);

export default router;