import express from 'express';
import {
  proposeLink,
  getStudentsForTeacher,
  getTeachersForStudent,
  getAllTeachersForStudent, // ✅ Updated function name for multiple teachers
} from '../controllers/teacherStudentController.js';

const router = express.Router();

// Propose or confirm a teacher-student link
router.post('/propose-link', proposeLink);

// Get all students for a teacher (confirmed only)
router.get('/students', getStudentsForTeacher);

// Get all teacher emails (for legacy support if needed)
router.get('/teachers', getTeachersForStudent);

// ✅ NEW: Get full teacher info list (name + email) for a student
router.get('/teacher', getAllTeachersForStudent);

export default router;
