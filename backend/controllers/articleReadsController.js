import { pool } from '../db.js';

export const markArticleAsRead = async (req, res) => {
  const { email, articleSlug } = req.body;

  try {
    await pool.query(
      `INSERT INTO user_article_reads (email, article_slug)
       VALUES ($1, $2)
       ON CONFLICT (email, article_slug) DO NOTHING`,
      [email, articleSlug]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReadArticles = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const result = await pool.query(
      `SELECT article_slug FROM user_article_reads WHERE email = $1`,
      [email]
    );

    const slugs = result.rows.map(row => row.article_slug);
    res.json(slugs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const unmarkArticleAsRead = async (req, res) => {
  const { email, articleSlug } = req.body;

  if (!email || !articleSlug) {
    return res.status(400).json({ error: 'Missing email or articleSlug' });
  }

  try {
    await pool.query(
      `DELETE FROM user_article_reads WHERE email = $1 AND article_slug = $2`,
      [email, articleSlug]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};