import express from 'express';
import { signup, login, updateImage } from '../controllers/userController.js';

const router = express.Router();

// Sign up a new user
router.post('/signup', signup);

// Log in an existing user
router.post('/login', login);

// Update user's profile image
router.put('/update-image', updateImage);

export default router;
