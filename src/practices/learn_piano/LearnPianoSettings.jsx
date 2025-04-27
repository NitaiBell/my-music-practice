import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearnPianoKeyboard from './LearnPianoKeyboard';
import './LearnPianoSettings.css';

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

const DEFAULT_DEGREES = [0, 2, 4]; // Do Mi Sol

export default function LearnPianoSettings() {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedNotes, setSelectedNotes] = useState(getScaleDegrees('C', DEFAULT_DEGREES));
  const [rounds, setRounds] = useState(10);
  const [sequenceLength, setSequenceLength] = useState(3);
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

  const startPractice = () => {
    navigate('/learn-piano/play', {
      state: {
        selectedScale,
        selectedNotes,
        rounds,
        sequenceLength,
      },
    });
  };

  return (
    <div className="learn_piano_settings-container">
      <div className="learn_piano_settings-content-wrapper">
        <nav className="learn_piano_settings-navbar">
          <div className="learn_piano_settings-scale-note-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="learn_piano_settings-dropdown">
              <button className="learn_piano_settings-dropbtn">🎼 Scale</button>
              <div className="learn_piano_settings-dropdown-content">
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

            <div className="learn_piano_settings-dropdown">
              <button className="learn_piano_settings-dropbtn">🎵 Notes</button>
              <div className="learn_piano_settings-dropdown-content">
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

            <div className="learn_piano_settings-sequence-group">
              <label htmlFor="sequenceLength" className="learn_piano_settings-sequence-label">🔢 Sequence</label>
              <input
                id="sequenceLength"
                type="number"
                min="1"
                max="10"
                value={sequenceLength}
                onChange={(e) => setSequenceLength(Number(e.target.value))}
                className="learn_piano_settings-sequence-input"
              />
            </div>
          </div>

          <div className="learn_piano_settings-controls">
            <div className="learn_piano_settings-rounds-group">
              <label htmlFor="rounds-input" className="learn_piano_settings-rounds-label">Rounds:</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="50"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="learn_piano_settings-rounds-input"
              />
            </div>

            <button className="learn_piano_settings-start-btn" onClick={startPractice}>
              🎹 Start Practice
            </button>
          </div>
        </nav>

        <div className="learn_piano_settings-floating-message">
          🎯 Choose your scale, notes, sequence length and rounds, then click “Start Practice”!
        </div>

        <div className="learn_piano_settings-summary">
          <p><strong>{rounds}</strong> rounds | Sequence length: <strong>{sequenceLength}</strong></p>
          <p>Scale: <strong>{selectedScale}</strong> | Notes: <strong>{selectedNotes.map(n => displayNote(n, selectedScale)).join(', ')}</strong></p>
        </div>
      </div>

      <div className="learn_piano_settings-keyboard-wrapper">
        <LearnPianoKeyboard
          ref={keyboardRef}
          octaves={[3, 4, 5]}
          tonic={selectedScale}
        />
      </div>
    </div>
  );
}
