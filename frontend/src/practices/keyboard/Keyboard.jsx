import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './Keyboard.css';

const white = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blacks = { C: 'Cs', D: 'Ds', F: 'Fs', G: 'Gs', A: 'As' };

const enharmonic = n => ({
  Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
  'C#': 'Cs', 'D#': 'Ds', 'F#': 'Fs', 'G#': 'Gs', 'A#': 'As'
}[n] || n);

const Keyboard = forwardRef(({ octaves = [3, 4, 5], onKeyClick }, ref) => {
  const [flash, setFlash] = useState([]);
  const [blue, setBlue] = useState([]);

  useImperativeHandle(ref, () => ({
    playNote: (note, flashIt = true) => {
      const url = `/clean_cut_notes/${encodeURIComponent(enharmonic(note))}.wav`;
      new Audio(url).play();
      if (flashIt) {
        setFlash([]); // Reset first
        requestAnimationFrame(() => {
          setFlash([note]);
          setTimeout(() => setFlash([]), 450);
        });
      }
    },
    setFlashBlue: (notes) => {
      setBlue(notes);
      setTimeout(() => setBlue([]), 500);
    }
  }));

  const clicked = note => {
    ref.current?.playNote(note);
    onKeyClick?.(note);
  };

  const cls = (note) => {
    const classes = [];
    if (flash.includes(note)) classes.push('keyboard-flash');
    if (blue.includes(note)) classes.push('keyboard-blue');
    return classes.join(' ');
  };

  return (
    <div className="keyboard-container">
      {octaves.sort().map(oct => (
        <div className="keyboard-octave" key={oct}>
          <div className="keyboard-white-keys">
            {white.map(w => {
              const n = `${w}${oct}`;
              return (
                <div
                  key={n}
                  className={`keyboard-white-key ${cls(n)}`}
                  onClick={() => clicked(n)}
                >
                  <div className="flash-overlay" />
                  <span className="keyboard-label">{n}</span>
                </div>
              );
            })}
          </div>
          <div className="keyboard-black-keys">
            {Object.entries(blacks).map(([w, b]) => {
              const n = `${b}${oct}`;
              return (
                <div
                  key={n}
                  className={`keyboard-black-key keyboard-${b} ${cls(n)}`}
                  onClick={() => clicked(n)}
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
});

export default Keyboard;
