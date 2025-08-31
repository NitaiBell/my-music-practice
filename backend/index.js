import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import teacherStudentRoutes from './routes/teacherStudentRoutes.js';
import courseProgressRoutes from './routes/courseProgressRoutes.js';
import articleReadsRoutes from './routes/articleReadsRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js'; // ✅ NEW

import { pool } from './db.js';
import {
  createUsersTableIfNotExists,
  createPracticeLogTableIfNotExists,
  createTeacherStudentTableIfNotExists,
  createUserCourseProgressTable,
  createUserArticleReadsTable,
  createOneTimePasswordsTable, // ✅ NEW
} from './initDb.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// ✅ Test route
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/teacher-student', teacherStudentRoutes);
app.use('/api/course-progress', courseProgressRoutes);
app.use('/api/article-reads', articleReadsRoutes);
app.use('/api', passwordRoutes); // ✅ NEW route

// ✅ Start server after ensuring all tables exist
Promise.all([
  createUsersTableIfNotExists(),
  createPracticeLogTableIfNotExists(),
  createTeacherStudentTableIfNotExists(),
  createUserCourseProgressTable(),
  createUserArticleReadsTable(),
  createOneTimePasswordsTable(), // ✅ NEW
]).then(() => {
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
}).catch((err) => {
  console.error("❌ Failed to initialize tables:", err.message);
});
