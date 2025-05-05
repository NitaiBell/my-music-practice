import React, { useState } from 'react';
import './PingPongHarmonySettings.css';
import { useNavigate } from 'react-router-dom';
import PingPongHarmonyKeyboardView from './PingPongHarmonyKeyboardView';

const chordsByScale = {
  C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
  G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
  F: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
  A: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
  D: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
  E: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
  B: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
};

// 🎵 Dynamic extra chords per scale (with correct musical symbols)
//here I can add more extra chords for doiffrenet scales
const extraChordsByScale = {
  C: ['E', 'E7', 'A7', 'Fm', 'E♭', 'Bm', 'B♭', 'B', 'D', 'D7'],

};

const chordNoteMap = {
  C: ['C3', 'E3', 'G3'],
  D: ['D3', 'Fs3', 'A3'],
  Dm: ['D3', 'F3', 'A3'],
  Em: ['E3', 'G3', 'B3'],
  F: ['F3', 'A3', 'C4'],
  FM: ['F3', 'A3', 'C4'],
  G: ['G3', 'B3', 'D4'],
  Am: ['A3', 'C4', 'E4'],
  Bdim: ['B3', 'D4', 'F4'],
  Bm: ['B3', 'D4', 'Fs4'],

  // Diminished
  'F#dim': ['Fs3', 'A3', 'C4'],
  'G#dim': ['Gs3', 'B3', 'D4'],
  'C#dim': ['Cs3', 'E3', 'G3'],
  'D#dim': ['Ds3', 'Fs3', 'A3'],
  'A#dim': ['As3', 'Cs4', 'E4'],

  // Minor chords
  Gm: ['G3', 'As3', 'D4'],
  'C#m': ['Cs3', 'E3', 'Gs3'],
  'F#m': ['Fs3', 'A3', 'Cs4'],
  'G#m': ['Gs3', 'B3', 'Ds4'],
  'D#m': ['Ds3', 'Fs3', 'As3'],
  'Ebm': ['Ds3', 'F3', 'As3'],
  'Abm': ['Gs3', 'B3', 'Cs4'],
  'Dbm': ['Cs3', 'E3', 'Gb3'],
  Cm: ['C3', 'Ds3', 'G3'],

  // Major chords with accidentals
  Bb: ['As2', 'D3', 'F3'],
  'B♭': ['As2', 'D3', 'F3'], // alias
  Eb: ['Ds3', 'G3', 'As3'],
  'E♭': ['Ds3', 'G3', 'As3'], // alias
  Ab: ['Gs3', 'C4', 'Ds4'],
  Db: ['Cs3', 'F3', 'Gs3'],

  // Dominant 7
  'E7': ['E3', 'Gs3', 'B3', 'D4'],
  'A7': ['A3', 'Cs4', 'E4', 'G4'],
  'D7': ['D3', 'Fs3', 'A3', 'C4'],
  'G7': ['G3', 'B3', 'D4', 'F4'],
  'B7': ['B3', 'Ds4', 'Fs4', 'A4'],
  'Bb7': ['As2', 'D3', 'F3', 'Gs3'],
  'B♭7': ['As2', 'D3', 'F3', 'Gs3'], // alias
  'F#7': ['Fs3', 'As3', 'Cs4', 'E4'],
  'C#7': ['Cs3', 'F3', 'Gs3', 'B3'],
  'G#7': ['Gs3', 'B3', 'Ds4', 'F4'],
  'D#7': ['Ds3', 'Fs3', 'As3', 'C4'],

  // Others
  E: ['E3', 'Gs3', 'B3'],
  A: ['A3', 'Cs4', 'E4'],
  B: ['B3', 'Ds4', 'Fs4'],
  Fm: ['F3', 'Gs3', 'C4'],
};


const PingPongHarmonySettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedChords, setSelectedChords] = useState(chordsByScale['C']);
  const [outChords, setOutChords] = useState([]);
  const [rounds, setRounds] = useState(15);
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
    navigate('/harmony/play', {
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
    const newChords = chordsByScale[scale];
    const reordered = newChords.includes(tonic)
      ? [tonic, ...newChords.filter((c) => c !== tonic)]
      : newChords;
    setSelectedChords(reordered);
    setOutChords([]); // reset extra chords on scale change
  };

  const extraChords = extraChordsByScale[selectedScale] || [];
  const allButtons = [...selectedChords, ...outChords];
  const rows = allButtons.length > 12 ? 2 : 1;
  const columns = Math.ceil(allButtons.length / rows || 1);

  return (
    <div className="harmony-container-settings">
      <div className="harmony-content-wrapper">
        <nav className="harmony-navbar">
          <div className="harmony-scale-chord-wrapper">
            {/* Scale Dropdown */}
            <div className="harmony-dropdown">
              <button className="harmony-dropbtn">🎼 Scale</button>
              <div className="harmony-dropdown-content">
                {Object.keys(chordsByScale).map((scale) => (
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

            {/* In-scale Chords */}
            <div className="harmony-dropdown">
              <button className="harmony-dropbtn">🎶 Chords</button>
              <div className="harmony-dropdown-content">
                {chordsByScale[selectedScale].map((chord) => (
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

            {/* Extra Chords (Dynamic) */}
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

          {/* Controls */}
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























