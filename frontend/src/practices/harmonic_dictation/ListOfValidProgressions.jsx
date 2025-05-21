// src/practices/harmonic_dictation/ListOfValidProgressions.jsx

import React from 'react';
import './ListOfValidProgressions.css';
import { progressionBank } from './ProgressionBank';

const degreeToLabel = (deg) => deg.replace(/7\/(.)/, '7/$1').replace(/\u00B0/g, '°');

const ListOfValidProgressions = () => {
  return (
    <div className="harmonic_dictation_valid-progressions-container">
      <h1 className="harmonic_dictation_valid-progressions-title">🎼 Valid Chord Progressions</h1>
      <p className="harmonic_dictation_valid-progressions-subtitle">
        These are the built-in progressions. To play, your selected chords must include all chords from at least one of them.
      </p>

      <div className="harmonic_dictation_valid-progressions-list">
        {Object.entries(progressionBank).map(([label, sequences]) => (
          <div key={label} className="harmonic_dictation_valid-progression-group">
            <h2 className="harmonic_dictation_valid-progression-heading">{label}</h2>
            <ul className="harmonic_dictation_valid-progression-sequences">
              {sequences.map((seq, idx) => (
                <li key={idx} className="harmonic_dictation_valid-progression-sequence">
                  {seq.map(degreeToLabel).join(' → ')}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="harmonic_dictation_valid-progressions-footer">
        <p>
          Go back to <a href="/harmonic">🎚 Settings</a> and choose chords that match one of the progressions above.
        </p>
      </div>
    </div>
  );
};

export default ListOfValidProgressions;
