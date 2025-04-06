import React from 'react';
import { useLocation } from 'react-router-dom';
import './PingPongMelody.css';

// 🎵 Map internal note names to display names
const noteDisplayMap = {
  C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B',
  Cs: 'C#', Ds: 'D#', Fs: 'F#', Gs: 'G#', As: 'A#',
};

const PingPongMelody = () => {
  const location = useLocation();
  const { selectedNotes = [], rounds = 1 } = location.state || {};

  // 🔊 Play the note (uses internal file-safe names)
  const playNote = (note) => {
    const filename = `${note}4.wav`;
    const audio = new Audio(`/clean_cut_notes/${filename}`);
    audio.play().catch((err) => {
      console.error(`Error playing ${filename}:`, err);
    });
  };

  const numButtons = selectedNotes.length;
  let rows = 1;
  if (numButtons > 6) rows = 2;
  if (numButtons > 12) rows = 3;
  if (numButtons > 18) rows = 4;
  const columns = Math.ceil(numButtons / rows);

  return (
    <div className="container_game">
      <nav className="navbar">
        <div className="dropdown">
          <button className="dropbtn">🎯 Game</button>
        </div>

        <div className="nav-fixed-letters">
          <span>A</span>
          <span>B</span>
          <span>C</span>
        </div>
      </nav>

      <div className="summary">
        <p>You are in the game now</p>
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

export default PingPongMelody;






