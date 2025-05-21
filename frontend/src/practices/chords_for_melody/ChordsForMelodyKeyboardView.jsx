// src/practices/chords_for_melody/ChordsForMelodyKeyboardView.jsx

import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './ChordsForMelodyKeyboardView.css';

const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };

const ChordsForMelodyKeyboardView = forwardRef((_, ref) => {
  const octaves = [3, 4, 5];
  const [flashedKeys, setFlashedKeys] = useState([]);

  useImperativeHandle(ref, () => ({
    setFlashRight: (notes) => {
      setFlashedKeys(notes);
      setTimeout(() => setFlashedKeys([]), 600);
    },
  }));

  const handleNoteClick = (note) => {
    const encoded = encodeURIComponent(`${note}.wav`);
    const audio = new Audio(`/clean_cut_notes/${encoded}`);
    audio.play();
  };

  const getFlashClass = (note) => {
    const index = flashedKeys.indexOf(note);
    return index !== -1 ? `chords_flash_${index % 3}` : '';
  };

  return (
    <div className="chords_keyboard_container">
      {octaves.map((oct) => (
        <div className="chords_octave" key={oct}>
          <div className="chords_white_keys">
            {whiteNotes.map((wn) => {
              const note = `${wn}${oct}`;
              return (
                <div
                  key={note}
                  className={`chords_white_key ${getFlashClass(note)}`}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="flash-overlay" />
                  <span className="chords_label">{note}</span>
                </div>
              );
            })}
          </div>
          <div className="chords_black_keys">
            {Object.entries(blackNotesMap).map(([wn, bn]) => {
              const note = `${bn}${oct}`;
              return (
                <div
                  key={note}
                  className={`chords_black_key chords_${bn} ${getFlashClass(note)}`}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="flash-overlay" />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
});

export default ChordsForMelodyKeyboardView;
