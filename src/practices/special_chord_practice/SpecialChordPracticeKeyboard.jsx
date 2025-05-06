// src/practices/special_chord_practice/SpecialChordPracticeKeyboard.jsx

import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
  } from 'react';
  import './SpecialChordPracticeKeyboard.css';
  
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };
  
  const SpecialChordPracticeKeyboard = forwardRef(({ flashNotes = [] }, ref) => {
    const octaves = [2, 3, 4];
    const [flashedKeys, setFlashedKeys] = useState([]);
    const [correctFlash, setCorrectFlash] = useState([]);
    const [wrongFlash, setWrongFlash] = useState([]);
  
    useEffect(() => {
      if (flashNotes.length === 0) return;
      setFlashedKeys(flashNotes);
      const timer = setTimeout(() => setFlashedKeys([]), 600);
      return () => clearTimeout(timer);
    }, [flashNotes]);
  
    useImperativeHandle(ref, () => ({
      setFlashRight: (notes) => {
        setCorrectFlash(notes);
        setTimeout(() => setCorrectFlash([]), 500);
      },
      setFlashWrong: (notes) => {
        setWrongFlash(notes);
        setTimeout(() => setWrongFlash([]), 500);
      },
    }));
  
    const handleNoteClick = (note) => {
      const encoded = encodeURIComponent(`${note}.wav`);
      const audio = new Audio(`/clean_cut_notes/${encoded}`);
      audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
      setFlashedKeys([note]);
      setTimeout(() => setFlashedKeys([]), 600);
    };
  
    const getFlashClass = (note) => {
      if (correctFlash.includes(note)) return 'flash-correct';
      if (wrongFlash.includes(note)) return 'flash-wrong';
      const index = flashedKeys.indexOf(note);
      return index !== -1 ? `special_chord_flash-${index % 3}` : '';
    };
  
    return (
      <div className="special_chord_keyboard-container">
        {octaves.map((oct) => (
          <div className="special_chord_octave" key={oct}>
            <div className="special_chord_white-keys">
              {whiteNotes.map((wn) => {
                const note = `${wn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`special_chord_white-key ${getFlashClass(note)}`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flash-overlay"></div>
                    <span className="special_chord_label">{note}</span>
                  </div>
                );
              })}
            </div>
            <div className="special_chord_black-keys">
              {Object.entries(blackNotesMap).map(([wn, bn]) => {
                const note = `${bn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`special_chord_black-key special_chord_${bn} ${getFlashClass(note)}`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flash-overlay"></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  });
  
  export default SpecialChordPracticeKeyboard;
  