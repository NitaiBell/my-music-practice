import React, { useState } from 'react';
import './PingPongMelodySettings.css';
import { useNavigate } from 'react-router-dom';

// 🎵 Map safe names to display names
const noteDisplayMap = {
  C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B',
  Cs: 'C#', Ds: 'D#', Fs: 'F#', Gs: 'G#', As: 'A#',
};

const notes = Object.keys(noteDisplayMap); // ['C', 'D', ..., 'As']

const PingPongMelodySettings = () => {
  const [selectedNotes, setSelectedNotes] = useState(['C']); // ✅ 'C' selected by default
  const [rounds, setRounds] = useState(1);
  const navigate = useNavigate();

  // 🔊 Play audio for note4.wav
  const playNote = (note) => {
    const encodedNote = encodeURIComponent(`${note}4.wav`);
    const audio = new Audio(`/clean_cut_notes/${encodedNote}`);
    audio.play().catch((err) => {
      console.error(`Error playing ${encodedNote}:`, err);
    });
  };

  // ✅ Toggle note selection & play audio (C is fixed)
  const toggleNote = (note) => {
    if (note === 'C') return;
    playNote(note);

    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const startPractice = () => {
    navigate('/melody', {
      state: {
        selectedNotes,
        rounds,
      },
    });
  };

  const numButtons = selectedNotes.length;
  let rows = 1;
  if (numButtons > 6) rows = 2;
  if (numButtons > 12) rows = 3;
  if (numButtons > 18) rows = 4;
  const columns = Math.ceil(numButtons / rows);

  return (
    <div className="container_settings">
      <nav className="navbar">
        <div className="dropdown">
          <button className="dropbtn">🎵 Notes</button>
          <div className="dropdown-content">
            <div className="column">
              {notes.map((note) => (
                <label key={note}>
                  <input
                    type="checkbox"
                    checked={selectedNotes.includes(note)}
                    onChange={() => toggleNote(note)}
                    disabled={note === 'C'} // 🔒 Disable 'C'
                  />
                  {noteDisplayMap[note]}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-fixed-letters">
          <input
            type="number"
            min="1"
            max="20"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="rounds-input"
          />
          <button className="start-btn" onClick={startPractice}>
            Start Practice
          </button>
        </div>
      </nav>

      <div className="summary">
        <p>You chose <strong>{rounds}</strong> rounds</p>
        <p>
          You chose notes to practice:{' '}
          <strong>{selectedNotes.map(n => noteDisplayMap[n]).join(', ') || 'None'}</strong>
        </p>
      </div>

      <div
        className="letter-buttons-area"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${columns}, 1fr)`
        }}
      >
        {selectedNotes.map((note) => (
          <button
            key={note}
            className="letter-btn"
            onClick={() => playNote(note)}
          >
            {noteDisplayMap[note]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PingPongMelodySettings;




