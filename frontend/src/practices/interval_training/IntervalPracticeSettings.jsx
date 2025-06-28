import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntervalPracticeSettings.css';
import IntervalPracticeKeyboardView from "./IntervalPracticeKeyboardView";

const INTERVALS = [
  'Unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd',
  'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th',
  'Minor 7th', 'Major 7th', 'Octave'
];

const BASE_NOTES = [
  'C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'
];

const displayNoteName = (note) => {
  const map = {
    Cs: 'C♯', Ds: 'D♯', Fs: 'F♯', Gs: 'G♯', As: 'A♯',
    Db: 'D♭', Eb: 'E♭', Gb: 'G♭', Ab: 'A♭', Bb: 'B♭',
  };
  return map[note] || note;
};

export default function IntervalPracticeSettings() {
  const [selectedIntervals, setSelectedIntervals] = useState(INTERVALS);
  const [baseNotes, setBaseNotes] = useState(BASE_NOTES);
  const [rounds, setRounds] = useState(10);
  const [direction, setDirection] = useState('both');
  const keyboardRef = useRef();
  const navigate = useNavigate();
  const level = Math.max(3, Math.min(25, baseNotes.length + selectedIntervals.length));

  const toggleInterval = (interval) => {
    setSelectedIntervals((prev) =>
      prev.includes(interval)
        ? prev.filter((i) => i !== interval)
        : [...prev, interval]
    );
  };

  const toggleBaseNote = (note) => {
    setBaseNotes((prev) =>
      prev.includes(note)
        ? prev.filter((n) => n !== note)
        : [...prev, note]
    );
  };

  const startPractice = () => {
    navigate('/interval-practice/play', {
      state: {
        selectedIntervals,
        baseNotes,
        rounds,
        octaves: [3, 4],
        direction,
      },
    });
  };

  return (
    <div className="interval_training_settings-container">
      <div className="interval_training_settings-content-wrapper">
        <nav className="interval_training_settings-navbar">
          <div className="interval_training_settings-controls-group">
            <div className="interval_training_settings-dropdown">
              <button className="interval_training_settings-dropbtn">🎵 Intervals</button>
              <div className="interval_training_settings-dropdown-content">
                {INTERVALS.map((interval) => (
                  <label key={interval}>
                    <input
                      type="checkbox"
                      checked={selectedIntervals.includes(interval)}
                      onChange={() => toggleInterval(interval)}
                    />
                    {interval}
                  </label>
                ))}
              </div>
            </div>

            <div className="interval_training_settings-dropdown">
              <button className="interval_training_settings-dropbtn">🎯 First Notes</button>
              <div className="interval_training_settings-dropdown-content">
                {BASE_NOTES.map((note) => (
                  <label key={note}>
                    <input
                      type="checkbox"
                      checked={baseNotes.includes(note)}
                      onChange={() => toggleBaseNote(note)}
                    />
                    {displayNoteName(note)}
                  </label>
                ))}
              </div>
            </div>

            <div className="interval_training_settings-dropdown">
              <button className="interval_training_settings-dropbtn">↕️ Direction</button>
              <div className="interval_training_settings-dropdown-content">
                <label>
                  <input
                    type="radio"
                    name="direction"
                    checked={direction === 'ascending'}
                    onChange={() => setDirection('ascending')}
                  /> Ascending
                </label>
                <label>
                  <input
                    type="radio"
                    name="direction"
                    checked={direction === 'descending'}
                    onChange={() => setDirection('descending')}
                  /> Descending
                </label>
                <label>
                  <input
                    type="radio"
                    name="direction"
                    checked={direction === 'both'}
                    onChange={() => setDirection('both')}
                  /> Both
                </label>
              </div>
            </div>

            {/* 📘 Instructions Styled as Dropdown */}
            <div className="interval_training_settings-dropdown">
              <a
                href="/instructions/interval-practice"
                className="interval_training_settings-dropbtn"
                target="_blank"
                rel="noopener noreferrer"
              >
                📘 Instructions
              </a>
            </div>
          </div>

          <div className="interval_training_settings-right-controls">
            <div className="interval_training_settings-rounds-group">
              <label>Rounds:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
              />
            </div>

            <button className="interval_training_settings-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="interval_training_settings-floating-message">
          🎯 Choose intervals, first notes, direction, and rounds. Then click "Start Practice"!
        </div>

        <div className="interval_training_settings-summary">
          <p><strong>{rounds}</strong> rounds</p>
          <p>Intervals: <strong>{selectedIntervals.join(', ')}</strong></p>
          <p>First Notes: <strong>{baseNotes.map(displayNoteName).join(', ')}</strong></p>
          <p>Direction: <strong>{direction}</strong></p>
          <p>Octaves: <strong>3, 4</strong> (fixed)</p>
          <p>Level: <strong>{level}</strong></p>
        </div>
      </div>

      <div className="interval_training_settings-keyboard-wrapper">
        <IntervalPracticeKeyboardView
          ref={keyboardRef}
          highlightNotes={[]}
          octaves={[3, 4, 5]}
        />
      </div>
    </div>
  );
}
