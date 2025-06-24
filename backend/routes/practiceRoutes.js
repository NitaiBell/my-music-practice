import express from 'express';
import {
  savePractice,
  getPracticeStats,
  getPracticeLog,
  getAllLogsForStudent, // ✅ new import
} from '../controllers/practiceController.js';

const router = express.Router();

// ✅ Add this test route at the top
router.get('/test', (req, res) => {
  console.log("✅ Test route hit");
  res.json({ message: 'Test route works' });
});

// ✅ Save a new practice result
router.post('/save', savePractice);

// ✅ Get stats for a specific practice
router.get('/stats', getPracticeStats);

// ✅ Get logs for a specific practice
router.get('/log', getPracticeLog);

// ✅ Get all logs for a user (for teacher viewing a student)
router.get('/log/all', getAllLogsForStudent);

export default router;
