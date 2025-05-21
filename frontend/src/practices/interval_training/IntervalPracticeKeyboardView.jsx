import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
  } from 'react';
  import './IntervalPracticeKeyboardView.css';
  
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };
  
  const normalizeNote = (note) => {
    const enharmonics = {
      Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
      'C#': 'Cs', 'D#': 'Ds', 'F#': 'Fs', 'G#': 'Gs', 'A#': 'As',
    };
    return enharmonics[note] || note;
  };
  
  const IntervalPracticeKeyboardView = forwardRef(
    ({ highlightNotes = [], onKeyClick, octaves = [4], highlightColor = 'blue' }, ref) => {
      const [flashedKeys, setFlashedKeys] = useState([]);
      const [correctFlash, setCorrectFlash] = useState([]);
      const [wrongFlash, setWrongFlash] = useState([]);
  
      // 🔵 Keep the highlighted note persistent for the round
      useEffect(() => {
        setFlashedKeys(highlightNotes);
      }, [highlightNotes]);
  
      useImperativeHandle(ref, () => ({
        playNote: (note, shouldFlash = true) => {
          const normalized = normalizeNote(note);
          new Audio(`/clean_cut_notes/${normalized}.wav`).play();
          if (shouldFlash) {
            setFlashedKeys([note]);
            setTimeout(() => setFlashedKeys([]), 600);
          }
        },
        setFlashRight: (note) => {
          const arr = Array.isArray(note) ? note : [note];
          setCorrectFlash(arr);
          setTimeout(() => setCorrectFlash([]), 600);
        },
        setFlashWrong: (note) => {
          const arr = Array.isArray(note) ? note : [note];
          setWrongFlash(arr);
          setTimeout(() => setWrongFlash([]), 600);
        },
      }));
  
      const handleClick = (note) => {
        const normalized = normalizeNote(note);
        if (onKeyClick) {
          onKeyClick(note);
        } else {
          new Audio(`/clean_cut_notes/${normalized}.wav`).play();
          setFlashedKeys([note]);
          setTimeout(() => setFlashedKeys([]), 600);
        }
      };
  
      const getFlashClass = (note) => {
        if (correctFlash.includes(note)) return 'flash-correct';
        if (wrongFlash.includes(note)) return 'flash-wrong';
        if (flashedKeys.includes(note)) return `flash-${highlightColor}`;
        return '';
      };
  
      return (
        <div className="interval-practice-keyboard-container">
          {[...octaves].sort((a, b) => a - b).map((oct) => (
            <div className="interval-practice-octave" key={oct}>
              <div className="interval-practice-white-keys">
                {whiteNotes.map((wn) => {
                  const note = `${wn}${oct}`;
                  return (
                    <div
                      key={note}
                      className={`interval-practice-white-key ${getFlashClass(note)}`}
                      onClick={() => handleClick(note)}
                    >
                      <div className="flash-overlay" />
                      <span className="interval-practice-label">{note}</span>
                    </div>
                  );
                })}
              </div>
              <div className="interval-practice-black-keys">
                {Object.entries(blackNotesMap).map(([wn, bn]) => {
                  const note = `${bn}${oct}`;
                  return (
                    <div
                      key={note}
                      className={`interval-practice-black-key interval-practice-${bn} ${getFlashClass(note)}`}
                      onClick={() => handleClick(note)}
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
    }
  );
  
  export default IntervalPracticeKeyboardView;
  