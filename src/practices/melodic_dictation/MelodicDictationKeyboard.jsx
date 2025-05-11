// src/practices/melodic_dictation/MelodicDictationKeyboard.jsx

import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
  } from 'react';
  import './MelodicDictationKeyboard.css';
  
  const whiteNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackNotesMap = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };
  
  const normalizeNote = (note) => {
    const enharmonics = {
      Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
      'C#': 'Cs', 'D#': 'Ds', 'F#': 'Fs', 'G#': 'Gs', 'A#': 'As',
    };
    return enharmonics[note] || note;
  };
  
  const MelodicDictationKeyboard = forwardRef(
    ({ highlightNotes = [], onKeyClick, octaves = [4] }, ref) => {
      const [flashedKeys, setFlashedKeys] = useState([]);
      const [correctFlash, setCorrectFlash] = useState([]);
      const [wrongFlash, setWrongFlash] = useState([]);
  
      useEffect(() => {
        if (!highlightNotes.length) return;
        setFlashedKeys(highlightNotes.map(n => `${n}3`));
        const t = setTimeout(() => setFlashedKeys([]), 600);
        return () => clearTimeout(t);
      }, [highlightNotes]);
  
      useImperativeHandle(ref, () => ({
        playNote: (note, shouldFlash = true) => {
          const normalized = normalizeNote(note);
          const url = encodeURIComponent(`${normalized}.wav`);
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
        const normalized = normalizeNote(note);
        if (onKeyClick) {
          onKeyClick(note);
        } else {
          const url = encodeURIComponent(`${normalized}.wav`);
          new Audio(`/clean_cut_notes/${url}`).play();
          setFlashedKeys([note]);
          setTimeout(() => setFlashedKeys([]), 600);
        }
      };
  
      const getFlashClass = (note) => {
        if (correctFlash.includes(note)) return 'flash-correct';
        if (wrongFlash.includes(note)) return 'flash-wrong';
        const i = flashedKeys.indexOf(note);
        return i !== -1 ? `melodic_dictation_keyboard-flash-${i % 3}` : '';
      };
  
      return (
        <div className="melodic_dictation_keyboard-container">
          {[...octaves].sort((a, b) => a - b).map((oct) => (
            <div className="melodic_dictation_keyboard-octave" key={oct}>
              <div className="melodic_dictation_keyboard-white-keys">
                {whiteNotes.map((wn) => {
                  const note = `${wn}${oct}`;
                  return (
                    <div
                      key={note}
                      id={`key-${note}`}
                      className={`melodic_dictation_keyboard-white-key ${getFlashClass(note)}`}
                      onClick={() => handleClick(note)}
                    >
                      <div className="flash-overlay" />
                      <span className="melodic_dictation_keyboard-label">{note}</span>
                    </div>
                  );
                })}
              </div>
              <div className="melodic_dictation_keyboard-black-keys">
                {Object.entries(blackNotesMap).map(([wn, bn]) => {
                  const note = `${bn}${oct}`;
                  return (
                    <div
                      key={note}
                      id={`key-${note}`}
                      className={`melodic_dictation_keyboard-black-key melodic_dictation_keyboard-${bn} ${getFlashClass(note)}`}
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
  
  export default MelodicDictationKeyboard;
  