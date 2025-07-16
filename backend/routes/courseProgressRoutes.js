import express from 'express';
import {
  saveCourseProgress,
  getCourseProgress,
  getAllCourseProgress, // ✅ new
} from '../controllers/courseProgressController.js';

const router = express.Router();

router.post('/save', saveCourseProgress);
router.get('/get', getCourseProgress);
router.get('/all', getAllCourseProgress); // ✅ new route

export default router;
