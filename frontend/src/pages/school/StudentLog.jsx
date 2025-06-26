// src/pages/school/StudentLog.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import '../practicelog/PracticeLog.css';

const BACKEND_URL = 'http://localhost:5000';

const StudentLog = () => {
  const { studentEmail } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [selectedPractice, setSelectedPractice] = useState('All');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/practice/log/all?gmail=${encodeURIComponent(studentEmail)}`
        );
        const allLogs = await res.json();
        setLogs(allLogs);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (studentEmail) fetchLogs();
  }, [studentEmail]);

  const practiceTypes = ['All', ...new Set(logs.map((log) => log.practice_name))];

  const filteredLogs =
    selectedPractice === 'All'
      ? logs
      : logs.filter((log) => log.practice_name === selectedPractice);

  const sortedLogs = filteredLogs.slice().sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'rank') return b.rank - a.rank;
    if (sortBy === 'avgTime')
      return (a.avg_time_per_answer || Infinity) - (b.avg_time_per_answer || Infinity);
    if (sortBy === 'correct') return b.correct - a.correct;
    return 0;
  });

  const formatSessionTime = (seconds) => {
    if (seconds == null) return '--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const estimateSessionTime = (avg, tries) => {
    if (!avg || !tries) return '--';
    const totalSeconds = Math.round(avg * tries);
    return formatSessionTime(totalSeconds);
  };

  return (
    <div className="practice-log-wrapper">
      <div className="practice-log-fixed-navbar">
        <Navbar />
      </div>

      <div className="practice-log-scroll-container">
        <div style={{ height: '60px' }} />

        <div className="practice-log-inner-wrapper">
          <div className="practice-log-content">
            <h1 className="practice-log-title">Practice Log for {studentEmail}</h1>

            {currentUser?.email && (
              <p className="practice-log-subtitle">
                Viewing as: <strong>{currentUser.email}</strong>
              </p>
            )}

            <div className="log-actions-top">
              <button className="log-button" onClick={() => navigate('/school')}>
                ← Back to School
              </button>
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
            </div>

            <div className="log-filter-controls">
              <label htmlFor="practice-filter">Practice:</label>
              <select
                id="practice-filter"
                className="log-sort-select"
                value={selectedPractice}
                onChange={(e) => setSelectedPractice(e.target.value)}
              >
                {practiceTypes.map((practice) => (
                  <option key={practice} value={practice}>
                    {practice}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className="loading-text">Loading...</p>
            ) : sortedLogs.length === 0 ? (
              <p className="empty-text">No practice history found.</p>
            ) : (
              <ul className="log-entry-list">
                {sortedLogs.map((entry, i) => (
                  <li key={i} className="log-entry">
                    <div className="log-entry-header">
                      <span className="entry-number">#{sortedLogs.length - i}</span>
                      <span className="entry-date">{new Date(entry.date).toLocaleString()}</span>
                    </div>
                    <div className="log-entry-body">
                      <div className="log-entry-row">
                        🎵 Practice: <strong>{entry.practice_name}</strong>
                      </div>
                      <div className="log-entry-row">
                        ✅ Correct: <strong>{entry.correct}</strong>
                      </div>
                      <div className="log-entry-row">
                        ❌ Wrong: <strong>{entry.wrong}</strong>
                      </div>
                      <div className="log-entry-row">
                        🔁 Tries: <strong>{entry.tries}</strong>
                      </div>
                      <div className="log-entry-row">
                        🎯 Level: <strong>{entry.level}</strong>
                      </div>
                      <div className="log-entry-row">
                        🏆 Rank: <strong>{entry.rank}</strong> / {entry.max_rank}
                      </div>
                      <div className="log-entry-row">
                        ⚡ Avg Time: <strong>{entry.avg_time_per_answer?.toFixed(2)}s</strong>
                      </div>
                      <div className="log-entry-row">
                        🕒 Session Time:{' '}
                        <strong>
                          {entry.session_time != null
                            ? formatSessionTime(entry.session_time)
                            : estimateSessionTime(entry.avg_time_per_answer, entry.tries)}
                        </strong>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default StudentLog;
