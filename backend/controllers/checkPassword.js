import { pool } from '../db.js';

export const checkOneTimePassword = async (req, res) => {
  const { password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM one_time_passwords WHERE password = $1 AND used = false',
      [password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid or already used password' });
    }

    const otp = result.rows[0];

    // Mark password as used
    await pool.query(
      'UPDATE one_time_passwords SET used = true, used_at = NOW() WHERE id = $1',
      [otp.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error checking password:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
