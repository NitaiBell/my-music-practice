// src/practices/difference_practice/DifferencePracticeKeyboardView.jsx

import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
  } from 'react';
  import './DifferencePracticeKeyboardView.css';
  
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };
  
  const DifferencePracticeKeyboardView = forwardRef(({ flashNotes = [] }, ref) => {
    const octaves = [2, 3, 4];
    const [flashedKeys, setFlashedKeys] = useState([]);
  
    useEffect(() => {
      if (flashNotes.length === 0) return;
      setFlashedKeys(flashNotes);
      const timer = setTimeout(() => setFlashedKeys([]), 600);
      return () => clearTimeout(timer);
    }, [flashNotes]);
  
    useImperativeHandle(ref, () => ({
      setFlashRight: (notes) => {},
      setFlashWrong: (notes) => {},
    }));
  
    const handleNoteClick = (note) => {
      const encoded = encodeURIComponent(`${note}.wav`);
      const audio = new Audio(`/clean_cut_notes/${encoded}`);
      audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
      setFlashedKeys([note]);
      setTimeout(() => setFlashedKeys([]), 600);
    };
  
    const getFlashClass = (note) => {
      const index = flashedKeys.indexOf(note);
      return index !== -1 ? `difference_practice_keyboard_view-flash-${index % 3}` : '';
    };
  
    return (
      <div className="difference_practice_keyboard_view-container">
        {octaves.map((oct) => (
          <div className="difference_practice_keyboard_view-octave" key={oct}>
            <div className="difference_practice_keyboard_view-white-keys">
              {whiteNotes.map((wn) => {
                const note = `${wn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`difference_practice_keyboard_view-white-key ${getFlashClass(note)}`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="difference_practice_keyboard_view-flash-overlay"></div>
                    <span className="difference_practice_keyboard_view-label">{note}</span>
                  </div>
                );
              })}
            </div>
            <div className="difference_practice_keyboard_view-black-keys">
              {Object.entries(blackNotesMap).map(([wn, bn]) => {
                const note = `${bn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`difference_practice_keyboard_view-black-key difference_practice_keyboard_view-${bn} ${getFlashClass(note)}`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="difference_practice_keyboard_view-flash-overlay"></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  });
  
  export default DifferencePracticeKeyboardView;
  