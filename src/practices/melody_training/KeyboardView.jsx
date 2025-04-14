import React from 'react';
import './KeyboardView.css';

const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackNotesMap = {
  C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As',
};

// Normalize flats to sharps for consistency
const enharmonicMap = {
  Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
};
const normalizeNote = (note) => enharmonicMap[note] || note;

const getBaseNote = (note) => normalizeNote(note.replace(/\d/, ''));

const KeyboardView = ({ selectedNotes, selectedScale, tonic, playNote, mode = 'settings' }) => {
  const octaves = [2, 3, 4];

  // Determine the key's color based on the mode and selected notes
  const getKeyColorClass = (note) => {
    const base = getBaseNote(note);
    if (base === normalizeNote(tonic)) return mode === 'settings' ? 'key-green' : 'key-blue';
    if (mode === 'settings' && selectedNotes.map(normalizeNote).includes(base)) {
      const index = selectedNotes.map(normalizeNote).indexOf(base);
      return index % 2 === 0 ? 'key-turquoise' : 'key-lightblue';
    }
    return '';
  };

  const getPositionClass = (note) => {
    if (note.startsWith('Cs')) return 'Cs';
    if (note.startsWith('Ds')) return 'Ds';
    if (note.startsWith('Fs')) return 'Fs';
    if (note.startsWith('Gs')) return 'Gs';
    if (note.startsWith('As')) return 'As';
    return '';
  };

  // Handle key click event (plays the note)
  const handleKeyClick = (note) => {
    playNote(note);
    if (mode === 'game') {
      const baseNote = getBaseNote(note);
      const btn = document.getElementById(`note-btn-${baseNote}`);
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
