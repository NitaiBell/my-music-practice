import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChordTypeSettings.css';
import ChordTypeKeyboard from './ChordTypeKeyboard';

const allChordTypes = [
  'Major', 'Minor', 'Maj7', '7', 'Min7', 'Min6', 'Sus4', 'Dim', 'Aug', 'Dim7', 'Maj6', 'Min7b5'
];

const chordIntervals = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Maj7: [0, 4, 7, 11],
  '7': [0, 4, 7, 10],
  Min7: [0, 3, 7, 10],
  Min6: [0, 3, 7, 9],
  Sus4: [0, 5, 7],
  Dim: [0, 3, 6],
  Aug: [0, 4, 8],
  Dim7: [0, 3, 6, 9],
  Maj6: [0, 4, 7, 9],
  Min7b5: [0, 3, 6, 10] // ✅ Half-diminished seventh (Minor 7♭5)
};

const noteOrder = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];

const getMidiNumber = (note) => {
  const name = note.slice(0, -1);
  const octave = parseInt(note.slice(-1));
  const index = noteOrder.indexOf(name);
  return index + octave * 12;
};

const getNoteFromMidi = (midi) => {
  const index = midi % 12;
  const octave = Math.floor(midi / 12);
  return noteOrder[index] + octave;
};

const buildChord = (root, type) => {
  const rootMidi = getMidiNumber(root);
  const intervals = chordIntervals[type] || [];
  return intervals.map(i => getNoteFromMidi(rootMidi + i));
};

const ChordTypeSettings = () => {
  const [selectedChordTypes, setSelectedChordTypes] = useState(['Major', 'Minor']);
  const [rounds, setRounds] = useState(10);
  const [notesToFlash, setNotesToFlash] = useState([]);
  const navigate = useNavigate();

  const toggleChordType = (type) => {
    setSelectedChordTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const startPractice = () => {
    navigate('/chord-type/play', {
      state: {
        selectedChordTypes,
        rounds,
      },
    });
  };

  const playNote = (note) => {
    const encoded = encodeURIComponent(`${note}.wav`);
    const audio = new Audio(`/clean_cut_notes/${encoded}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const playChordPreview = (type) => {
    const notes = buildChord('C3', type); // default root for preview
    notes.forEach(playNote);
    setNotesToFlash(notes);
  };

  return (
    <div className="chord_type_settings-container">
      <div className="chord_type_settings-content-wrapper">
        <nav className="chord_type_settings-navbar">
          <div className="chord_type_settings-dropdown-wrapper">
            <div className="chord_type_settings-dropdown">
              <button className="chord_type_settings-dropbtn">🎵 Chord Types</button>
              <div className="chord_type_settings-dropdown-content">
                {allChordTypes.map((type) => (
                  <label key={type}>
                    <input
                      type="checkbox"
                      checked={selectedChordTypes.includes(type)}
                      onChange={() => toggleChordType(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="chord_type_settings-controls">
            <div className="rounds-group">
              <label htmlFor="rounds-input" className="rounds-label">Rounds:</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="20"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="chord_type_settings-rounds-input"
              />
            </div>
            <button className="chord_type_settings-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="chord_type_settings-floating-message">
          🎧 Choose chord types and click "Start Practice"!
        </div>

        <div className="chord_type_settings-summary">
          <p><strong>{rounds}</strong> rounds</p>
          <p>Chord Types: <strong>{selectedChordTypes.join(', ')}</strong></p>
        </div>

        <div className="chord_type_settings-chord-buttons">
          {selectedChordTypes.map((type) => (
            <button
              key={type}
              className="chord_type_settings-chord-btn"
              onClick={() => playChordPreview(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="chord_type_settings-keyboard-wrapper">
        <ChordTypeKeyboard flashNotes={notesToFlash} />
      </div>
    </div>
  );
};

export default ChordTypeSettings;
