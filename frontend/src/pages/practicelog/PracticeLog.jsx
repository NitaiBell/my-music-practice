// src/pages/practice/PracticeLog.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './PracticeLog.css';

export default function PracticeLog() {
  const { practiceName } = useParams();
  const navigate = useNavigate();
  const [logEntries, setLogEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const gmail = user?.email || '';

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

  return (
    <div className="practice-log-wrapper">
      {/* ✅ Fixed Navbar */}
      <div className="practice-log-fixed-navbar">
        <Navbar />
      </div>

      {/* 🔄 Scrollable Content */}
      <div className="practice-log-scroll-container">
        <div style={{ height: '60px' }} /> {/* Spacer below navbar */}

        <div className="practice-log-content">
          <h1 className="practice-log-title">{practiceName} – Practice Log</h1>

          {/* 🎯 Top Action Buttons */}
          <div className="log-actions-top">
            <button className="log-button" onClick={() => navigate('/profile')}>
              ← Back to Profile
            </button>
            <a className="log-button" href={getPracticePath(practiceName)}>
              ▶ Play Again
            </a>
          </div>

          {/* 📜 Log Entries */}
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : logEntries.length === 0 ? (
            <p className="empty-text">No practice history found.</p>
          ) : (
<ul className="log-entry-list">
  {logEntries
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((entry, i, sorted) => (
      <li key={i} className="log-entry">
        <div className="log-entry-header">
          <span className="entry-number">#{sorted.length - i}</span>
          <span className="entry-date">{new Date(entry.date).toLocaleString()}</span>
        </div>
        <div className="log-entry-body">
          <div className="log-entry-row">✅ Correct: <strong>{entry.correct}</strong></div>
          <div className="log-entry-row">❌ Wrong: <strong>{entry.wrong}</strong></div>
          <div className="log-entry-row">🔁 Tries: <strong>{entry.tries}</strong></div>
          <div className="log-entry-row">🎯 Level: <strong>{entry.level}</strong></div>
          <div className="log-entry-row">🏆 Rank: <strong>{entry.rank}</strong> / {entry.max_rank}</div>
          <div className="log-entry-row">⚡ Avg Time: <strong>{entry.avg_time_per_answer?.toFixed(2)}s</strong></div>
        </div>
      </li>
    ))}
</ul>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
