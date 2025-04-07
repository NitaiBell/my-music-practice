import React, { useState } from 'react';
import './PingPongMelodySettings.css';
import { useNavigate } from 'react-router-dom';

const noteDisplayMap = {
  C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B',
  Cs: 'C#', Ds: 'D#', Fs: 'F#', Gs: 'G#', As: 'A#',
};

const notes = Object.keys(noteDisplayMap);

const PingPongMelodySettings = () => {
  const [selectedNotes, setSelectedNotes] = useState(['C']);
  const [rounds, setRounds] = useState(1);
  const [octaves, setOctaves] = useState([3]); // C3 is default
  const navigate = useNavigate();

  const playNote = (note) => {
    const encodedNote = encodeURIComponent(`${note}4.wav`);
    const audio = new Audio(`/clean_cut_notes/${encodedNote}`);
    audio.play().catch((err) => console.error(`Error playing ${encodedNote}:`, err));
  };

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
        octaves,
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
        {/* Note Dropdown */}
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
                    disabled={note === 'C'}
                  />
                  {noteDisplayMap[note]}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Controls: Rounds / Octaves / Start */}
        <div className="nav-controls">
          {/* Rounds Input */}
          <div className="rounds-container">
            <label>Rounds</label>
            <input
              type="number"
              min="1"
              max="20"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="rounds-input"
            />
          </div>

          {/* Octave Dropdown */}
          <div className="octave-dropdown">
            <button className="dropbtn">Octaves ⬇️</button>
            <div className="dropdown-content">
              <div className="column">
                {[1, 2, 3, 4, 5, 6].map((oct) => (
                  <label key={oct}>
                    <input
                      type="checkbox"
                      checked={octaves.includes(oct)}
                      disabled={oct === 3}
                      onChange={() => {
                        if (octaves.includes(oct)) {
                          setOctaves(octaves.filter((o) => o !== oct));
                        } else {
                          setOctaves([...octaves, oct]);
                          const audio = new Audio(`/clean_cut_notes/C${oct}.wav`);
                          audio.play().catch(err =>
                            console.error(`Error playing C${oct}.wav`, err)
                          );
                        }
                      }}
                    />
                    {oct}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button className="start-btn" onClick={startPractice}>
            Start Practice
          </button>
        </div>
      </nav>

      {/* Summary Info */}
      <div className="summary">
        <p>You chose <strong>{rounds}</strong> rounds</p>
        <p>
          You chose notes to practice:{' '}
          <strong>{selectedNotes.map(n => noteDisplayMap[n]).join(', ') || 'None'}</strong>
        </p>
        <p>
          Practicing in octaves: <strong>{octaves.sort().join(', ')}</strong>
        </p>
      </div>

      {/* Note Playback Grid */}
      <div
        className="letter-buttons-area"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
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





