import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
  } from 'react';
  import './LearnPianoChordsKeyboardView.css';
  
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };
  
  const LearnPianoChordsKeyboardView = forwardRef(({ flashNotes = [], showLabels = true }, ref) => {
    const octaves = [2, 3, 4];
    const [blueFlash, setBlueFlash] = useState([]);
    const [correctFlash, setCorrectFlash] = useState([]);
    const [wrongFlash, setWrongFlash] = useState([]);
  
    useEffect(() => {
      if (flashNotes.length === 0) return;
      setBlueFlash(flashNotes);
      const timer = setTimeout(() => setBlueFlash([]), 600);
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
      setFlashBlue: (notes) => {
        setBlueFlash(notes);
        setTimeout(() => setBlueFlash([]), 600);
      },
    }));
  
    const handleNoteClick = (note) => {
      const encoded = encodeURIComponent(`${note}.wav`);
      const audio = new Audio(`/clean_cut_notes/${encoded}`);
      audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
    };
  
    const getFlashClass = (note) => {
      if (correctFlash.includes(note)) return 'flash-correct';
      if (wrongFlash.includes(note)) return 'flash-wrong';
      if (blueFlash.includes(note)) return 'flash-blue';
      return '';
    };
  
    return (
      <div className="learn_piano_chords-keyboard-container">
        {octaves.map((oct) => (
          <div className="learn_piano_chords-octave" key={oct}>
            <div className="learn_piano_chords-white-keys">
              {whiteNotes.map((wn) => {
                const note = `${wn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`learn_piano_chords-white-key ${getFlashClass(note)}`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flash-overlay"></div>
                    {showLabels && <span className="learn_piano_chords-label">{note}</span>}
                  </div>
                );
              })}
            </div>
            <div className="learn_piano_chords-black-keys">
              {Object.entries(blackNotesMap).map(([wn, bn]) => {
                const note = `${bn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`learn_piano_chords-black-key learn_piano_chords-${bn} ${getFlashClass(note)}`}
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
  
  export default LearnPianoChordsKeyboardView;
  