import React from 'react';
import './KeyboardView.css';

const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackNotesMap = {
  C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As',
};

const enharmonicMap = {
  Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
};
const normalizeNote = (note) => enharmonicMap[note] || note;
const getBaseNote = (note) => normalizeNote(note.replace(/\d/, ''));

const KeyboardView = ({ selectedNotes, selectedScale, tonic, playNote, mode = 'settings' }) => {
  const octaves = [2, 3, 4];
  const normalizedSelectedNotes = selectedNotes.map(normalizeNote);

  const getKeyColorClass = (note) => {
    const base = getBaseNote(note);
    if (base === normalizeNote(tonic)) return mode === 'settings' ? 'key-green' : 'key-blue';
    if (mode === 'settings' && normalizedSelectedNotes.includes(base)) {
      const index = normalizedSelectedNotes.indexOf(base);
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

  const handleKeyClick = (note) => {
    console.log("Clicked note:", note);
    playNote(note);
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
