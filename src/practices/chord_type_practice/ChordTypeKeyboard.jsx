import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
  } from 'react';
  import './ChordTypeKeyboard.css';
  
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };
  
  const ChordTypeKeyboard = forwardRef(({ flashNotes = [] }, ref) => {
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
      highlightChord: (notes) => {
        setFlashedKeys(notes);
        setTimeout(() => setFlashedKeys([]), 600);
      },
      flashCorrect: () => {
        setCorrectFlash(flashedKeys);
        setTimeout(() => setCorrectFlash([]), 500);
      },
      flashWrong: () => {
        setWrongFlash(flashedKeys);
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
      if (correctFlash.includes(note)) return 'chord_type_game-flash-correct';
      if (wrongFlash.includes(note)) return 'chord_type_game-flash-wrong';
      const index = flashedKeys.indexOf(note);
      return index !== -1 ? `chord_type_game-flash-${index % 3}` : '';
    };
  
    return (
      <div className="chord_type_game-keyboard-container">
        {octaves.map((oct) => (
          <div className="chord_type_game-octave" key={oct}>
            <div className="chord_type_game-white-keys">
              {whiteNotes.map((wn) => {
                const note = `${wn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`chord_type_game-white-key ${getFlashClass(note)}`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flash-overlay"></div>
                    <span className="chord_type_game-label">{note}</span>
                  </div>
                );
              })}
            </div>
            <div className="chord_type_game-black-keys">
              {Object.entries(blackNotesMap).map(([wn, bn]) => {
                const note = `${bn}${oct}`;
                return (
                  <div
                    key={note}
                    id={`key-${note}`}
                    className={`chord_type_game-black-key chord_type_game-${bn} ${getFlashClass(note)}`}
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
  
  export default ChordTypeKeyboard;