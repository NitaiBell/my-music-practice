import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RealMelodyKeyboardView from './RealMelodyKeyboardView';
import './RealMelodySettings.css';

// ✅ Enharmonic normalization
const normalizeNote = (note) => {
  const enharmonics = {
    Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
    'C#': 'Cs', 'D#': 'Ds', 'F#': 'Fs', 'G#': 'Gs', 'A#': 'As',
  };
  return enharmonics[note] || note;
};

// ✅ Keys that prefer flat notation
const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

// ✅ Display note per scale context
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
  F: ['F', 'G', 'A', 'As', 'C', 'D', 'E'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'Fs'],
};

const DEFAULT_DEGREES = [0, 2, 4];

export default function RealMelodySettings() {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedNotes, setSelectedNotes] = useState(getScaleDegrees('C', DEFAULT_DEGREES));
  const [rounds, setRounds] = useState(15);
  const [octaves, setOctaves] = useState([3, 4]);
  const [normalMode, setNormalMode] = useState(true); // ✅ renamed and default true
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

  const toggleOctave = (oct) => {
    if (oct === 3) return;
    if (octaves.includes(oct)) {
      setOctaves((prev) => prev.filter((o) => o !== oct));
    } else {
      setOctaves((prev) => [...prev, oct]);
      keyboardRef.current?.playNote(`${tonic}${oct}`);
    }
  };

  const startPractice = () => {
    navigate('/real-melody', {
      state: { selectedScale, selectedNotes, rounds, octaves, normalMode },
    });
  };

  return (
    <div className="real-melody-settings-container">
      <div className="real-melody-content-wrapper">
        <nav className="real-melody-navbar">
          <div className="real-melody-scale-note-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 🎼 Scale Dropdown */}
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

            {/* 🎵 Notes Dropdown */}
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

            {/* ✅ Normal Mode Button (formerly Beginner) */}
            <button
              className={`real-melody-beginner-toggle ${normalMode ? 'on' : 'off'}`}
              title="Normal Mode: Any octave is accepted. Pro Mode: exact octave match required."
              onClick={() => setNormalMode((m) => !m)}
            >
              {normalMode ? '✅ Normal Mode' : 'Pro Mode'}
            </button>
          </div>

          <div className="real-melody-controls">
            {/* 🔢 Rounds Input */}
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

            {/* 🔢 Octaves Dropdown */}
            <div className="real-melody-dropdown">
              <button className="real-melody-dropbtn">🔢 Octaves</button>
              <div className="real-melody-dropdown-content">
                {[2, 3, 4, 5, 6].map((o) => (
                  <label key={o}>
                    <input
                      type="checkbox"
                      checked={octaves.includes(o)}
                      disabled={o === 3}
                      onChange={() => toggleOctave(o)}
                    />
                    Octave {o}
                  </label>
                ))}
              </div>
            </div>

            {/* ▶️ Start Button */}
            <button className="real-melody-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="real-melody-floating-setup-message">
          🎯 Set your scale, notes, rounds & octaves, then click “Start Practice”!
        </div>

        <div className="real-melody-summary">
          <p><strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong></p>
          <p>Notes: <strong>{selectedNotes.map(n => displayNote(n, selectedScale)).join(', ')}</strong></p>
          <p>Octaves: <strong>{octaves.join(', ')}</strong></p>
          <p>Mode: <strong>{normalMode ? 'Normal' : 'Pro'}</strong></p>
        </div>
      </div>

      <div className="real-melody-keyboard-wrapper">
        <RealMelodyKeyboardView
          ref={keyboardRef}
          highlightNotes={selectedNotes}
          octaves={normalMode ? [3, 4, 5] : octaves}
        />
      </div>
    </div>
  );
}
