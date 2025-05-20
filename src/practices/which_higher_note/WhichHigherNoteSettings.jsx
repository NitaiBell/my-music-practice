import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WhichHigherNoteSettings.css';

export default function WhichHigherNoteSettings() {
  const [rounds, setRounds] = useState(20);
  const [octaves, setOctaves] = useState([3]); // default to one octave
  const navigate = useNavigate();

  const selectSingleOctave = (octave) => {
    setOctaves([octave]); // always replace with just one
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
      <div className="which_higher_settings-content-wrapper">
        <nav className="which_higher_settings-navbar">
          <div className="which_higher_settings-controls">
            <div className="which_higher_settings-rounds-group">
              <label htmlFor="rounds-input" className="which_higher_settings-rounds-label">Rounds:</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="50"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="which_higher_settings-rounds-input"
              />
            </div>

            <div className="which_higher_settings-octaves-group">
              <label className="which_higher_settings-octaves-label">Octaves:</label>
              <div className="which_higher_settings-octaves-buttons">
                {[2, 3, 4, 5, 6].map((octave) => (
                  <button
                    key={octave}
                    className={`which_higher_settings-octave-btn ${octaves.includes(octave) ? 'selected' : ''}`}
                    onClick={() => selectSingleOctave(octave)}
                  >
                    {octave}
                  </button>
                ))}
              </div>
            </div>

            <button className="which_higher_settings-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="which_higher_settings-floating-setup-message">
          🎯 Set rounds and octaves, then click “Start Practice”!
        </div>

        <div className="which_higher_settings-summary">
          <p><strong>{rounds}</strong> rounds | Octave: <strong>{octaves[0]}</strong></p>
        </div>
      </div>
    </div>
  );
}
