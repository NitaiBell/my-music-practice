import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import { pool } from './db.js';
import { createUsersTableIfNotExists, createPracticeLogTableIfNotExists } from './initDb.js';

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

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/practice', practiceRoutes);

// ✅ Start server after ensuring tables exist
Promise.all([
  createUsersTableIfNotExists(),
  createPracticeLogTableIfNotExists(),
]).then(() => {
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
});
