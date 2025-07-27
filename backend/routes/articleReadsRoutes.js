import express from 'express';
import {
  markArticleAsRead,
  getReadArticles,
  unmarkArticleAsRead, // ✅ new
} from '../controllers/articleReadsController.js';

const router = express.Router();

router.post('/mark-read', markArticleAsRead);
router.post('/unmark-read', unmarkArticleAsRead); // ✅ new
router.get('/read', getReadArticles);

export default router;
