import express from 'express';
import { checkOneTimePassword } from '../controllers/checkPassword.js';

const router = express.Router();

// POST /api/check-password
router.post('/check-password', checkOneTimePassword);

export default router;
