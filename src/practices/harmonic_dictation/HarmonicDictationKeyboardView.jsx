// src/practices/harmonic_dictation/HarmonicDictationKeyboardView.jsx
import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
  } from 'react';
  import './HarmonicDictationKeyboardView.css';
  
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };
  
  const HarmonicDictationKeyboardView = forwardRef(({ flashNotes = [] }, ref) => {
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
      if (correctFlash.includes(note)) return 'harmony_dictation_keyboard-flash-correct';
      if (wrongFlash.includes(note)) return 'harmony_dictation_keyboard-flash-wrong';
      const index = flashedKeys.indexOf(note);
      return index !== -1 ? `harmony_dictation_keyboard-flash-${index % 3}` : '';
    };
  
    return (
      <div className="harmony_dictation_keyboard-container">
        {octaves.map((oct) => (
          <div className="harmony_dictation_keyboard-octave" key={oct}>
            <div className="harmony_dictation_keyboard-white-keys">
              {whiteNotes.map((wn) => {
                const note = `${wn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`harmony_dictation_keyboard-white-key ${getFlashClass(note)}`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flash-overlay"></div>
                    <span className="harmony_dictation_keyboard-label">{note}</span>
                  </div>
                );
              })}
            </div>
            <div className="harmony_dictation_keyboard-black-keys">
              {Object.entries(blackNotesMap).map(([wn, bn]) => {
                const note = `${bn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`harmony_dictation_keyboard-black-key harmony_dictation_keyboard-${bn} ${getFlashClass(note)}`}
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
  
  export default HarmonicDictationKeyboardView;
  