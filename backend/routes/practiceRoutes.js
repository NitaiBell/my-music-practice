import express from 'express';
import { savePractice } from '../controllers/practiceController.js';
import { getPracticeStats } from '../controllers/practiceController.js';
import { getPracticeLog } from '../controllers/practiceController.js';

const router = express.Router();

// ✅ Add this test route at the top
router.get('/test', (req, res) => {
  console.log("✅ Test route hit");
  res.json({ message: 'Test route works' });
});

router.post('/save', savePractice);
router.get('/stats', getPracticeStats);
router.get('/log', getPracticeLog); // ✅ Add this line




export default router;
