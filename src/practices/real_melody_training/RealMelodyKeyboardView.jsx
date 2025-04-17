import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './RealMelodyKeyboardView.css';

const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };

const RealMelodyKeyboardView = forwardRef(
  ({ highlightNotes = [], onKeyClick, octaves = [4] }, ref) => {
    const [flashedKeys, setFlashedKeys] = useState([]);
    const [correctFlash, setCorrectFlash] = useState([]);
    const [wrongFlash, setWrongFlash] = useState([]);

    useEffect(() => {
      if (!highlightNotes.length) return;
      setFlashedKeys(highlightNotes.map(n => `${n}3`)); // flash only octave 3 in settings
      const t = setTimeout(() => setFlashedKeys([]), 600);
      return () => clearTimeout(t);
    }, [highlightNotes]);

    useImperativeHandle(ref, () => ({
      playNote: (note, shouldFlash = true) => {
        const url = encodeURIComponent(`${note}.wav`);
        new Audio(`/clean_cut_notes/${url}`).play();
        if (shouldFlash) {
          setFlashedKeys([note]);
          setTimeout(() => setFlashedKeys([]), 600);
        }
      },
      setFlashRight: (note) => {
        const arr = Array.isArray(note) ? note : [note];
        setCorrectFlash(arr);
        setTimeout(() => setCorrectFlash([]), 500);
      },
      setFlashWrong: (note) => {
        const arr = Array.isArray(note) ? note : [note];
        setWrongFlash(arr);
        setTimeout(() => setWrongFlash([]), 500);
      },
    }));

    const handleClick = (note) => {
      if (onKeyClick) {
        onKeyClick(note);
      } else {
        const url = encodeURIComponent(`${note}.wav`);
        new Audio(`/clean_cut_notes/${url}`).play();
        setFlashedKeys([note]);
        setTimeout(() => setFlashedKeys([]), 600);
      }
    };

    const getFlashClass = (note) => {
      if (correctFlash.includes(note)) return 'flash-correct';
      if (wrongFlash.includes(note)) return 'flash-wrong';
      const i = flashedKeys.indexOf(note);
      return i !== -1 ? `real-melody-flash-${i % 3}` : '';
    };

    return (
      <div className="real-melody-keyboard-container">
        {[...octaves].sort((a, b) => a - b).map((oct) => (
          <div className="real-melody-octave" key={oct}>
            <div className="real-melody-white-keys">
              {whiteNotes.map((wn) => {
                const note = `${wn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`real-melody-white-key ${getFlashClass(note)}`}
                    onClick={() => handleClick(note)}
                  >
                    <div className="flash-overlay" />
                    <span className="real-melody-label">{note}</span>
                  </div>
                );
              })}
            </div>
            <div className="real-melody-black-keys">
              {Object.entries(blackNotesMap).map(([wn, bn]) => {
                const note = `${bn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`real-melody-black-key real-melody-${bn} ${getFlashClass(note)}`}
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

export default RealMelodyKeyboardView;
