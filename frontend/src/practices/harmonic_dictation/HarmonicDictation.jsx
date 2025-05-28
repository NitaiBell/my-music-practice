/* ──────────────────────────────────────────────────────────────
   HarmonicDictation.jsx  – plays chord on each user answer with instruction message
   ────────────────────────────────────────────────────────────── */
// HarmonicDictation.jsx – full version with correct backend logging
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './HarmonicDictation.css';

import HarmonicDictationKeyboardView from './HarmonicDictationKeyboardView';
import { chordNoteMap, scaleChordsMap } from '../harmony_training/HarmonyTrainingData';
import { progressionBank } from './ProgressionBank';
import { calculateHarmonicDictationRank } from './calculateHarmonicDictationRank';
import { logPracticeResult } from '../../../utils/logPracticeResult';
import { PRACTICE_NAMES } from '../../../utils/constants';

const NOTE_TO_SEMI = { C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11 };
const SEMI_TO_NOTE = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const fifthUp = (root) => SEMI_TO_NOTE[(NOTE_TO_SEMI[root] + 7) % 12];
const normalizeChord = (c) => c.trim().replace(/♭/g, 'b').replace(/♯/g, '#');

const degreeToChord = (deg, scale) => {
  const m = /^V7\/([ivIV]+)$/.exec(deg);
  if (m) {
    const tgt = degreeToChord(m[1], scale);
    const root = /^([A-G](?:#|b)?)/.exec(tgt)?.[1];
    return root ? `${fifthUp(root)}7` : deg;
  }
  const diatonic = scaleChordsMap[scale] || [];
  const idx = { I:0, II:1, III:2, IV:3, V:4, VI:5, VII:6 }[deg.replace(/\u00B0/g, '').toUpperCase()];
  return idx !== undefined ? diatonic[idx] : deg;
};

const getAllPlayableProgressions = (scale, selectedChords) => {
  if (!selectedChords.length) return [];
  const sel = new Set(selectedChords.map(normalizeChord));
  const diatonic = new Set(scaleChordsMap[scale].map(normalizeChord));
  const special = [...sel].filter((c) => !diatonic.has(c));

  const categories = Object.entries(progressionBank)
    .map(([key, progs]) => {
      const set = new Set();
      progs.forEach((p) => p.forEach((d) => set.add(normalizeChord(degreeToChord(d, scale)))));
      return { progs, set };
    })
    .filter(({ set }) => [...set].every((c) => sel.has(c)));

  if (!categories.length) return [];
  let filtered = categories;
  if (special.length) {
    filtered = categories.filter(({ set }) => special.every((sp) => set.has(sp)));
    if (!filtered.length) filtered = categories;
  }
  const max = Math.max(...filtered.map((c) => c.set.size));
  return filtered
    .filter((c) => c.set.size === max)
    .flatMap(({ progs }) => progs.map((p) => p.map((d) => degreeToChord(d, scale))));
};

const playChordSequence = (seq, play, gap = 1000) =>
  seq.forEach((ch, i) => setTimeout(() => play(ch), gap * i));

export default function HarmonicDictation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();
  const startAnswerTimeRef = useRef(null);
  const totalAnswerTimeRef = useRef(0);
  const hasLoggedRef = useRef(false);

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


