import React from 'react';
import './Keyboard.css';

const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackNotesMap = {
  C: 'Cs',
  D: 'Ds',
  F: 'Fs',
  G: 'Gs',
  A: 'As',
};

// Manual black key positions relative to white keys (for top-down accuracy)
const blackNotePositions = {
  C: 1,
  D: 2,
  F: 4,
  G: 5,
  A: 6,
};

const playNote = (note) => {
  const audio = new Audio(`/clean_cut_notes/${note}.wav`);
  audio.play();
};

const Octave = ({ number }) => {
    const blackNotePositions = {
      C: 1,
      D: 2,
      F: 4,
      G: 5,
      A: 6,
    };
  
    return (
      <div className="octave">
        {/* White keys */}
        <div className="white-keys">
          {whiteNotes.map((whiteNote) => (
            <div
              key={`${whiteNote}${number}`}
              className="white-key"
              onClick={() => playNote(`${whiteNote}${number}`)}
            >
              <div className="label">{`${whiteNote}${number}`}</div>
            </div>
          ))}
        </div>
  
        {/* Black keys */}
        <div className="black-keys">
          {Object.entries(blackNotePositions).map(([whiteNote, pos]) => {
            const blackNote = blackNotesMap[whiteNote];
            return (
              <div
                key={`${blackNote}${number}`}
                className="black-key"
                style={{
                  left: `calc(${pos} * var(--white-key-width) - var(--black-key-width) / 2 - 2px)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  playNote(`${blackNote}${number}`);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };
  

const Keyboard = () => {
  const octaves = [];
  for (let i = 2; i <= 4; i++) {
    octaves.push(<Octave key={i} number={i} />);
  }

  return <div className="keyboard">{octaves}</div>;
};

export default Keyboard;
