import React, { useState } from 'react';
import './LearnPianoChordsSettings.css';
import LearnPianoChordsKeyboardView from './LearnPianoChordsKeyboardView';
import { useNavigate } from 'react-router-dom';

const chordsByScale = {
  C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
  G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
  F: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
};

const chordNoteMap = {
  C: ['C3', 'E3', 'G3'], D: ['D3', 'Fs3', 'A3'], Dm: ['D3', 'F3', 'A3'],
  Em: ['E3', 'G3', 'B3'], F: ['F3', 'A3', 'C4'], G: ['G3', 'B3', 'D4'],
  Am: ['A3', 'C4', 'E4'], Bdim: ['B3', 'D4', 'F4'], Bm: ['B3', 'D4', 'Fs4'],
  'F#dim': ['Fs3', 'A3', 'C4'], Gm: ['G3', 'As3', 'D4'], Bb: ['As2', 'D3', 'F3'],
  Edim: ['E3', 'G3', 'As3'],
};

const shiftOctave = (note, up = 1) => {
  const match = note.match(/^([A-Ga-g][s]?)(\d)$/);
  if (!match) return note;
  const [_, base, octave] = match;
  return `${base}${parseInt(octave) + up}`;
};

const getRandomInversion = (chord) => {
  const notes = chordNoteMap[chord];
  if (!notes) return [];

  const inversions = [
    notes, // root
    [notes[1], notes[2], shiftOctave(notes[0], 1)], // first
    [notes[2], shiftOctave(notes[0], 1), shiftOctave(notes[1], 1)], // second
  ];

  return inversions[Math.floor(Math.random() * inversions.length)];
};

const LearnPianoChordsSettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedChords, setSelectedChords] = useState(chordsByScale['C']);
  const [rounds, setRounds] = useState(15);
  const [notesToFlash, setNotesToFlash] = useState([]);
  const navigate = useNavigate();

  const toggleChord = (chord) => {
    if (chord === selectedScale) return;
    setSelectedChords((prev) =>
      prev.includes(chord) ? prev.filter((c) => c !== chord) : [...prev, chord]
    );
  };

  const startPractice = () => {
    navigate('/learn-piano-chords', {
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
    const notes = getRandomInversion(chord);
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
    <div className="learn_piano_chords-container-settings">
      <div className="learn_piano_chords-content-wrapper">
        <nav className="learn_piano_chords-navbar">
          <div className="learn_piano_chords-scale-chord-wrapper">
            <div className="learn_piano_chords-dropdown">
              <button className="learn_piano_chords-dropbtn">🎼 Scale</button>
              <div className="learn_piano_chords-dropdown-content">
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

            <div className="learn_piano_chords-dropdown">
              <button className="learn_piano_chords-dropbtn">🎶 Chords</button>
              <div className="learn_piano_chords-dropdown-content">
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
          </div>

          <div className="learn_piano_chords-controls">
            <div className="rounds-group">
              <label htmlFor="rounds-input" className="rounds-label">Rounds:</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="20"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="learn_piano_chords-rounds-input"
              />
            </div>
            <button className="learn_piano_chords-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="learn_piano_chords-floating-setup-message">
          🎯 Set your scale and chords, then click "Start Practice" when ready!
        </div>

        <div className="learn_piano_chords-summary">
          <p><strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong></p>
          <p>Chords: <strong>{selectedChords.join(', ')}</strong></p>
        </div>

        <div
          className="learn_piano_chords-chord-buttons"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {selectedChords.map((chord) => (
            <button
              key={chord}
              className="learn_piano_chords-chord-btn"
              onClick={() => playChord(chord)}
            >
              {chord}
            </button>
          ))}
        </div>
      </div>

      <div className="learn_piano_chords-keyboard-wrapper">
        <LearnPianoChordsKeyboardView flashNotes={notesToFlash} showLabels={true} />
      </div>
    </div>
  );
};

export default LearnPianoChordsSettings;