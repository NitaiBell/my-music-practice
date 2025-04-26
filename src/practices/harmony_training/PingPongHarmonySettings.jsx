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

const chordNoteMap = {
  C: ['C3', 'E3', 'G3'],
  D: ['D3', 'Fs3', 'A3'],
  Dm: ['D3', 'F3', 'A3'],
  Em: ['E3', 'G3', 'B3'],
  F: ['F3', 'A3', 'C4'],
  G: ['G3', 'B3', 'D4'],
  Am: ['A3', 'C4', 'E4'],
  Bdim: ['B3', 'D4', 'F4'],
  Bm: ['B3', 'D4', 'Fs4'],
  'F#dim': ['Fs3', 'A3', 'C4'],
  Gm: ['G3', 'As3', 'D4'],
  Bb: ['As2', 'D3', 'F3'],
  Edim: ['E3', 'G3', 'As3'],
  A: ['A3', 'Cs4', 'E4'],
  'C#m': ['Cs3', 'E3', 'Gs3'],
  E: ['E3', 'Gs3', 'B3'],
  'F#m': ['Fs3', 'A3', 'Cs4'],
  'G#dim': ['Gs3', 'B3', 'D4'],
  'G#m': ['Gs3', 'B3', 'Ds4'],
  B: ['B3', 'Ds4', 'Fs4'],
  'C#dim': ['Cs3', 'E3', 'G3'],
  'D#dim': ['Ds3', 'Fs3', 'A3'],
  'D#m': ['Ds3', 'Fs3', 'As3'],
  'F#': ['Fs3', 'As3', 'Cs4'],
  'A#dim': ['As3', 'Cs4', 'E4'],
};

const PingPongHarmonySettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedChords, setSelectedChords] = useState(chordsByScale['C']);
  const [rounds, setRounds] = useState(15);
  const [notesToFlash, setNotesToFlash] = useState([]);
  const navigate = useNavigate();

  const toggleChord = (chord) => {
    if (chord === selectedScale) return; // ✅ prevent removing tonic
    setSelectedChords((prev) =>
      prev.includes(chord) ? prev.filter((c) => c !== chord) : [...prev, chord]
    );
  };

  const startPractice = () => {
    navigate('/harmony', {
      state: {
        selectedScale,
        selectedChords,
        rounds,
      },
    });
  };

  const playNote = (note) => {
    const encoded = encodeURIComponent(`${note}.wav`);
    const audio = new Audio(`/clean_cut_notes/${encoded}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const playChord = (chord) => {
    const notes = chordNoteMap[chord];
    if (!notes) {
      console.warn(`Chord "${chord}" is missing from chordNoteMap`);
      return;
    }
    setNotesToFlash(notes);
    notes.forEach(playNote);
  };

  const handleScaleChange = (scale) => {
    setSelectedScale(scale);
    const newChords = chordsByScale[scale];
    const tonic = scale;
    const reordered = newChords.includes(tonic)
      ? [tonic, ...newChords.filter((c) => c !== tonic)]
      : newChords;
    setSelectedChords(reordered);
  };

  const numButtons = selectedChords.length;
  const rows = numButtons > 12 ? 2 : 1;
  const columns = Math.ceil(numButtons / rows || 1);

  return (
    <div className="harmony-container-settings">
      <div className="harmony-content-wrapper">
        <nav className="harmony-navbar">
          <div className="harmony-scale-chord-wrapper">
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

            <div className="harmony-dropdown">
              <button className="harmony-dropbtn">🎶 Chords</button>
              <div className="harmony-dropdown-content">
                {chordsByScale[selectedScale].map((chord) => (
                  <label key={chord}>
                    <input
                      type="checkbox"
                      checked={selectedChords.includes(chord)}
                      disabled={chord === selectedScale} // ✅ tonic cannot be unchecked
                      onChange={() => toggleChord(chord)}
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
  <button className="harmony-start-btn" onClick={startPractice}>
    Start Practice
  </button>
</div>

        </nav>
        <div className="harmony-floating-setup-message">
  🎯 Set your scale and chords, then click "Start Practice" when ready!
</div>


        <div className="harmony-summary">
          <p><strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong></p>
          <p>Chords: <strong>{selectedChords.join(', ')}</strong></p>
        </div>

        <div
          className="harmony-chord-buttons"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {selectedChords.map((chord) => (
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