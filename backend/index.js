import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { pool } from './db.js';
import { createUsersTableIfNotExists } from './initDb.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS: Allow requests from frontend
app.use(cors());

// ✅ Increase JSON and URL-encoded payload limits to handle image uploads
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// ✅ Simple test route
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route group for user-related actions (signup, login, image updates)
app.use('/api/users', userRoutes);

// ✅ Ensure users table exists before starting the server
createUsersTableIfNotExists().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
});
