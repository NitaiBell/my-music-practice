// backend/initDb.js
import { pool } from './db.js';

export const createUsersTableIfNotExists = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ 'users' table ready.");
  } catch (err) {
    console.error("❌ Error creating 'users' table:", err.message);
  }
};

export const createPracticeLogTableIfNotExists = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_practice_log (
        id SERIAL PRIMARY KEY,
        gmail TEXT NOT NULL,
        practice_name TEXT NOT NULL,
        correct INT,
        wrong INT,
        tries INT,
        level INT,
        rank INT,
        max_rank INT,
        right_score INT,
        try_score INT,
        speed_score INT,
        avg_time_per_answer REAL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ 'user_practice_log' table ready.");
  } catch (err) {
    console.error("❌ Error creating 'user_practice_log' table:", err.message);
  }
};
