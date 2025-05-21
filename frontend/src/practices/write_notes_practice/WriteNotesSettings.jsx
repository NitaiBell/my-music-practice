// src/practices/write_notes_practice/WriteNotesSettings.jsx

import React, { useState } from 'react';
import './WriteNotesSettings.css';
import { useNavigate } from 'react-router-dom';

const notesByScale = {
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  D: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  A: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  E: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  B: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
};

const WriteNotesSettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedNotes, setSelectedNotes] = useState(notesByScale['C']);
  const [rounds, setRounds] = useState(10);
  const [notesPerRound, setNotesPerRound] = useState(4);
  const navigate = useNavigate();

  const toggleNote = (note) => {
    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const startPractice = () => {
    navigate('/write-notes/play', {
      state: {
        selectedScale,
        selectedNotes,
        rounds,
        notesPerRound,
      },
    });
  };

  const handleScaleChange = (scale) => {
    setSelectedScale(scale);
    setSelectedNotes(notesByScale[scale]);
  };

  return (
    <div className="write_notes_settings-container">
      <div className="write_notes_settings-content-wrapper">
        <nav className="write_notes_settings-navbar">
          <div className="write_notes_settings-dropdown-group">
            <div className="write_notes_settings-dropdown">
              <button className="write_notes_settings-dropbtn">🎼 Scale</button>
              <div className="write_notes_settings-dropdown-content">
                {Object.keys(notesByScale).map((scale) => (
                  <label key={scale}>
                    <input
                      type="radio"
                      name="scale"
                      checked={selectedScale === scale}
                      onChange={() => handleScaleChange(scale)}
                    />
                    {scale} Major
                  </label>
                ))}
              </div>
            </div>

            <div className="write_notes_settings-dropdown">
              <button className="write_notes_settings-dropbtn">🎵 Notes</button>
              <div className="write_notes_settings-dropdown-content">
                {notesByScale[selectedScale].map((note) => (
                  <label key={note}>
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note)}
                      onChange={() => toggleNote(note)}
                    />
                    {note}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="write_notes_settings-controls">
            <div className="rounds-group">
              <label htmlFor="rounds-input" className="rounds-label">Rounds:</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="20"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="write_notes_settings-rounds-input"
              />
            </div>

            <div className="rounds-group">
              <label htmlFor="notes-per-round-input" className="rounds-label">Notes per Round:</label>
              <input
                id="notes-per-round-input"
                type="number"
                min="1"
                max="8"
                value={notesPerRound}
                onChange={(e) => setNotesPerRound(Number(e.target.value))}
                className="write_notes_settings-rounds-input"
              />
            </div>

            <button className="write_notes_settings-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="write_notes_settings-floating-message">
          📝 Choose your scale and notes, set how many notes you want to place per round, and click "Start Practice"!
        </div>

        <div className="write_notes_settings-summary">
          <p><strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong></p>
          <p>Notes: <strong>{selectedNotes.join(', ')}</strong></p>
          <p>Notes Per Round: <strong>{notesPerRound}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default WriteNotesSettings;
