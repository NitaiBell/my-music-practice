import React, { useEffect } from 'react';
import './KeyboardView.css';

const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackNotesMap = {
  C: 'C#', D: 'D#', F: 'F#', G: 'G#', A: 'A#',
};

const getBaseNote = (note) => note.replace(/\d/, '');

const KeyboardView = ({ selectedNotes, selectedScale, tonic, playNote, mode = 'settings' }) => {
  const octaves = [2, 3, 4];

  const getKeyColorClass = (note) => {
    const base = getBaseNote(note);

    if (base === tonic) return mode === 'settings' ? 'key-green' : 'key-blue';
    if (mode === 'settings' && selectedNotes.includes(base)) {
      const index = selectedNotes.indexOf(base);
      return index % 2 === 0 ? 'key-turquoise' : 'key-lightblue';
    }
    return '';
  };

  const getPositionClass = (note) => {
    if (note.startsWith('C#')) return 'Cs';
    if (note.startsWith('D#')) return 'Ds';
    if (note.startsWith('F#')) return 'Fs';
    if (note.startsWith('G#')) return 'Gs';
    if (note.startsWith('A#')) return 'As';
    return '';
  };

  const handleKeyClick = (note) => {
    if (mode === 'settings') {
      playNote(note);
    } else {
      // Game mode: pass base note
      playNote(note);
      const btn = document.getElementById(`note-btn-${getBaseNote(note)}`);
      if (btn) {
        btn.click();
      }
    }
  };

  return (
    <div className="keyboard-view-container">
      {octaves.map((oct) => (
        <div className="octave" key={oct}>
          <div className="white-keys">
            {whiteNotes.map((whiteNote) => {
              const note = `${whiteNote}${oct}`;
              return (
                <div
                  key={note}
                  id={`key-${note}`}
                  className={`white-key ${getKeyColorClass(note)}`}
                  onClick={() => handleKeyClick(note)}
                >
                  <span className="label">{note}</span>
                </div>
              );
            })}
          </div>
          <div className="black-keys">
            {Object.entries(blackNotesMap).map(([whiteNote, blackNote]) => {
              const note = `${blackNote}${oct}`;
              return (
                <div
                  key={note}
                  id={`key-${note}`}
                  className={`black-key ${getKeyColorClass(note)} ${getPositionClass(note)}`}
                  onClick={() => handleKeyClick(note)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeyboardView;
