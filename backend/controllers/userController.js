import { pool } from '../db.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { name, email, password, imageUrl } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, image_url) VALUES ($1, $2, $3, $4) RETURNING id, name, email, image_url',
      [name, email, hashed, imageUrl || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email' });
      }
  
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Return only safe fields
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        image_url: user.image_url,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  export const updateImage = async (req, res) => {
    const { userId, imageUrl } = req.body;
    try {
      const result = await pool.query(
        'UPDATE users SET image_url = $1 WHERE id = $2 RETURNING id, name, email, image_url',
        [imageUrl, userId]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  