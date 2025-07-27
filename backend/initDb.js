import { pool } from './db.js';

// Create 'users' table
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

// Create 'user_practice_log' table
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
        session_time REAL, -- ✅ Add this line
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ 'user_practice_log' table ready.");
  } catch (err) {
    console.error("❌ Error creating 'user_practice_log' table:", err.message);
  }
};

// Create 'teacher_student_links' table
export const createTeacherStudentTableIfNotExists = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teacher_student_links (
        id SERIAL PRIMARY KEY,
        teacher_email TEXT NOT NULL,
        student_email TEXT NOT NULL,
        confirmed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ 'teacher_student_links' table ready.");
  } catch (err) {
    console.error("❌ Error creating 'teacher_student_links' table:", err.message);
  }
};


export const createUserCourseProgressTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_course_progress (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL REFERENCES users(email),
        course_name TEXT NOT NULL,
        completed_lessons JSONB DEFAULT '{}',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ 'user_course_progress' table ready.");
  } catch (err) {
    console.error("❌ Error creating 'user_course_progress' table:", err.message);
  }
};


export const createUserArticleReadsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_article_reads (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL REFERENCES users(email),
        article_slug TEXT NOT NULL,
        read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email, article_slug)
      );
    `);
    console.log("✅ 'user_article_reads' table ready.");
  } catch (err) {
    console.error("❌ Error creating 'user_article_reads' table:", err.message);
  }
};

