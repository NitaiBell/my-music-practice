import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import './PingPongHarmonyKeyboardView.css';

const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };

const PingPongHarmonyKeyboardView = forwardRef(({ flashNotes = [] }, ref) => {
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
    return index !== -1 ? `harmony-flash-${index % 3}` : '';
  };

  return (
    <div className="harmony-keyboard-container">
      {octaves.map((oct) => (
        <div className="harmony-octave" key={oct}>
          <div className="harmony-white-keys">
            {whiteNotes.map((wn) => {
              const note = `${wn}${oct}`;
              return (
                <div
                  key={note}
                  id={`key-${note}`}
                  className={`harmony-white-key ${getFlashClass(note)}`}
                  onClick={() => handleNoteClick(note)}
                >
                  <div className="flash-overlay"></div>
                  <span className="harmony-label">{note}</span>
                </div>
              );
            })}
          </div>
          <div className="harmony-black-keys">
            {Object.entries(blackNotesMap).map(([wn, bn]) => {
              const note = `${bn}${oct}`;
              return (
                <div
                  key={note}
                  id={`key-${note}`}
                  className={`harmony-black-key harmony-${bn} ${getFlashClass(note)}`}
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

export default PingPongHarmonyKeyboardView;
