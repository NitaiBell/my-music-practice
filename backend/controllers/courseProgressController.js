import { pool } from '../db.js';

export const saveCourseProgress = async (req, res) => {
    const { email, courseName, lessonIndex, isChecked } = req.body;
  
    try {
      const result = await pool.query(
        `SELECT completed_lessons FROM user_course_progress WHERE email = $1 AND course_name = $2`,
        [email, courseName]
      );
  
      let updatedLessons = {};
  
      if (result.rows.length > 0) {
        updatedLessons = result.rows[0].completed_lessons || {};
  
        if (isChecked) {
          updatedLessons[lessonIndex] = true;
        } else {
          delete updatedLessons[lessonIndex];
        }
  
        await pool.query(
          `UPDATE user_course_progress SET completed_lessons = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 AND course_name = $3`,
          [updatedLessons, email, courseName]
        );
      } else {
        if (isChecked) {
          updatedLessons[lessonIndex] = true;
          await pool.query(
            `INSERT INTO user_course_progress (email, course_name, completed_lessons) VALUES ($1, $2, $3)`,
            [email, courseName, updatedLessons]
          );
        }
        // if unchecking something not yet saved, do nothing
      }
  
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const getCourseProgress = async (req, res) => {
  const { email, courseName } = req.query;

  try {
    const result = await pool.query(
      `SELECT completed_lessons FROM user_course_progress WHERE email = $1 AND course_name = $2`,
      [email, courseName]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0].completed_lessons);
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllCourseProgress = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Missing email' });
  
    try {
      const result = await pool.query(
        `SELECT course_name, completed_lessons FROM user_course_progress WHERE email = $1`,
        [email]
      );
  
      const progressMap = {};
      result.rows.forEach(row => {
        progressMap[row.course_name] = row.completed_lessons || {};
      });
  
      console.log(`✅ Progress loaded for ${email}:`, progressMap); // ✅ debug output
      res.json(progressMap);
    } catch (err) {
      console.error('❌ Error fetching all progress:', err);
      res.status(500).json({ error: err.message });
    }
  };
  
