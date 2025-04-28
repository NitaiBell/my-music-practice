// src/practices/which_higher_note/WhichHigherNoteSettings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WhichHigherNoteSettings.css';

export default function WhichHigherNoteSettings() {
  const [rounds, setRounds] = useState(20);
  const [octaves, setOctaves] = useState([3, 4]);
  const navigate = useNavigate();

  const toggleOctave = (octave) => {
    if (octaves.includes(octave)) {
      if (octaves.length > 1) {
        setOctaves((prev) => prev.filter((o) => o !== octave));
      }
    } else {
      setOctaves((prev) => [...prev, octave].sort());
    }
  };

  const startPractice = () => {
    navigate('/which-higher-note/play', {
      state: {
        rounds,
        octaves,
      },
    });
  };

  return (
    <div className="which_higher_settings-container">
      <div className="which_higher_content-wrapper">
        <nav className="which_higher-navbar">
          <div className="which_higher-controls">
            <div className="which_higher-rounds-group">
              <label htmlFor="rounds-input" className="which_higher-rounds-label">Rounds:</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="50"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="which_higher-rounds-input"
              />
            </div>

            <div className="which_higher-octaves-group">
              <label className="which_higher-octaves-label">Octaves:</label>
              <div className="which_higher-octaves-buttons">
                {[2, 3, 4, 5, 6].map((octave) => (
                  <button
                    key={octave}
                    className={`which_higher-octave-btn ${octaves.includes(octave) ? 'selected' : ''}`}
                    onClick={() => toggleOctave(octave)}
                  >
                    {octave}
                  </button>
                ))}
              </div>
            </div>

            <button className="which_higher-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="which_higher-floating-setup-message">
          🎯 Set rounds and octaves, then click “Start Practice”!
        </div>

        <div className="which_higher-summary">
          <p><strong>{rounds}</strong> rounds | Octaves: <strong>{octaves.join(', ')}</strong></p>
        </div>
      </div>
    </div>
  );
}
