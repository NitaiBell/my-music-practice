// src/practices/difference_practice/DifferencePracticeSettings.jsx

import React, { useState } from 'react';
import './DifferencePracticeSettings.css';
import DifferencePracticeKeyboardView from './DifferencePracticeKeyboardView';
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

const DifferencePracticeSettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedNotes, setSelectedNotes] = useState(notesByScale['C']);
  const [rounds, setRounds] = useState(15);
  const [sequenceLength, setSequenceLength] = useState(4);
  const [flashNotes, setFlashNotes] = useState([]);
  const navigate = useNavigate();

  const toggleNote = (note) => {
    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const startPractice = () => {
    navigate('/difference/play', {
      state: {
        selectedScale,
        selectedNotes,
        rounds,
        sequenceLength,
      },
    });
  };

  const playNote = (note) => {
    const normalized = note.replace('#', 's').replace('b', 'f'); // handle sharp/flat filenames if needed
    const encoded = encodeURIComponent(`${normalized}3.wav`);
    const audio = new Audio(`/clean_cut_notes/${encoded}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const handleScaleChange = (scale) => {
    setSelectedScale(scale);
    setSelectedNotes(notesByScale[scale]);
  };

  const numButtons = sequenceLength;
  const rows = numButtons > 8 ? 2 : 1;
  const columns = Math.ceil(numButtons / rows || 1);

  return (
    <div className="difference_practice_settings-container">
      <div className="difference_practice_settings-content-wrapper">
        <nav className="difference_practice_settings-navbar">
          <div className="difference_practice_settings-dropdown-group">
            <div className="difference_practice_settings-dropdown">
              <button className="difference_practice_settings-dropbtn">🎼 Scale</button>
              <div className="difference_practice_settings-dropdown-content">
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

            <div className="difference_practice_settings-dropdown">
              <button className="difference_practice_settings-dropbtn">🎵 Notes</button>
              <div className="difference_practice_settings-dropdown-content">
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

          <div className="difference_practice_settings-controls">
            <div className="rounds-group">
              <label htmlFor="rounds-input" className="rounds-label">Rounds:</label>
              <input
  id="rounds-input"
  type="number"
  value={rounds}
  onChange={(e) => {
    const val = Number(e.target.value);
    setRounds(val); // no clamping
  }}
  className="difference_practice_settings-rounds-input"
/>
            </div>

            <div className="rounds-group">
              <label htmlFor="sequence-length-input" className="rounds-label">Notes in Sequence:</label>
              <input
  id="sequence-length-input"
  type="number"
  value={sequenceLength}
  onChange={(e) => {
    const val = Number(e.target.value);
    setSequenceLength(val); // no clamping
  }}
  className="difference_practice_settings-rounds-input"
/>

            </div>

            <button className="difference_practice_settings-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="difference_practice_settings-floating-message">
          🎯 Choose your scale and notes, set how long the sequence should be, and click "Start Practice"!
        </div>

        <div className="difference_practice_settings-summary">
  <p>
    <strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong>
  </p>
  <p>Notes: <strong>{selectedNotes.join(', ')}</strong></p>
  <p>Sequence Length: <strong>{sequenceLength}</strong> notes</p>
  <p>Level: <strong>{sequenceLength}</strong> (based on sequence length)</p>
</div>


        <div
          className="difference_practice_settings-sequence-buttons"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {Array.from({ length: sequenceLength }, (_, index) => (
            <button
              key={index}
              className="difference_practice_settings-sequence-btn"
              onClick={() => {}}
            >
              Note {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="difference_practice_settings-keyboard-wrapper">
        <DifferencePracticeKeyboardView flashNotes={flashNotes} />
      </div>
    </div>
  );
};

export default DifferencePracticeSettings;
