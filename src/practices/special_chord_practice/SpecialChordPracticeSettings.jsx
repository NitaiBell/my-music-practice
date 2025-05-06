// src/practices/special_chord_practice/SpecialChordPracticeSettings.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SpecialChordPracticeKeyboard from './SpecialChordPracticeKeyboard';
import './SpecialChordPracticeSettings.css';

const majorScales = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const scaleChordsMap = {
  C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
  D: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
  E: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
  F: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
  G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
  A: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
  B: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
};

const specialChordsByScale = {
  C: ['♯III (E)', 'V7/vi (E7)', 'V7/ii (A7)', 'iv (Fm)', '♭III (E♭)', ' (A/Amin)', '♭VII (B♭)', 'V/iii (C♯)', 'V/V (D)', 'V7/V (D7)'],
};

const chordDisplayMap = {
  '♯III (E)': 'E',
  'V7/vi (E7)': 'E7',
  'V7/ii (A7)': 'A7',
  'iv (Fm)': 'Fm',
  '♭III (E♭)': 'E♭',
  ' (A/Amin)': 'A',
  '♭VII (B♭)': 'B♭',
  'V/iii (C♯)': 'Cs',
  'V/V (D)': 'D',
  'V7/V (D7)': 'D7',
};

const chordNoteMap = {
  C: ['C3', 'E3', 'G3'],
  D: ['D3', 'Fs3', 'A3'],
  Em: ['E3', 'G3', 'B3'],
  F: ['F3', 'A3', 'C4'],
  G: ['G3', 'B3', 'D4'],
  Am: ['A3', 'C4', 'E4'],
  Bdim: ['B3', 'D4', 'F4'],
  Dm: ['D3', 'F3', 'A3'],
  Fm: ['F3', 'Gs3', 'C4'],
  'E♭': ['Ds3', 'G3', 'As3'],
  'B♭': ['As2', 'D3', 'F3'],
  E7: ['E3', 'Gs3', 'B3', 'D4'],
  A7: ['A3', 'Cs4', 'E4', 'G4'],
  D7: ['D3', 'Fs3', 'A3', 'C4'],
  E: ['E3', 'Gs3', 'B3'],
  A: ['A3', 'Cs4', 'E4'],
  B: ['B3', 'Ds4', 'Fs4'],
  Cs: ['Cs3', 'E3', 'Gs3'],
};

const SpecialChordPracticeSettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedChordLabel, setSelectedChordLabel] = useState('♯III (E)');
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
    const chord = chordDisplayMap[selectedChordLabel];
    if (!chord) return alert('Please select a special chord first.');
    navigate('/special_chord/play', {
      state: {
        selectedScale,
        selectedChord: chord,
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
