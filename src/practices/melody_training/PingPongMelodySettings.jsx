import React, { useState } from 'react';
import './PingPongMelodySettings.css';
import { useNavigate } from 'react-router-dom';

const noteDisplayMap = {
  C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B',
  'C#': 'C#', 'D#': 'D#', 'F#': 'F#', 'G#': 'G#', 'A#': 'A#',
  'Db': 'Db', 'Eb': 'Eb', 'Gb': 'Gb', 'Ab': 'Ab', 'Bb': 'Bb',
};

const scales = {
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  D: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  A: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  E: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],

  Am: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  Dm: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
  Em: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
  Fm: ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
  Gm: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
  Bm: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
};

const PingPongMelodySettings = () => {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedNotes, setSelectedNotes] = useState(scales['C']);
  const [rounds, setRounds] = useState(5);
  const [octaves, setOctaves] = useState([3]);
  const navigate = useNavigate();

  const flatToSharpMap = {
    Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
    'C#': 'Cs', 'D#': 'Ds', 'F#': 'Fs', 'G#': 'Gs', 'A#': 'As',
  };

  const tonic = selectedScale.replace(/m$/, '');

  const playNote = (note) => {
    const convertedNote = flatToSharpMap[note] || note;
    const encodedNote = encodeURIComponent(`${convertedNote}4.wav`);
    const audio = new Audio(`/clean_cut_notes/${encodedNote}`);
    audio.play().catch((err) =>
      console.error(`Error playing ${encodedNote}:`, err)
    );
  };

  const toggleNote = (note) => {
    if (!scales[selectedScale].includes(note)) return;
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
        <div className="scale-note-wrapper">
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
                    {scale.endsWith('m') ? scale.slice(0, -1) + ' minor' : scale + ' Major'}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Dropdown */}
          <div className="dropdown note-dropdown">
            <button className="dropbtn">🎵 Notes</button>
            <div className="dropdown-content">
              <div className="column">
                {scales[selectedScale].map((note) => (
                  <label key={note}>
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note)}
                      onChange={() => toggleNote(note)}
                      disabled={!selectedScale.endsWith('m') && note === tonic}
                    />
                    {noteDisplayMap[note]}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rounds / Octaves / Start */}
        <div className="nav-controls">
          <div className="rounds-container horizontal">
            <label htmlFor="rounds-input">Number of rounds:</label>
            <input
              id="rounds-input"
              type="number"
              min="3"
              max="20"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="rounds-input"
            />
          </div>

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
                        const newOctaves = octaves.includes(oct)
                          ? octaves.filter((o) => o !== oct)
                          : [...octaves, oct];
                        setOctaves(newOctaves);

                        const converted = flatToSharpMap[tonic] || tonic;
                        const encodedNote = encodeURIComponent(`${converted}${oct}.wav`);
                        const audio = new Audio(`/clean_cut_notes/${encodedNote}`);
                        audio.play().catch((err) =>
                          console.error(`Error playing ${encodedNote}:`, err)
                        );
                      }}
                    />
                    {oct}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button className="start-btn" onClick={startPractice}>
            Start Practice
          </button>
        </div>
      </nav>

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









