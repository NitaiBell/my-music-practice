import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './HarmonicDictation.css';

import HarmonicDictationKeyboardView from './HarmonicDictationKeyboardView';
import {
  chordNoteMap,
  scaleChordsMap,
  chordFunctionsByScale,   // ← NEW
} from '../harmony_training/HarmonyTrainingData';
import { progressionBank } from './ProgressionBank';
import { calculateHarmonicDictationRank } from './calculateHarmonicDictationRank';
import { logPracticeResult } from '../../../utils/logPracticeResult';
import { PRACTICE_NAMES } from '../../../utils/constants';

/* ─── Pitch ↔︎ semitone helpers ────────────────────────────── */
const NOTE_TO_SEMI = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3,
  E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8,
  Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};
const SEMI_TO_NOTE = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
];
const fifthUp = (root) => SEMI_TO_NOTE[(NOTE_TO_SEMI[root] + 7) % 12];
const normalizeChord = (c) =>
  (c ? c.trim().replace(/♭/g, 'b').replace(/♯/g, '#') : '');

/* ─── Enharmonic helpers ───────────────────────────────────── */
const enharmonic = (note) => {
  if (!note) return null;
  const semi = NOTE_TO_SEMI[note];
  if (semi == null) return null;
  const sharp = SEMI_TO_NOTE[semi];
  const flatTable = { 1: 'Db', 3: 'Eb', 6: 'Gb', 8: 'Ab', 10: 'Bb' };
  const flat = flatTable[semi] || sharp;
  return note === sharp ? flat : sharp;
};

/* ─── Root helper (no quality) ─────────────────────────────── */
const getRoot = (ch) =>
  /^([A-G](?:#|b)?)/.exec(ch || '')?.[1] || ch;

/* ─── Find a playable chord spelling in chordNoteMap ───────── */
const findChord = (root, quality = '') => {
  if (!root) return undefined;
  const want = normalizeChord(`${root}${quality}`);
  const altRoot = enharmonic(root);
  const altWant = altRoot ? normalizeChord(`${altRoot}${quality}`) : null;

  const candidates = Object.keys(chordNoteMap);

  // 1️⃣ exact match (incl. enharmonic)
  let hit = candidates.find((c) => {
    const n = normalizeChord(c);
    return n === want || (altWant && n === altWant);
  });
  if (hit) return hit;

  // 2️⃣ major-triad fallback
  if (quality === '') {
    hit = candidates.find((c) => normalizeChord(c).startsWith(normalizeChord(root)));
    if (hit) return hit;
    if (altRoot) {
      hit = candidates.find((c) =>
        normalizeChord(c).startsWith(normalizeChord(altRoot)),
      );
      if (hit) return hit;
    }
  }

  // 3️⃣ last resort
  return undefined;
};

/* ─── Degree → chord (null-safe) ───────────────────────────── */
const degreeToChord = (deg, scale) => {
  if (!deg) return deg;

  /* 🛣 1. short-circuit look-up in HarmonyTrainingData */
  const direct = chordFunctionsByScale[scale]?.[deg];
  if (direct) return direct;

  /* 🛣 2. original logic … */
  const diatonic = scaleChordsMap[scale] || [];

  // secondary dominants (V7/ii, etc.)
  const secDomMatch = /^V7\/(.+)$/i.exec(deg);
  if (secDomMatch) {
    const targetChord = degreeToChord(secDomMatch[1], scale);
    const root = getRoot(targetChord);
    return root ? `${fifthUp(root)}7` : deg;
  }

  const tonic = normalizeChord(scale?.replace(/m$/, ''));
  const tonicSemi = NOTE_TO_SEMI[tonic];
  if (tonicSemi == null) return deg;

  const makeRoot = (offset) => SEMI_TO_NOTE[(tonicSemi + offset) % 12];

  const customMap = {
    iv:      () => findChord(makeRoot(5), 'm') || `${makeRoot(5)}m`,
    sharpIII:() => findChord(makeRoot(4))      || makeRoot(4),
    flatIII: () => findChord(makeRoot(3))      || makeRoot(3),
    chromaticMediant: () =>
      findChord(makeRoot(8), 'm') || `${makeRoot(8)}m`,
    flatVII: () => findChord(makeRoot(10))     || makeRoot(10),
    flatVI:  () => findChord(makeRoot(8))      || makeRoot(8),
    neapolitan: () => findChord(makeRoot(1))   || makeRoot(1),
    v: () => findChord(makeRoot(7), 'm')       || `${makeRoot(7)}m`,
    IV7: () => findChord(makeRoot(5), '7')     || `${makeRoot(5)}7`,
    V7:  () => findChord(fifthUp(tonic), '7')  || `${fifthUp(tonic)}7`,
    V7_iv: () => findChord(makeRoot(5), '7')   || `${makeRoot(5)}7`,

    V_iii: () => {
      const base = degreeToChord('III', scale);      // e.g. "Em"
      const r = fifthUp(getRoot(base));               // "B"
      return findChord(r) || r;
    },
    V_V: () => {
      const r = fifthUp(getRoot(degreeToChord('V', scale)));
      return findChord(r) || r;
    },
    V7_V: () => {
      const r = fifthUp(getRoot(degreeToChord('V', scale)));
      return findChord(r, '7') || `${r}7`;
    },
    V7_iii: () => {
      const r = fifthUp(getRoot(degreeToChord('III', scale)));
      return findChord(r, '7') || `${r}7`;
    },
    ii_vi: () => {
      const r = fifthUp(getRoot(degreeToChord('VI', scale)));
      return findChord(r, 'm') || `${r}m`;
    },
  };

  if (customMap[deg]) {
    const result = customMap[deg]();
    return result || deg;
  }

  // Diatonic I–VII
  const idx = {
    I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6,
  }[(deg || '').replace(/\u00B0/g, '').toUpperCase()];
  return idx !== undefined ? diatonic[idx] : deg;
};

/* ─── Helper: pick playable progressions ───────────────────── */
const getAllPlayableProgressions = (scale, selectedChords) => {
  if (!selectedChords.length) return [];
  const sel = new Set(selectedChords.map(normalizeChord));
  const diatonic = new Set(scaleChordsMap[scale].map(normalizeChord));
  const special = [...sel].filter((c) => !diatonic.has(c));

  const categories = Object.entries(progressionBank)
    .map(([key, progs]) => {
      const set = new Set();
      progs.forEach((p) =>
        p.forEach((d) => set.add(normalizeChord(degreeToChord(d, scale)))),
      );
      return { progs, set };
    })
    .filter(({ set }) => [...set].every((c) => sel.has(c)));

  if (!categories.length) return [];
  let filtered = categories;
  if (special.length) {
    filtered = categories.filter(({ set }) =>
      special.every((sp) => set.has(sp)),
    );
    if (!filtered.length) filtered = categories;
  }
  const max = Math.max(...filtered.map((c) => c.set.size));
  return filtered
    .filter((c) => c.set.size === max)
    .flatMap(({ progs }) =>
      progs.map((p) => p.map((d) => degreeToChord(d, scale))),
    );
};

/* ─── Small utilities ─────────────────────────────────────── */
const playChordSequence = (seq, play, gap = 1000) =>
  seq.forEach((ch, i) => setTimeout(() => play(ch), gap * i));

/* ─── Component ───────────────────────────────────────────── */
export default function HarmonicDictation() {
  /* — React state & refs — */
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();
  const startAnswerTimeRef = useRef(null);
  const totalAnswerTimeRef = useRef(0);
  const hasLoggedRef = useRef(false);
  const sessionStartTimeRef = useRef(null); // ✅ Track session start


  const { selectedScale = 'C', selectedChords = [], rounds = 10 } = state || {};
  const tonic = normalizeChord(selectedScale.replace(/m$/, ''));

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
  const [instruction, setInstruction] = useState('👂 Listen and identify the chords');
  const [noProgressions, setNoProgressions] = useState(false);

  /* — Audio helpers — */
  const playNote = (n) => new Audio(`/clean_cut_notes/${encodeURIComponent(n)}.wav`).play();
  const playChord = (c) => (chordNoteMap[normalizeChord(c)] || []).forEach(playNote);

  const flashBtn = (c, type) => {
    const key = normalizeChord(c);
    setFlashMap((p) => ({ ...p, [key]: type }));
    setTimeout(() => setFlashMap((p) => ({ ...p, [key]: null })), 500);
  };

  const startGame = () => {
    const playable = getAllPlayableProgressions(selectedScale, selectedChords);
    if (!playable.length) {
      setIsPlaying(true);
      setNoProgressions(true);
      return;
    }
    const picked = Array.from({ length: rounds }, () => playable[Math.floor(Math.random() * playable.length)]);

    sessionStartTimeRef.current = performance.now(); // ✅ Start session time
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
    setInstruction('👂 Listen and identify the chords');
    setPopup(false);
    setNoProgressions(false);
    hasLoggedRef.current = false;
    totalAnswerTimeRef.current = 0;

    playChordSequence(picked[0], playChord);
    setTimeout(() => {
      setCanAnswer(true);
      startAnswerTimeRef.current = performance.now();
    }, picked[0].length * 1000);
  };
    
   
     const handleCurrent = () => {
      if (!isPlaying || !progressions[currentRound]) return;
    
      const prog = progressions[currentRound];
    
      // Count replay as a new try
      totalAnswerTimeRef.current += performance.now() - startAnswerTimeRef.current;
      setTries((t) => t + 1);
      setStatFlash('tries');
      setTimeout(() => setStatFlash(''), 400);
    
      setAwaitRetry(false);
      setMsg('🔁 Listen again...');
      setInstruction('👂 Listen again and answer');
    
      // 🔁 Reset to beginning of progression
      setCurrentStep(0);
    
      playChordSequence(prog, playChord);
    
      setTimeout(() => {
        setCanAnswer(true);
        startAnswerTimeRef.current = performance.now();
      }, prog.length * 1000);
    };
   
     const handleAnswer = (c) => {
      // Prevent input if not allowed
      if (!canAnswer || !isPlaying) return;
    
      const guess = normalizeChord(c);
      const prog = progressions[currentRound];
      if (!prog) return;
    
      const expected = normalizeChord(prog[currentStep]);
      const notes = chordNoteMap[guess];
      if (!notes) return;
    
      playChord(guess);
    
      // ✅ Now we log time and count only if it's truly the user's first active attempt
      if (currentStep === 0 && canAnswer && isPlaying) {
        totalAnswerTimeRef.current += performance.now() - startAnswerTimeRef.current;
        setTries((t) => t + 1);
        setStatFlash('tries');
        setTimeout(() => setStatFlash(''), 400);
      }
    
      if (guess === expected) {
        keyboardRef.current?.setFlashRight(notes);
        flashBtn(guess, 'correct');
    
        const nextStep = currentStep + 1;
    
        if (nextStep >= prog.length) {
          if (!roundMistake) {
            setCorrect((n) => n + 1);
            setStatFlash('correct');
            setTimeout(() => setStatFlash(''), 400);
            setMsg('✅ You’re right!');
            setInstruction('🎵 Get ready for the next one...');
          } else {
            setMsg('🙂 Got it on the second try!');
            setInstruction('🎵 Get ready for the next one...');
          }
    
          const nextRound = currentRound + 1;
          if (nextRound >= progressions.length) {
            setIsPlaying(false);
            setPopup(true);
            setInstruction('🎉 You’ve completed the game!');
          } else {
            setCurrentRound(nextRound);
            setCurrentStep(0);
            setRoundMistake(false);
            setWrongAlreadyCounted(false);
            setCanAnswer(false);
            setMsg('');
            setTimeout(() => {
              playChordSequence(progressions[nextRound], playChord);
              setInstruction('👂 Listen and identify the chords');
              setTimeout(() => {
                setCanAnswer(true);
                startAnswerTimeRef.current = performance.now();
              }, progressions[nextRound].length * 1000);
            }, 2000);
          }
        } else {
          setCurrentStep(nextStep);
          setInstruction('🎵 Continue identifying the next chord');
        }
      } else {
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
        setMsg('❌ Wrong! Click “Current” to listen again.');
        setInstruction('❌ Click “Current” to listen again');
      }
    };

     const rows = selectedChords.length > 12 ? 2 : 1;
     const cols = Math.ceil((selectedChords.length || 1) / rows);
     const unique = [...new Set(selectedChords.map(normalizeChord))];
     const hasSpecial = selectedChords.some((ch) => !scaleChordsMap[selectedScale].includes(ch));
   
     return (
      <div className="harmony_dictation-container">
        <nav className="harmony_dictation-navbar">
          <div className="harmony_dictation-navbar-left">
            <div className="harmony_dictation-logo">Sabers Harmony</div>
            <button className="harmony_dictation-btn" onClick={() => playChord(tonic)}>{tonic}</button>
            <button className={`harmony_dictation-btn ${awaitRetry ? 'bounce-flash' : ''}`} onClick={handleCurrent}>Current</button>
          </div>
    
          <div className="harmony_dictation-stats">
            <span className="harmony_dictation-stat total">{rounds}</span>/
            <span className={`harmony_dictation-stat current ${statFlash === 'current' ? 'stat-flash' : ''}`}>{currentRound}</span>/
            <span className={`harmony_dictation-stat correct ${statFlash === 'correct' ? 'stat-flash' : ''}`}>{correct}</span>/
            <span className={`harmony_dictation-stat wrong ${statFlash === 'wrong' ? 'stat-flash' : ''}`}>{wrong}</span>/
            <span className={`harmony_dictation-stat tries ${statFlash === 'tries' ? 'stat-flash' : ''}`}>{tries}</span>
          </div>
    
          <button className="harmony_dictation-btn harmony_dictation-start-btn" onClick={startGame}>
            {isPlaying ? 'Restart' : 'Start'}
          </button>
        </nav>
    
        <div className="harmony_dictation-message-wrapper">
          {(msg || instruction) && (
            <div className="harmony_dictation-status-message">
              {msg || instruction}
            </div>
          )}
        </div>
    
        <div className="harmony_dictation-fill-space" />
    
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
    
        {popup && (
  <div className="harmony_dictation-popup-overlay">
    <div className="harmony_dictation-popup">
      <h2>🎉 Game Over!</h2>
      <p>You completed the harmonic dictation!</p>
      <p><strong>Correct:</strong> {correct}</p>
      <p><strong>Wrong:</strong> {wrong}</p>
      <p><strong>Total Tries:</strong> {tries}</p>

      {rounds >= 5 ? (() => {
        const {
          score, max, avgTimePerAnswer, level,
          rightScore, tryScore, speedScore,
        } = calculateHarmonicDictationRank({
          selectedChords,
          correctCount: correct,
          triesCount: tries,
          rounds,
          totalAnswerTimeSec: totalAnswerTimeRef.current / 1000,
          hasSpecialChords: hasSpecial,
        });

        const user = JSON.parse(localStorage.getItem('user'));
        const gmail = user?.email || null;

        if (gmail && !hasLoggedRef.current) {
          logPracticeResult({
            gmail,
            practiceName: PRACTICE_NAMES.HARMONIC_DICTATION,
            correct,
            wrong,
            tries,
            level,
            rank: score,
            maxRank: max,
            rightScore,
            tryScore,
            speedScore,
            avgTimePerAnswer,
              sessionTime: Math.round((performance.now() - sessionStartTimeRef.current) / 10) / 100, // ✅ Add session time
            date: new Date().toISOString(),
          });
          hasLoggedRef.current = true;
        }

        return (
          <>
            <p><strong>Level:</strong> {level}</p>
            <p><strong>Rank:</strong> {score} / {max}</p>
            <p><strong>Breakdown:</strong></p>
            <ul style={{ lineHeight: '1.6', listStyleType: 'none', paddingLeft: 0 }}>
              <li>✅ Right/Wrong: <strong>{rightScore}</strong> / 75</li>
              <li>🔁 Tries: <strong>{tryScore}</strong> / 15</li>
              <li>⚡ Speed: <strong>{speedScore}</strong> / 10</li>
            </ul>
            <p><strong>Avg Time per Answer:</strong> {avgTimePerAnswer}s</p>
          </>
        );
      })() : (
        <p><strong>Rank:</strong> Not calculated (minimum 5 rounds required)</p>
      )}

      <div className="harmony_dictation-popup-buttons">
        <button onClick={startGame}>🔁 Restart</button>
        <button onClick={() => navigate('/harmonic')}>⚙️ Back to Settings</button>
        <button onClick={() => navigate('/profile')}>Back to Profile</button>

      </div>
    </div>
  </div>
)}


    {!progressions.length && isPlaying && (
  <div className="harmony_dictation-popup-overlay">
    <div className="harmony_dictation-popup">
      <h2>⚠️ No Progressions Found</h2>
      <p>The selected chords do not match any known progressions.</p>
      <p>You can return to settings or view the list of built-in progressions to guide your selection.</p>
      <div className="harmony_dictation-popup-buttons">
        <button onClick={() => navigate('/harmonic')}>⚙️ Back to Settings</button>
        <button onClick={() => navigate('/harmonic/progressions')}>📖 View Valid Progressions</button>
        
      </div>
    </div>
  </div>
)}
      </div>
    );
}


