import { pool } from '../db.js';

// Save a practice result
export const savePractice = async (req, res) => {
  const data = req.body;
  console.log('📥 Incoming practice log:', data); // ✅ Log input

  const {
    gmail,
    practiceName,
    correct,
    wrong,
    tries,
    level,
    rank,
    maxRank,
    rightScore,
    tryScore,
    speedScore,
    avgTimePerAnswer,
    date,
  } = data;

  try {
    await pool.query(
      `INSERT INTO user_practice_log (
        gmail, practice_name, correct, wrong, tries, level, rank, max_rank,
        right_score, try_score, speed_score, avg_time_per_answer, date
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        gmail,
        practiceName,
        correct,
        wrong,
        tries,
        level,
        rank,
        maxRank,
        rightScore,
        tryScore,
        speedScore,
        avgTimePerAnswer,
        date,
      ]
    );
    console.log('✅ Practice inserted successfully');
    res.status(200).json({ message: 'Practice saved successfully' });
  } catch (err) {
    console.error('❌ Error saving practice:', err.message);
    res.status(500).json({ error: 'Failed to save practice' });
  }
};

// Fetch last and highest rank scores
export const getPracticeStats = async (req, res) => {
  const { gmail, practiceName } = req.query;

  try {
    const result = await pool.query(
      `SELECT rank, level, date
       FROM user_practice_log
       WHERE gmail = $1 AND practice_name = $2
       ORDER BY date DESC`,
      [gmail, practiceName]
    );

    if (result.rows.length === 0) {
      return res.json({
        highestScore: 0,
        highestLevel: 0,
        lastScore: 0,
        lastLevel: 0,
      });
    }

    const highest = result.rows.reduce((best, row) => {
      const rowScore = row.rank + row.level * 0.5;
      const bestScore = best.rank + best.level * 0.5;
      return rowScore > bestScore ? row : best;
    });

    const last = result.rows[0];

    return res.json({
      highestScore: highest.rank,
      highestLevel: highest.level,
      lastScore: last.rank,
      lastLevel: last.level,
    });

  } catch (err) {
    console.error('❌ Failed to fetch stats:', err.message);
    res.status(500).json({ error: 'Failed to get practice stats' });
  }
};

export const getPracticeLog = async (req, res) => {
  const { gmail, practiceName } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM user_practice_log
       WHERE gmail = $1 AND practice_name = $2
       ORDER BY date DESC
       LIMIT 120`, // optional limit
      [gmail, practiceName]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Failed to fetch full log:', err.message);
    res.status(500).json({ error: 'Failed to get practice log' });
  }
};