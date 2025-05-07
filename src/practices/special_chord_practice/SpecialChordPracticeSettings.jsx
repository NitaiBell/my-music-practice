// src/practices/special_chord_practice/SpecialChordPracticeSettings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecialChordPracticeKeyboard from './SpecialChordPracticeKeyboard';
import {
  majorScales,
  scaleChordsMap,
  specialChordsByScale,
  chordDisplayMap,
  chordNoteMap,
} from './specialChordData';
import './SpecialChordPracticeSettings.css';

const SpecialChordPracticeSettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedChordLabel, setSelectedChordLabel] = useState('');
  const [rounds, setRounds] = useState(10);
  const [notesToFlash, setNotesToFlash] = useState([]);
  const navigate = useNavigate();

  const handleChordSelect = (label) => {
    setSelectedChordLabel((prev) => (prev === label ? '' : label));
  };

  const playNote = (note) => {
    const audio = new Audio(`/clean_cut_notes/${encodeURIComponent(note + '.wav')}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const playChord = (labelOrChord) => {
    const chord = chordDisplayMap[labelOrChord] || labelOrChord;
    const notes = chordNoteMap[chord];
    if (!notes) {
      console.warn(`Missing notes for chord: ${chord}`);
      return;
    }
    setNotesToFlash(notes);
    notes.forEach(playNote);
  };

  const startPractice = () => {
    const chord = chordDisplayMap[selectedChordLabel] || selectedChordLabel;
    if (!chord) return alert('Please select a special chord first.');
    navigate('/special_chord/play', {
      state: {
        selectedScale,
        selectedChord: chord,
        selectedChordLabel, // <-- ADD THIS LINE
        rounds,
      },
    });
  };

  const specialChords = specialChordsByScale[selectedScale] || [];
  const scaleChords = scaleChordsMap[selectedScale] || [];

  return (
    <div className="special_chord_settings-container">
      <div className="special_chord_settings-wrapper">
        <nav className="special_chord_settings-navbar">
          <div className="special_chord_settings-dropdowns">
            <div className="special_chord_settings-dropdown">
              <button className="special_chord_settings-dropbtn">🎼 Scale</button>
              <div className="special_chord_settings-dropdown-content">
                {majorScales.map((scale) => (
                  <label key={scale}>
                    <input
                      type="radio"
                      name="scale"
                      checked={selectedScale === scale}
                      onChange={() => {
                        setSelectedScale(scale);
                        setSelectedChordLabel('');
                      }}
                    />
                    {scale} Major
                  </label>
                ))}
              </div>
            </div>

            <div className="special_chord_settings-dropdown">
              <button className="special_chord_settings-dropbtn">🎯 Special Chord</button>
              <div className="special_chord_settings-dropdown-content">
                {specialChords.map((label) => (
                  <label key={label}>
                    <input
                      type="radio"
                      name="special-chord"
                      checked={selectedChordLabel === label}
                      onChange={() => handleChordSelect(label)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="special_chord_settings-controls">
            <div className="special_chord_settings-rounds">
              <label htmlFor="rounds">Rounds:</label>
              <input
                id="rounds"
                type="number"
                min="1"
                max="20"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
              />
            </div>
            <button className="special_chord_settings-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="special_chord_settings-message">
          🎶 Select your scale and one special chord to practice!
        </div>

        <div className="special_chord_settings-summary">
          <p><strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong></p>
          <p>Chord: <strong>{selectedChordLabel || 'None selected'}</strong></p>
        </div>

        <div className="special_chord_settings-chord-row">
          <div className="special_chord_settings-section horizontal">
            <h3>🎵 Scale Chords:</h3>
            <div className="special_chord_settings-chord-grid">
              {scaleChords.map((chord) => (
                <button
                  key={chord}
                  className="special_chord_settings-chord-btn"
                  onClick={() => playChord(chord)}
                >
                  {chord}
                </button>
              ))}
            </div>
          </div>

          {selectedChordLabel && (
            <div className="special_chord_settings-section horizontal">
              <h3>🎯 Special Chord:</h3>
              <div className="special_chord_settings-chord-grid">
                <button
                  className="special_chord_settings-chord-btn"
                  onClick={() => playChord(selectedChordLabel)}
                >
                  🔊 {selectedChordLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="special_chord_settings-keyboard">
        <SpecialChordPracticeKeyboard flashNotes={notesToFlash} />
      </div>
    </div>
  );
};

export default SpecialChordPracticeSettings;
