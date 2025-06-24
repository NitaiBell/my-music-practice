import { pool } from '../db.js';

// POST /api/teacher-student/propose-link
export const proposeLink = async (req, res) => {
  const { initiatorEmail, targetEmail, role } = req.body;

  if (!initiatorEmail || !targetEmail || !role) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const teacherEmail = role === 'teacher' ? initiatorEmail : targetEmail;
  const studentEmail = role === 'teacher' ? targetEmail : initiatorEmail;

  try {
    const existing = await pool.query(
      `SELECT * FROM teacher_student_links 
       WHERE teacher_email = $1 AND student_email = $2`,
      [teacherEmail, studentEmail]
    );

    if (existing.rows.length > 0) {
      const alreadyConfirmed = existing.rows[0].confirmed;
      if (alreadyConfirmed) {
        return res.json({ message: '✅ Already confirmed' });
      }

      await pool.query(
        `UPDATE teacher_student_links SET confirmed = TRUE 
         WHERE teacher_email = $1 AND student_email = $2`,
        [teacherEmail, studentEmail]
      );
      return res.json({ message: '✅ Link confirmed' });
    }

    await pool.query(
      `INSERT INTO teacher_student_links 
       (teacher_email, student_email, confirmed)
       VALUES ($1, $2, FALSE)`,
      [teacherEmail, studentEmail]
    );

    res.json({ message: '⏳ Link proposed, waiting for other party to confirm' });

  } catch (err) {
    console.error('❌ Error proposing link:', err.message);
    res.status(500).json({ error: 'Failed to propose teacher-student link' });
  }
};

// GET /api/teacher-student/students?teacherEmail=...
export const getStudentsForTeacher = async (req, res) => {
    const { teacherEmail } = req.query;
  
    if (!teacherEmail) {
      return res.status(400).json({ error: 'Missing teacherEmail' });
    }
  
    try {
      const result = await pool.query(
        `SELECT u.name, l.student_email
         FROM teacher_student_links l
         JOIN users u ON l.student_email = u.email
         WHERE l.teacher_email = $1 AND l.confirmed = TRUE`,
        [teacherEmail]
      );
  
      res.json(result.rows.map(row => ({
        name: row.name,
        email: row.student_email,
      })));
    } catch (err) {
      console.error('❌ Error fetching students:', err.message);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  };

// GET /api/teacher-student/teachers?studentEmail=...
export const getTeachersForStudent = async (req, res) => {
  const { studentEmail } = req.query;

  if (!studentEmail) {
    return res.status(400).json({ error: 'Missing studentEmail' });
  }

  try {
    const result = await pool.query(
      `SELECT teacher_email FROM teacher_student_links 
       WHERE student_email = $1 AND confirmed = TRUE`,
      [studentEmail]
    );

    res.json(result.rows.map(row => row.teacher_email));
  } catch (err) {
    console.error('❌ Error fetching teachers:', err.message);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
};



// GET /api/teacher-student/teacher?studentEmail=...
export const getAllTeachersForStudent = async (req, res) => {
    const { studentEmail } = req.query;
  
    if (!studentEmail) {
      return res.status(400).json({ error: 'Missing studentEmail' });
    }
  
    try {
      const result = await pool.query(
        `SELECT u.name, u.email
         FROM teacher_student_links l
         JOIN users u ON l.teacher_email = u.email
         WHERE l.student_email = $1 AND l.confirmed = TRUE`,
        [studentEmail]
      );
  
      res.json(result.rows); // return all matched rows
    } catch (err) {
      console.error('❌ Error fetching linked teachers:', err.message);
      res.status(500).json({ error: 'Failed to fetch linked teachers' });
    }
  };
  