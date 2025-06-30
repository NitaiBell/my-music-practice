// src/practices/real_melody/RealMelodySettings.jsx

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RealMelodyKeyboardView from './RealMelodyKeyboardView';
import './RealMelodySettings.css';

const normalizeNote = (note) => {
  const enharmonics = {
    Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
    'C#': 'Cs', 'D#': 'Ds', 'F#': 'Fs', 'G#': 'Gs', 'A#': 'As',
  };
  return enharmonics[note] || note;
};

const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

const displayNote = (note, key) => {
  const preferFlat = flatKeys.includes(key);
  const displayMapSharps = {
    Cs: 'C♯', Ds: 'D♯', Fs: 'F♯', Gs: 'G♯', As: 'A♯',
  };
  const displayMapFlats = {
    Cs: 'D♭', Ds: 'E♭', Fs: 'G♭', Gs: 'A♭', As: 'B♭',
  };
  const naturalNames = {
    C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B',
  };

  return naturalNames[note] || (preferFlat ? displayMapFlats[note] : displayMapSharps[note]) || note;
};

const notesByScale = {
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  D: ['D', 'E', 'Fs', 'G', 'A', 'B', 'Cs'],
  E: ['E', 'Fs', 'Gs', 'A', 'B', 'Cs', 'Ds'],
  F: ['F', 'G', 'A', 'As', 'C', 'D', 'E'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'Fs'],
  A: ['A', 'B', 'Cs', 'D', 'E', 'Fs', 'Gs'],
  B: ['B', 'Cs', 'Ds', 'E', 'Fs', 'Gs', 'As'],
};

const fullChromaticNotes = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];

const DEFAULT_DEGREES = [0, 1, 2, 3, 4, 5, 6];

export default function RealMelodySettings() {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedNotes, setSelectedNotes] = useState(getScaleDegrees('C', DEFAULT_DEGREES));
  const [outScaleNotes, setOutScaleNotes] = useState([]);
  const [rounds, setRounds] = useState(30);
  const [normalMode, setNormalMode] = useState(true);
  const keyboardRef = useRef();
  const navigate = useNavigate();
  const tonic = selectedScale;

  function getScaleDegrees(scale, degreeIndices) {
    return degreeIndices.map((i) => notesByScale[scale][i]);
  }

  function getSelectedDegreeIndices(scale, selected) {
    return notesByScale[scale]
      .map((note, i) => (selected.includes(note) ? i : null))
      .filter((i) => i !== null);
  }

  const playNote3 = (note) => {
    const normalized = normalizeNote(note);
    keyboardRef.current?.playNote(`${normalized}3`);
  };

  const handleScaleChange = (newScale) => {
    const currentDegreeIndices = getSelectedDegreeIndices(selectedScale, selectedNotes);
    const newNotes = getScaleDegrees(newScale, currentDegreeIndices);
    setSelectedScale(newScale);
    setSelectedNotes(newNotes);
  };

  const toggleNote = (note) => {
    if (note === tonic) return;
    if (selectedNotes.includes(note)) {
      setSelectedNotes((prev) => prev.filter((n) => n !== note));
    } else {
      setSelectedNotes((prev) => [...prev, note]);
    }
    playNote3(note);
  };

  const toggleOutNote = (note) => {
    if (outScaleNotes.includes(note)) {
      setOutScaleNotes((prev) => prev.filter((n) => n !== note));
    } else {
      setOutScaleNotes((prev) => [...prev, note]);
    }
    playNote3(note);
  };

  const startPractice = () => {
    navigate('/real-melody/play', {
      state: {
        selectedScale,
        selectedNotes: [...selectedNotes, ...outScaleNotes],
        rounds,
        octaves: [3, 4, 5],
        normalMode,
      },
    });
  };

  const outNotesForScale = fullChromaticNotes.filter(n => !notesByScale[selectedScale].includes(n)).slice(0, 5);

  return (
    <div className="real-melody-settings-container">
      <div className="real-melody-content-wrapper">
        <nav className="real-melody-navbar">
          <div className="real-melody-scale-note-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="real-melody-dropdown">
              <button className="real-melody-dropbtn">🎼 Scale</button>
              <div className="real-melody-dropdown-content">
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

            <div className="real-melody-dropdown">
              <button className="real-melody-dropbtn">🎵 Notes</button>
              <div className="real-melody-dropdown-content">
                {notesByScale[selectedScale].map((note) => (
                  <label key={note}>
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note)}
                      disabled={note === tonic}
                      onChange={() => toggleNote(note)}
                    />
                    {displayNote(note, selectedScale)}
                  </label>
                ))}
              </div>
            </div>

            <div className="real-melody-dropdown">
              <button className="real-melody-dropbtn">🧩 Out-of-Scale</button>
              <div className="real-melody-dropdown-content">
                {outNotesForScale.map((note) => (
                  <label key={note}>
                    <input
                      type="checkbox"
                      checked={outScaleNotes.includes(note)}
                      onChange={() => toggleOutNote(note)}
                    />
                    {displayNote(note, selectedScale)}
                  </label>
                ))}
              </div>
            </div>

            <div className="real-melody-dropdown">
  <button
    className="real-melody-dropbtn"
    onClick={() => navigate('/instructions/real-melody')}
  >
    📘 Instructions
  </button>
</div>

            <button
              className={`real-melody-beginner-toggle ${normalMode ? 'on' : 'off'}`}
              title="Normal Mode: Any octave is accepted. Pro Mode: exact octave match required."
              onClick={() => setNormalMode((m) => !m)}
            >
              {normalMode ? '✅ Normal Mode' : 'Pro Mode'}
            </button>
          </div>

          <div className="real-melody-controls">
            <div className="real-melody-rounds-group">
              <label htmlFor="rounds-input" className="real-melody-rounds-label">Rounds:</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="50"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="real-melody-rounds-input"
              />
            </div>

            <button className="real-melody-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="real-melody-floating-setup-message">
          🎯 Set your scale, notes, and rounds — then click “Start Practice”!
        </div>

        <div className="real-melody-summary">
          <p><strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong></p>
          <p>Notes: <strong>{[...selectedNotes, ...outScaleNotes].map(n => displayNote(n, selectedScale)).join(', ')}</strong></p>
          <p>Octaves: <strong>3, 4, 5</strong></p>
          <p>Mode: <strong>{normalMode ? 'Normal' : 'Pro'}</strong></p>
        </div>
      </div>

      <div className="real-melody-keyboard-wrapper">
        <RealMelodyKeyboardView
          ref={keyboardRef}
          highlightNotes={[...selectedNotes, ...outScaleNotes]}
          octaves={[3, 4, 5]}
        />
      </div>
    </div>
  );
}
