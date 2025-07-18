import React, { useRef, useState } from 'react';
import Keyboard from './Keyboard';
import './KeyboardDemo.css';
import { chordNoteMap } from '../harmony_training/HarmonyTrainingData';
import { melodies } from '../chords_for_melody/melodies';

const SCALES = {
  'C Major': ['C','D','E','F','G','A','B','C'],
  'G Major': ['G','A','B','C','D','E','F#','G'],
  'D Major': ['D','E','F#','G','A','B','C#','D'],
  'A Major': ['A','B','C#','D','E','F#','G#','A'],
  'E Major': ['E','F#','G#','A','B','C#','D#','E'],
  'F Major': ['F','G','A','Bb','C','D','E','F'],
  'Bb Major': ['Bb','C','D','Eb','F','G','A','Bb'],
  'Eb Major': ['Eb','F','G','Ab','Bb','C','D','Eb'],
  'A Minor': ['A','B','C','D','E','F','G','A'],
  'E Minor': ['E','F#','G','A','B','C','D','E'],
  'D Minor': ['D','E','F','G','A','Bb','C','D'],
  'B Minor': ['B','C#','D','E','F#','G','A','B'],
  'G Minor': ['G','A','Bb','C','D','Eb','F','G'],
  'C Minor': ['C','D','Eb','F','G','Ab','Bb','C'],
  'F Minor': ['F','G','Ab','Bb','C','Db','Eb','F'],
};

const flats = { Bb:'As', Eb:'Ds', Ab:'Gs', Db:'Cs', Gb:'Fs' };
const norm = n => flats[n] || n.replace('#','s');
const SEMI = { C:0,Cs:1,D:2,Ds:3,E:4,F:5,Fs:6,G:7,Gs:8,A:9,As:10,B:11 };
const CHORDS = Object.keys(chordNoteMap);
const PACE_MS = { Slow: 600, Medium: 400, Fast: 200 };
const melodyOptions = Object.entries(melodies);

export default function KeyboardDemo() {
  const kbRef = useRef();
  const [scale, setScale] = useState('C Major');
  const [chord, setChord] = useState('C');
  const [scalePace, setScalePace] = useState('Medium');
  const [arpeggio, setArpeggio] = useState(false);
  const [melodyKey, setMelodyKey] = useState(melodyOptions[0][0]);

  const playScale = () => {
    const notes = SCALES[scale].map(norm);
    let octave = 4;
    let lastSemi = SEMI[notes[0]];
    const delay = PACE_MS[scalePace];

    notes.forEach((n, i) => {
      const s = SEMI[n];
      if (i > 0 && s <= lastSemi) octave++;
      lastSemi = s;
      const full = `${n}${octave}`;

      setTimeout(() => {
        if (i === 0) kbRef.current?.setFlashBlue([full]);
        kbRef.current?.playNote(full);
      }, i * delay);
    });
  };

  const playChord = () => {
    const notes = chordNoteMap[chord] || [];
    const delayPerNote = PACE_MS[scalePace];
    if (arpeggio) {
      notes.forEach((n, i) => {
        setTimeout(() => {
          kbRef.current?.setFlashBlue([n]);
          kbRef.current?.playNote(n);
        }, i * delayPerNote);
      });
    } else {
      kbRef.current?.setFlashBlue(notes);
      notes.forEach(n => kbRef.current?.playNote(n));
    }
  };

  const playMelody = () => {
    const melody = melodies[melodyKey];
    const delayPerBeat = 60000 / melody.tempo;

    let totalDelay = 0;
    melody.notes.forEach(({ note, duration }) => {
      setTimeout(() => {
        kbRef.current?.setFlashBlue([note]);
        kbRef.current?.playNote(note);
      }, totalDelay);
      totalDelay += delayPerBeat * duration;
    });
  };

  const playMelodyWithChords = (isArpeggio) => {
    const melody = melodies[melodyKey];
    const delayPerBeat = 60000 / melody.tempo;
    const [beatsPerBar] = melody.timeSignature;
    const chordSchedule = melody.suggestedChords || [];
    const melodyNotes = melody.notes;

    let totalDelay = 0;
    let barIndex = 0;
    let beatsInBar = 0;

    melodyNotes.forEach(({ note, duration }) => {
      const isNewBar = beatsInBar === 0 && barIndex < chordSchedule.length;
      const chord = chordSchedule[barIndex];
      const chordNotes = chordNoteMap[chord] || [];

      // Play chord at start of bar (no flash)
      if (isNewBar) {
        if (isArpeggio) {
          chordNotes.forEach((n, i) => {
            setTimeout(() => {
              kbRef.current?.playNote(n, false); // disable flash
            }, totalDelay + i * delayPerBeat);
          });
        } else {
          setTimeout(() => {
            chordNotes.forEach(n => kbRef.current?.playNote(n, false)); // disable flash
          }, totalDelay);
        }
      }

      // Flash melody note
      setTimeout(() => {
        if (isArpeggio) {
          kbRef.current?.setFlashBlue([note]); // always flash in arpeggio
        } else {
          const normNote = note.replace(/[0-9]/g, '');
          const isInChord = chordNotes.some(cn => cn.startsWith(normNote));
          if (!isInChord) kbRef.current?.setFlashBlue([note]);
        }
        kbRef.current?.playNote(note); // melody always plays
      }, totalDelay);

      totalDelay += delayPerBeat * duration;
      beatsInBar += duration;
      if (beatsInBar >= beatsPerBar) {
        beatsInBar = 0;
        barIndex += 1;
      }
    });
  };

  return (
    <div className="keyboard-demo-container">
      <nav className="keyboard-demo-navbar">
        <div className="keyboard-demo-logo">🎹 Keyboard Demo</div>

        <div className="keyboard-demo-controls">
          {/* Scale */}
          <div className="keyboard-demo-group">
            <label className="keyboard-demo-label">Scale:</label>
            <select value={scale} onChange={e => setScale(e.target.value)} className="keyboard-demo-dropdown">
              {Object.keys(SCALES).map(s => <option key={s}>{s}</option>)}
            </select>

            <label className="keyboard-demo-label">Pace:</label>
            <select value={scalePace} onChange={e => setScalePace(e.target.value)} className="keyboard-demo-dropdown">
              {Object.keys(PACE_MS).map(p => <option key={p}>{p}</option>)}
            </select>

            <button className="keyboard-demo-btn" onClick={playScale}>▶️ Play Scale</button>
          </div>

          {/* Chord */}
          <div className="keyboard-demo-group">
            <label className="keyboard-demo-label">Chord:</label>
            <select value={chord} onChange={e => setChord(e.target.value)} className="keyboard-demo-dropdown">
              {CHORDS.map(c => <option key={c}>{c}</option>)}
            </select>

            <label className="keyboard-demo-label">Mode:</label>
            <select value={arpeggio ? 'Arpeggio' : 'Block'} onChange={e => setArpeggio(e.target.value === 'Arpeggio')} className="keyboard-demo-dropdown">
              <option>Block</option>
              <option>Arpeggio</option>
            </select>

            <button className="keyboard-demo-btn" onClick={playChord}>🎵 Play Chord</button>
          </div>

          {/* Melody */}
          <div className="keyboard-demo-group">
            <label className="keyboard-demo-label">Melody:</label>
            <select value={melodyKey} onChange={e => setMelodyKey(e.target.value)} className="keyboard-demo-dropdown">
              {melodyOptions.map(([key, m]) => (
                <option key={key} value={key}>{m.name}</option>
              ))}
            </select>

            <button className="keyboard-demo-btn" onClick={playMelody}>🎶 Play Melody</button>
            <button className="keyboard-demo-btn" onClick={() => playMelodyWithChords(false)}>🎼 Block + Melody</button>
            <button className="keyboard-demo-btn" onClick={() => playMelodyWithChords(true)}>🎼 Arpeggio + Melody</button>
          </div>
        </div>
      </nav>

      <div className="keyboard-demo-keyboard-area">
        <Keyboard ref={kbRef} octaves={[3, 4, 5, 6]} />
      </div>
    </div>
  );
}
