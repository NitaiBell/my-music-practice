import React, { useState } from 'react';
import './PingPongMelodySettings.css';
import { useNavigate } from 'react-router-dom';

const noteDisplayMap = {
  C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B',
  Cs: 'C#', Ds: 'D#', Fs: 'F#', Gs: 'G#', As: 'A#',
};

const allNotes = Object.keys(noteDisplayMap);

const scales = {
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'Fs'],
  D: ['D', 'E', 'Fs', 'G', 'A', 'B', 'Cs'],
  A: ['A', 'B', 'Cs', 'D', 'E', 'Fs', 'Gs'],
  E: ['E', 'Fs', 'Gs', 'A', 'B', 'Cs', 'Ds'],
  F: ['F', 'G', 'A', 'As', 'C', 'D', 'E'],
};

const PingPongMelodySettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedNotes, setSelectedNotes] = useState(scales['C']);
  const [rounds, setRounds] = useState(1);
  const [octaves, setOctaves] = useState([3]);
  const navigate = useNavigate();

  const tonicNote = selectedScale;

  const playNote = (note) => {
    const encodedNote = encodeURIComponent(`${note}4.wav`);
    const audio = new Audio(`/clean_cut_notes/${encodedNote}`);
    audio.play().catch((err) => console.error(`Error playing ${encodedNote}:`, err));
  };

  const toggleNote = (note) => {
    if (!scales[selectedScale].includes(note)) return;
    if (note === 'C') return;
    playNote(note);
    setSelectedNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const handleScaleChange = (scale) => {
    setSelectedScale(scale);
    setSelectedNotes(scales[scale]);
  };

  const startPractice = () => {
    navigate('/melody', {
      state: {
        selectedNotes,
        rounds,
        octaves,
        selectedScale,
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

        {/* Scale Dropdown */}
        <div className="dropdown scale-dropdown">
          <button className="dropbtn scale">🎼 Scale</button>
          <div className="dropdown-content">
            <div className="column">
              {Object.keys(scales).map((scale) => (
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
        </div>

        {/* Notes Dropdown */}
        <div className="dropdown">
          <button className="dropbtn">🎵 Notes</button>
          <div className="dropdown-content">
            <div className="column">
              {scales[selectedScale].map((note) => (
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

        {/* Rounds / Octaves / Start */}
        <div className="nav-controls">
          {/* Rounds */}
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

          {/* Octaves */}
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
                          const encodedNote = encodeURIComponent(`${tonicNote}${oct}.wav`);
                          const audio = new Audio(`/clean_cut_notes/${encodedNote}`);
                          audio.play().catch(err =>
                            console.error(`Error playing ${encodedNote}:`, err)
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
          Practicing scale: <strong>{selectedScale}</strong><br />
          Notes: <strong>{selectedNotes.map(n => noteDisplayMap[n]).join(', ')}</strong>
        </p>
        <p>
          Octaves: <strong>{octaves.sort().join(', ')}</strong>
        </p>
      </div>

      {/* Playback Buttons */}
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





