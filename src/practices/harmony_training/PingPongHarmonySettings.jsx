// ✅ Updated PingPongHarmonySettings.jsx with specialChordMode support

import React, { useState } from 'react';
import './PingPongHarmonySettings.css';
import { useNavigate } from 'react-router-dom';
import PingPongHarmonyKeyboardView from './PingPongHarmonyKeyboardView';
import {
  majorScales,
  scaleChordsMap,
  extraChordsByScale,
  chordNoteMap,
  chordFunctionsByScale,
} from './HarmonyTrainingData';

const PingPongHarmonySettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedChords, setSelectedChords] = useState(scaleChordsMap['C']);
  const [outChords, setOutChords] = useState([]);
  const [rounds, setRounds] = useState(15);
  const [specialChordMode, setSpecialChordMode] = useState(false);
  const [notesToFlash, setNotesToFlash] = useState([]);
  const navigate = useNavigate();

  const toggleChord = (chord) => {
    if (chord === selectedScale) return;
    setSelectedChords((prev) =>
      prev.includes(chord) ? prev.filter((c) => c !== chord) : [...prev, chord]
    );
  };

  const toggleOutChord = (chord) => {
    setOutChords((prev) =>
      prev.includes(chord) ? prev.filter((c) => c !== chord) : [...prev, chord]
    );
  };

  const startPractice = () => {
    const allChords = [...selectedChords, ...outChords];

    const romanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    const inScaleFunctions = Object.fromEntries(
      (scaleChordsMap[selectedScale] || []).map((chord, i) => [chord, romanNumerals[i]])
    );

    const specialFunctions = Object.entries(chordFunctionsByScale[selectedScale] || {}).reduce(
      (acc, [func, chord]) => {
        acc[chord] = func.replace(/_/g, '/');
        return acc;
      },
      {}
    );

    const chordFunctionMap = {};
    allChords.forEach((chord) => {
      chordFunctionMap[chord] =
        specialFunctions[chord] || inScaleFunctions[chord] || '?';
    });

    navigate('/harmony/play', {
      state: {
        selectedScale,
        selectedChords: allChords,
        chordFunctionMap,
        rounds,
        specialChordMode,
      },
    });
  };

  const playNote = (note) => {
    const audio = new Audio(`/clean_cut_notes/${encodeURIComponent(note + '.wav')}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const playChord = (chord) => {
    const notes = chordNoteMap[chord];
    if (!notes) {
      console.warn(`Chord "${chord}" is missing`);
      return;
    }
    setNotesToFlash(notes);
    notes.forEach(playNote);
  };

  const handleScaleChange = (scale) => {
    setSelectedScale(scale);
    const tonic = scale;
    const newChords = scaleChordsMap[scale];
    const reordered = newChords.includes(tonic)
      ? [tonic, ...newChords.filter((c) => c !== tonic)]
      : newChords;
    setSelectedChords(reordered);
    setOutChords([]);
  };

  const extraChords = extraChordsByScale[selectedScale] || [];
  const allButtons = Array.from(new Set([...selectedChords, ...outChords]));
  const rows = allButtons.length > 12 ? 2 : 1;
  const columns = Math.ceil(allButtons.length / rows || 1);

  return (
    <div className="harmony-container-settings">
      <div className="harmony-content-wrapper">
        <nav className="harmony-navbar">
          <div className="harmony-scale-chord-wrapper">
            <div className="harmony-dropdown">
              <button className="harmony-dropbtn">🎼 Scale</button>
              <div className="harmony-dropdown-content">
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

            <div className="harmony-dropdown">
              <button className="harmony-dropbtn">🎶 Chords</button>
              <div className="harmony-dropdown-content">
                {scaleChordsMap[selectedScale].map((chord) => (
                  <label key={chord}>
                    <input
                      type="checkbox"
                      checked={selectedChords.includes(chord)}
                      disabled={chord === selectedScale}
                      onChange={() => toggleChord(chord)}
                    />
                    {chord}
                  </label>
                ))}
              </div>
            </div>

            <div className="harmony-dropdown">
              <button className="harmony-dropbtn">🧩 Extra Chords</button>
              <div className="harmony-dropdown-content">
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
          </div>

          <div className="harmony-controls">
            <div className="rounds-group">
              <label htmlFor="rounds-input" className="rounds-label">Rounds:</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="20"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="harmony-rounds-input"
              />
            </div>
            <div className="harmony-special-toggle">
  <input
    type="checkbox"
    checked={specialChordMode}
    onChange={() => setSpecialChordMode((v) => !v)}
  />
  🎯 Focus on Special Chords
</div>
            <button className="harmony-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="harmony-floating-setup-message">
          🎯 Choose your chords — including extra ones — and start practicing!
        </div>

        <div className="harmony-summary">
          <p><strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong></p>
          <p>Chords: <strong>{allButtons.join(', ')}</strong></p>
        </div>

        <div
          className="harmony-chord-buttons"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {allButtons.map((chord) => (
            <button
              key={chord}
              className="harmony-chord-btn"
              onClick={() => playChord(chord)}
            >
              {chord}
            </button>
          ))}
        </div>
      </div>

      <div className="harmony-keyboard-wrapper">
        <PingPongHarmonyKeyboardView flashNotes={notesToFlash} />
      </div>
    </div>
  );
};

export default PingPongHarmonySettings;