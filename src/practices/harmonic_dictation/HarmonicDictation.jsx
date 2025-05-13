
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './HarmonicDictation.css';

import HarmonicDictationKeyboardView from './HarmonicDictationKeyboardView';
import {
  chordNoteMap,
  scaleChordsMap,
} from '../harmony_training/HarmonyTrainingData';
import { progressionBank } from './ProgressionBank';

/* ── perfect‑fifth helper (for V7/x resolution) ────────────── */
const NOTE_TO_SEMI = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4,
  F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8,
  A: 9, 'A#': 10, Bb: 10, B: 11,
};
const SEMI_TO_NOTE = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
];
const fifthUp = (root) =>
  SEMI_TO_NOTE[(NOTE_TO_SEMI[root] + 7) % 12] || root;

/* ── helpers ──────────────────────────────────────────────── */
const normalizeChord = (c) => c.trim().replace(/♭/g, 'b').replace(/♯/g, '#');

/* Roman‑numeral (plus secondary dominants) → concrete chord */
const degreeToChord = (deg, scale) => {
  /* V7/ii, V7/vi … */
  const m = /^V7\/([ivIV]+)$/.exec(deg);
  if (m) {
    const target = m[1];                          // "ii"
    const tgtChord = degreeToChord(target, scale);
    const root = /^([A-G](?:#|b)?)/.exec(tgtChord)?.[1];
    return root ? `${fifthUp(root)}7` : deg;      // "A7"
  }

  /* plain diatonic numerals */
  const diatonic = scaleChordsMap[scale] || [];
  const idx = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 }[
    deg.replace(/°/g, '').toUpperCase()
  ];
  return idx !== undefined ? diatonic[idx] : deg;
};

/* ── BANK‑SELECTION (new “special‑first” rule) ─────────────── */
const getAllPlayableProgressions = (scale, selectedChords) => {
  if (!selectedChords.length) return [];

  const selected = new Set(selectedChords.map(normalizeChord));
  const diatonic = new Set(scaleChordsMap[scale].map(normalizeChord));
  const special = [...selected].filter((c) => !diatonic.has(c)); // e.g. "A7"

  /* build metadata for every progression‑bank category */
  const categories = Object.entries(progressionBank)
    .map(([key, progs]) => {
      const chordSet = new Set();
      progs.forEach((p) =>
        p.forEach((deg) => chordSet.add(normalizeChord(degreeToChord(deg, scale))))
      );
      return { key, progs, chordSet };
    })
    .filter(({ chordSet }) => [...chordSet].every((c) => selected.has(c)));

  if (!categories.length) return [];

  /* 1️⃣  If the user picked special chords, keep only categories
         that contain **all** of them.                           */
  let filtered = categories;
  if (special.length) {
    filtered = categories.filter(({ chordSet }) =>
      special.every((sp) => chordSet.has(sp))
    );
    /* fall back to all categories if none matched specials */
    if (!filtered.length) filtered = categories;
  }

  /* 2️⃣  Among remaining categories choose the largest (by chord‑set size) */
  const max = Math.max(...filtered.map((c) => c.chordSet.size));
  const best = filtered.filter((c) => c.chordSet.size === max);

  /* 3️⃣  Flatten to concrete‑chord progressions */
  return best.flatMap(({ progs }) =>
    progs.map((p) => p.map((deg) => degreeToChord(deg, scale)))
  );
};
   
   /* play a whole chord sequence with a fixed gap */
   const playChordSequence = (seq, play, gap = 700) =>
     seq.forEach((ch, i) => setTimeout(() => play(ch), gap * i));
   
   /* ── component ─────────────────────────────────────────────── */
   export default function HarmonicDictation() {
     const { state } = useLocation();
     const navigate = useNavigate();
     const keyboardRef = useRef();
   
     /* props from settings */
     const {
       selectedScale = 'C',
       selectedChords = [],
       rounds = 10,
     } = state || {};
   
     const tonic = normalizeChord(selectedScale.replace(/m$/, ''));
   
     /* ── reactive state ── */
     const [progressions, setProgressions] = useState([]);
     const [currentRound, setCurrentRound] = useState(0);
     const [currentStep, setCurrentStep] = useState(0);
     const [correct, setCorrect] = useState(0);
     const [wrong, setWrong] = useState(0);
     const [tries, setTries] = useState(0);
     const [isPlaying, setIsPlaying] = useState(false);
     const [canAnswer, setCanAnswer] = useState(false);
     const [roundMistake, setRoundMistake] = useState(false);
     const [wrongAlreadyCounted, setWrongAlreadyCounted] = useState(false);
     const [awaitRetry, setAwaitRetry] = useState(false);
     const [popup, setPopup] = useState(false);
     const [flashMap, setFlashMap] = useState({});
     const [statFlash, setStatFlash] = useState('');
     const [msg, setMsg] = useState('');
   
     /* ── audio helpers ── */
     const playNote = (n) =>
       new Audio(`/clean_cut_notes/${encodeURIComponent(n)}.wav`).play();
     const playChord = (c) =>
       (chordNoteMap[normalizeChord(c)] || []).forEach(playNote);
   
     const flashBtn = (c, type) => {
       const key = normalizeChord(c);
       setFlashMap((p) => ({ ...p, [key]: type }));
       setTimeout(() => setFlashMap((p) => ({ ...p, [key]: null })), 500);
     };
   
     /* ── game flow ────────────────────────────────────────────── */
     const startGame = () => {
       const playable = getAllPlayableProgressions(selectedScale, selectedChords);
       if (!playable.length) return;                     // nothing fits
   
       const picked = Array.from({ length: rounds }, () =>
         playable[Math.floor(Math.random() * playable.length)]
       );
   
       setProgressions(picked);
       setCurrentRound(0);
       setCurrentStep(0);
       setCorrect(0);
       setWrong(0);
       setTries(0);
       setRoundMistake(false);
       setWrongAlreadyCounted(false);
       setIsPlaying(true);
       setCanAnswer(false);
       setAwaitRetry(false);
       setMsg('');
       setPopup(false);
   
       playChordSequence(picked[0], playChord);
       setTimeout(() => setCanAnswer(true), picked[0].length * 700);
     };
   
     /* replay */
     const handleCurrent = () => {
       if (!isPlaying) return;
       const prog = progressions[currentRound];
       if (!prog) return;
   
       setAwaitRetry(false);
       setMsg('🔁 Listen again...');
       playChordSequence(prog, playChord);
       setTimeout(() => setCanAnswer(true), prog.length * 700);
     };
   
     /* ── answering logic ─────────────────────────────────────── */
     const handleAnswer = (c) => {
       if (!canAnswer || !isPlaying) return;
   
       const guess = normalizeChord(c);
       const prog = progressions[currentRound];
       if (!prog) return;
   
       /* first chord in attempt → tries++ */
       if (currentStep === 0) {
         setTries((t) => t + 1);
         setStatFlash('tries');
         setTimeout(() => setStatFlash(''), 400);
       }
   
       const expected = normalizeChord(prog[currentStep]);
       const notes = chordNoteMap[guess];
       if (!notes) return;
   
       if (guess === expected) {
         /* ✅ correct */
         keyboardRef.current?.setFlashRight(notes);
         flashBtn(guess, 'correct');
         const nextStep = currentStep + 1;
   
         if (nextStep >= prog.length) {
           /* round over */
           if (!roundMistake) {
             setCorrect((n) => n + 1);
             setStatFlash('correct');
             setTimeout(() => setStatFlash(''), 400);
             setMsg('✅ You’re right!');
           } else {
             setMsg('🙂 Got it on the second try!');
           }
   
           const nextRound = currentRound + 1;
           if (nextRound >= progressions.length) {
             setIsPlaying(false);
             setPopup(true);
           } else {
             setCurrentRound(nextRound);
             setCurrentStep(0);
             setRoundMistake(false);
             setWrongAlreadyCounted(false);
             setCanAnswer(false);
             setMsg('');
             playChordSequence(progressions[nextRound], playChord);
             setTimeout(
               () => setCanAnswer(true),
               progressions[nextRound].length * 700
             );
           }
         } else {
           setCurrentStep(nextStep);
         }
       } else {
         /* ❌ wrong */
         keyboardRef.current?.setFlashWrong(notes);
         flashBtn(guess, 'wrong');
   
         if (!wrongAlreadyCounted) {
           setWrong((n) => n + 1);
           setStatFlash('wrong');
           setTimeout(() => setStatFlash(''), 400);
           setWrongAlreadyCounted(true);
         }
   
         setRoundMistake(true);
         setAwaitRetry(true);
         setCurrentStep(0);
         setCanAnswer(false);
         setMsg('❌ Wrong! Click “Current” to listen again.');
       }
     };
   
     /* ── render ──────────────────────────────────────────────── */
     const rows = selectedChords.length > 12 ? 2 : 1;
     const cols = Math.ceil((selectedChords.length || 1) / rows);
     const unique = [...new Set(selectedChords.map(normalizeChord))];
   
     return (
       <div className="harmony_dictation-container">
         {/* navbar */}
         <nav className="harmony_dictation-navbar">
           <div className="harmony_dictation-navbar-left">
             <div className="harmony_dictation-logo">Sabers Harmony</div>
             <button
               className="harmony_dictation-btn"
               onClick={() => playChord(tonic)}
             >
               {tonic}
             </button>
             <button
               className={`harmony_dictation-btn ${
                 awaitRetry ? 'bounce-flash' : ''
               }`}
               onClick={handleCurrent}
             >
               Current
             </button>
           </div>
   
           <div className="harmony_dictation-stats">
             <span className="harmony_dictation-stat total">{rounds}</span>/
             <span
               className={`harmony_dictation-stat current ${
                 statFlash === 'current' ? 'stat-flash' : ''
               }`}
             >
               {currentRound}
             </span>/
             <span
               className={`harmony_dictation-stat correct ${
                 statFlash === 'correct' ? 'stat-flash' : ''
               }`}
             >
               {correct}
             </span>/
             <span
               className={`harmony_dictation-stat wrong ${
                 statFlash === 'wrong' ? 'stat-flash' : ''
               }`}
             >
               {wrong}
             </span>/
             <span
               className={`harmony_dictation-stat tries ${
                 statFlash === 'tries' ? 'stat-flash' : ''
               }`}
             >
               {tries}
             </span>
           </div>
   
           <button
             className="harmony_dictation-btn harmony_dictation-start-btn"
             onClick={startGame}
           >
             {isPlaying ? 'Restart' : 'Start'}
           </button>
         </nav>
   
         {/* floating status message */}
         {msg && <div className="harmony_dictation-floating-message">{msg}</div>}
   
         <div className="harmony_dictation-fill-space" />
   
         {/* chord buttons + keyboard */}
         <div className="harmony_dictation-bottom">
           <div
             className="harmony_dictation-chords"
             style={{
               gridTemplateRows: `repeat(${rows}, 1fr)`,
               gridTemplateColumns: `repeat(${cols}, 1fr)`,
             }}
           >
             {unique.map((ch) => (
               <button
                 key={ch}
                 className={`harmony_dictation-chord-btn ${
                   flashMap[ch] === 'correct' ? 'btn-flash-correct' : ''
                 } ${flashMap[ch] === 'wrong' ? 'btn-flash-wrong' : ''}`}
                 onClick={() => handleAnswer(ch)}
               >
                 {ch}
               </button>
             ))}
           </div>
   
           <div className="harmony_dictation-keyboard">
             <HarmonicDictationKeyboardView ref={keyboardRef} />
           </div>
         </div>
   
         {/* popup */}
         {popup && (
           <div className="harmony_dictation-popup-overlay">
             <div className="harmony_dictation-popup">
               <h2>🎉 Game Over!</h2>
               <p>You completed the harmonic dictation!</p>
               <p>
                 <strong>Correct:</strong> {correct}
               </p>
               <p>
                 <strong>Wrong:</strong> {wrong}
               </p>
               <p>
                 <strong>Total Tries:</strong> {tries}
               </p>
               <div className="harmony_dictation-popup-buttons">
                 <button onClick={startGame}>🔁 Restart</button>
                 <button onClick={() => navigate('/harmonic')}>
                   ⚙️ Back to Settings
                 </button>
               </div>
             </div>
           </div>
         )}
       </div>
     );
   }
   