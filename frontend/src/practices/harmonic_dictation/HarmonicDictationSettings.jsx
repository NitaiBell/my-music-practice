// src/practices/harmonic_dictation/HarmonicDictationSettings.jsx
import React, { useState } from 'react';
import './HarmonicDictationSettings.css';
import { useNavigate } from 'react-router-dom';
import HarmonicDictationKeyboardView from './HarmonicDictationKeyboardView';
import {
  majorScales,
  scaleChordsMap,
  extraChordsByScale,
  chordNoteMap,
} from '../harmony_training/HarmonyTrainingData';

const HarmonicDictationSettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedChords, setSelectedChords] = useState(scaleChordsMap['C']);
  const [outChords, setOutChords] = useState([]);
  const [rounds, setRounds] = useState(10);
  const [notesToFlash, setNotesToFlash] = useState([]);
  const navigate = useNavigate();

  const hasSpecialChords = outChords.length > 0;

  const toggleChord = (chord) => {
    if (hasSpecialChords) return; // prevent toggling when special chords are present
    setSelectedChords((prev) =>
      prev.includes(chord) ? prev.filter((c) => c !== chord) : [...prev, chord]
    );
  };

  const toggleOutChord = (chord) => {
    setOutChords((prev) => {
      const newOut = prev.includes(chord)
        ? prev.filter((c) => c !== chord)
        : [...prev, chord];

      const isSpecial = !scaleChordsMap[selectedScale].includes(chord);
      if (isSpecial && !prev.includes(chord)) {
        setSelectedChords(scaleChordsMap[selectedScale]); // auto-select scale chords
      }

      return newOut;
    });
  };

  const startPractice = () => {
    navigate('/harmonic/play', {
      state: {
        selectedScale,
        selectedChords: [...selectedChords, ...outChords],
        rounds,
      },
    });
  };

  const playNote = (note) => {
    const audio = new Audio(`/clean_cut_notes/${encodeURIComponent(note + '.wav')}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const playChord = (chord) => {
    const notes = chordNoteMap[chord];
    if (!notes) return;
    setNotesToFlash(notes);
    notes.forEach(playNote);
  };

  const handleScaleChange = (scale) => {
    setSelectedScale(scale);
    setSelectedChords(scaleChordsMap[scale]);
    setOutChords([]);
  };

  const allChords = [...selectedChords, ...outChords];
  const extraChords = extraChordsByScale[selectedScale] || [];
  const rows = allChords.length > 12 ? 2 : 1;
  const columns = Math.ceil(allChords.length / rows || 1);
  const chordCount = outChords.length > 0 ? 8 : allChords.length;
const level = outChords.length > 0 ? 8 : Math.max(2, Math.min(7, chordCount));

  return (
    <div className="harmony_dictation_settings-container">
      <div className="harmony_dictation_settings-content-wrapper">
      <nav className="harmony_dictation_settings-navbar">
  <div className="harmony_dictation_settings-dropdown">
    <button className="harmony_dictation_settings-dropbtn">🎼 Scale</button>
    <div className="harmony_dictation_settings-dropdown-content">
      {majorScales.map((scale) => (
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

  <div className="harmony_dictation_settings-dropdown">
    <button className="harmony_dictation_settings-dropbtn">🎶 Chords</button>
    <div className="harmony_dictation_settings-dropdown-content">
      {scaleChordsMap[selectedScale].map((chord) => (
        <label key={chord} style={{ opacity: hasSpecialChords ? 0.6 : 1 }}>
          <input
            type="checkbox"
            checked={selectedChords.includes(chord)}
            disabled={hasSpecialChords}
            onChange={() => toggleChord(chord)}
          />
          {chord}
        </label>
      ))}
    </div>
  </div>

  <div className="harmony_dictation_settings-dropdown">
    <button className="harmony_dictation_settings-dropbtn">🧩 Extra Chords</button>
    <div className="harmony_dictation_settings-dropdown-content">
      {extraChords.map((chord) => (
        <label key={chord}>
          <input
            type="checkbox"
            checked={outChords.includes(chord)}
            onChange={() => toggleOutChord(chord)}
          />
          {chord}
        </label>
      ))}
    </div>
  </div>

  <div className="harmony_dictation_settings-dropdown">
    <button
      className="harmony_dictation_settings-dropbtn"
      onClick={() => navigate('/harmonic/progressions')}
    >
      📖 Valid Progressions
    </button>
  </div>

  <div className="harmony_dictation_settings-controls">
    <div className="rounds-group">
      <label className="rounds-label">🎯 Rounds</label>
      <input
        type="number"
        min="1"
        max="20"
        value={rounds}
        onChange={(e) => setRounds(Number(e.target.value))}
        className="harmony_dictation_settings-rounds-input"
      />
    </div>
    <button className="harmony_dictation_settings-start-btn" onClick={startPractice}>
      Start Practice
    </button>
  </div>
</nav>


        <div className="harmony_dictation_settings-floating-message">
          🧠 Choose your chords — including extra ones — and start your dictation practice!
        </div>

        <div className="harmony_dictation_settings-summary">
  <p><strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong></p>
  <p><strong>Level:</strong> {level}</p>
  <p>Chords: <strong>{allChords.join(', ')}</strong></p>
</div>

        <div
          className="harmony_dictation_settings-chord-buttons"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {allChords.map((chord) => (
            <button
              key={chord}
              className="harmony_dictation_settings-chord-btn"
              onClick={() => playChord(chord)}
            >
              {chord}
            </button>
          ))}
        </div>
      </div>

      <div className="harmony_dictation_settings-keyboard-wrapper">
        <HarmonicDictationKeyboardView flashNotes={notesToFlash} />
      </div>
    </div>
  );
};

export default HarmonicDictationSettings;
