import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import './PracticeLog.css';

export default function PracticeLog() {
  const { practiceName } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const gmail = currentUser?.email || '';
  const [logEntries, setLogEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [timeRange, setTimeRange] = useState('all');

  const getPracticePath = (name) => {
    const map = {
      'Chord Type Practice': '/chord-type',
      'Degree Notice Training': '/degree-notice',
      'Difference Practice': '/difference',
      'Harmony Training': '/harmony',
      'Interval Training': '/interval-practice',
      'Learn Piano': '/learn-piano',
      'Learn Piano Chords': '/learn-piano-chords',
      'Real Melody Training': '/real-melody',
      'Which Higher Note': '/which-higher-note',
      'Harmonic Dictation': '/harmonic',
      'Melodic Dictation': '/melodic-dictation',
      'Chords for Melody': '/chords-for-melody',
    };
    return map[name] || '/';
  };

  useEffect(() => {
    const fetchLog = async () => {
      if (!gmail) return;

      const endpoint =
        practiceName === 'Chords for Melody'
          ? 'http://localhost:5000/api/melody/log'
          : 'http://localhost:5000/api/practice/log';

      try {
        const res = await fetch(`${endpoint}?gmail=${gmail}&practiceName=${encodeURIComponent(practiceName)}`);
        const data = await res.json();
        setLogEntries(data);
      } catch (err) {
        console.error('Error fetching log:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [gmail, practiceName]);

  const formatSessionTime = (seconds) => {
    if (seconds == null) return '--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const estimateTime = (avg, tries) => {
    if (!avg || !tries) return null;
    return Math.round(avg * tries);
  };

  const calculateTotalSessionTime = (entries) => {
    let totalSeconds = 0;
    for (const entry of entries) {
      if (entry.session_time != null) {
        totalSeconds += entry.session_time;
      } else if (entry.avg_time_per_answer && entry.tries) {
        const est = estimateTime(entry.avg_time_per_answer, entry.tries);
        if (est) totalSeconds += est;
      }
    }
    return formatSessionTime(totalSeconds);
  };

  const isInTimeRange = (entryDate, range) => {
    const now = new Date();
    const entry = new Date(entryDate);
    const ms = {
      '1y': 365 * 24 * 60 * 60 * 1000,
      '1m': 30 * 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
      '3d': 3 * 24 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '12h': 12 * 60 * 60 * 1000,
      '1h': 60 * 60 * 1000,
    };
    if (range === 'all') return true;
    return now - entry <= ms[range];
  };

  const filteredEntries = logEntries.filter((entry) => isInTimeRange(entry.date, timeRange));

  const sortedEntries = filteredEntries.slice().sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'rank') {
      return b.rank - a.rank;
    } else if (sortBy === 'avgTime') {
      return (a.avg_time_per_answer || Infinity) - (b.avg_time_per_answer || Infinity);
    } else if (sortBy === 'correct') {
      return b.correct - a.correct;
    }
    return 0;
  });

  const totalPracticeTime = calculateTotalSessionTime(sortedEntries);

  return (
    <div className="practice-log-wrapper">
      <div className="practice-log-fixed-navbar">
        <Navbar />
      </div>

      <div className="practice-log-scroll-container">
        <div style={{ height: '60px' }} />

        <div className="practice-log-content">
          <h1 className="practice-log-title">{practiceName} – Practice Log</h1>

          <div className="log-actions-top">
            <button className="log-button" onClick={() => navigate('/profile')}>
              ← Back to Profile
            </button>
            <a className="log-button" href={getPracticePath(practiceName)}>
              ▶ Play Again
            </a>
          </div>

          <div className="log-sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              className="log-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">📅 Date (Newest)</option>
              <option value="rank">🏆 Rank (Highest)</option>
              <option value="avgTime">⚡ Avg Time (Fastest)</option>
              <option value="correct">✅ Correct (Most)</option>
            </select>

            <label htmlFor="range-select">Range:</label>
            <select
              id="range-select"
              className="log-sort-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">🌍 All Time</option>
              <option value="1y">📆 Last Year</option>
              <option value="1m">🗓️ Last Month</option>
              <option value="1w">📅 Last 7 Days</option>
              <option value="3d">📆 Last 3 Days</option>
              <option value="1d">🕒 Last Day</option>
              <option value="12h">⏱️ Last 12 Hours</option>
              <option value="1h">⏰ Last Hour</option>
            </select>

            <div className="log-total-session-time">
              🧾 Total Practice Time: <strong>{totalPracticeTime}</strong>
            </div>
          </div>

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : sortedEntries.length === 0 ? (
            <p className="empty-text">No practice history found.</p>
          ) : (
            <ul className="log-entry-list">
              {sortedEntries.map((entry, i) => (
                <li key={i} className="log-entry">
                  <div className="log-entry-header">
                    <span className="entry-number">#{sortedEntries.length - i}</span>
                    <span className="entry-date">{new Date(entry.date).toLocaleString()}</span>
                  </div>
                  <div className="log-entry-body">
                    <div className="log-entry-row">✅ Correct: <strong>{entry.correct}</strong></div>
                    <div className="log-entry-row">❌ Wrong: <strong>{entry.wrong}</strong></div>
                    <div className="log-entry-row">🔁 Tries: <strong>{entry.tries}</strong></div>
                    <div className="log-entry-row">🎯 Level: <strong>{entry.level}</strong></div>
                    <div className="log-entry-row">🏆 Rank: <strong>{entry.rank}</strong> / {entry.max_rank}</div>
                    <div className="log-entry-row">
                      ⚡ Avg Time: <strong>{entry.avg_time_per_answer?.toFixed(2)}s</strong>
                    </div>
                    <div className="log-entry-row">
                      🕒 Session Time: <strong>
                        {entry.session_time != null
                          ? formatSessionTime(entry.session_time)
                          : estimateTime(entry.avg_time_per_answer, entry.tries) != null
                          ? formatSessionTime(estimateTime(entry.avg_time_per_answer, entry.tries))
                          : '--'}
                      </strong>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
