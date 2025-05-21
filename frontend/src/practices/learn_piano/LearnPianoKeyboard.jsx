import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
  } from 'react';
  import './LearnPianoKeyboard.css';
  
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };
  
  const normalizeNote = (note) => {
    const enharmonics = {
      Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
      'C#': 'Cs', 'D#': 'Ds', 'F#': 'Fs', 'G#': 'Gs', 'A#': 'As',
    };
    return enharmonics[note] || note;
  };
  
  const LearnPianoKeyboard = forwardRef(
    ({ onKeyClick, octaves = [3, 4, 5], tonic = 'C', showLabels = true }, ref) => {
      const [flashBlue, setFlashBlue] = useState([]);
      const [flashGreen, setFlashGreen] = useState([]);
      const [flashRed, setFlashRed] = useState([]);
  
      useImperativeHandle(ref, () => ({
        playNote: (note) => {
          const normalized = normalizeNote(note);
          new Audio(`/clean_cut_notes/${normalized}.wav`).play();
        },
        setFlashBlue: (note) => {
          const arr = Array.isArray(note) ? note : [note];
          setFlashBlue(arr);
          setTimeout(() => setFlashBlue([]), 500);
        },
        setFlashRight: (note) => {
          const arr = Array.isArray(note) ? note : [note];
          setFlashGreen(arr);
          setTimeout(() => setFlashGreen([]), 500);
        },
        setFlashWrong: (note) => {
          const arr = Array.isArray(note) ? note : [note];
          setFlashRed(arr);
          setTimeout(() => setFlashRed([]), 500);
        },
      }));
  
      const handleClick = (note) => {
        onKeyClick?.(note);
        const normalized = normalizeNote(note);
        new Audio(`/clean_cut_notes/${normalized}.wav`).play();
      };
  
      const getFlashClass = (note) => {
        if (flashGreen.includes(note)) return 'flash-correct';
        if (flashRed.includes(note)) return 'flash-wrong';
        if (flashBlue.includes(note)) return 'flash-blue';
        if (getNoteBase(note) === tonic) return 'learn_piano-tonic';
        return '';
      };
      
  
      const getNoteBase = (note) => note.replace(/\d/, '');
  
      return (
        <div className="learn_piano-keyboard-container">
          {octaves.map((oct) => (
            <div className="learn_piano-octave" key={oct}>
              <div className="learn_piano-white-keys">
                {whiteNotes.map((wn) => {
                  const note = `${wn}${oct}`;
                  return (
                    <div
                      key={note}
                      id={`key-${note}`}
                      className={`learn_piano-white-key ${getFlashClass(note)}`}
                      onClick={() => handleClick(note)}
                    >
                      <div className="flash-overlay" />
                      {showLabels && <span className="learn_piano-label">{note}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="learn_piano-black-keys">
                {Object.entries(blackNotesMap).map(([wn, bn]) => {
                  const note = `${bn}${oct}`;
                  return (
                    <div
                      key={note}
                      id={`key-${note}`}
                      className={`learn_piano-black-key learn_piano-${bn} ${getFlashClass(note)}`}
                      onClick={() => handleClick(note)}
                    >
                      <div className="flash-overlay" />
                      {/* Optional black key label if desired:
                      {showLabels && <span className="learn_piano-label">{note}</span>} */}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }
  );
  
  export default LearnPianoKeyboard;
  