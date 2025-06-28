import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PingPongHarmony.css';
import PingPongHarmonyKeyboardView from './PingPongHarmonyKeyboardView';
import { chordNoteMap } from './HarmonyTrainingData';
import { calculatePingPongHarmonyRank } from './calculatePingPongHarmonyRank';
import { logPracticeResult } from '../../../utils/logPracticeResult';
import { PRACTICE_NAMES } from '../../../utils/constants';

// ───── Helper Functions ─────

export const normalizeChord = (chord) =>
  chord.trim().replace(/♭/g, 'b').replace(/♯/g, '#');

const EXTRA_SPECIAL = new Set(['V7', 'IV7', 'i', 'iv', 'v']);

const toGlyphDegree = (deg) =>
  deg.replace(/^flat/, '♭').replace(/^sharp/, '♯');

const isReallySpecial = (deg) =>
  EXTRA_SPECIAL.has(deg) ||
  /[#♭/]|chromatic|neapolitan/.test(deg) ||
  /^flat|^sharp/.test(deg);

// Weighted choice
function weightedPick(weights, chordMap, excludeChord) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const [deg, w] of entries) {
    acc += w;
    if (r <= acc) {
      const cand = Object.entries(chordMap).find(([c, f]) => f === deg && c !== excludeChord);
      if (cand) return cand[0];
    }
  }
  return null;
}

// ───── Chord Progression Rules ─────
// [same `progressionRules` object as in your original file, unchanged for brevity]

const progressionRules = {
  // your full rules here...
  I: { IV: 0.25, V: 0.2, vi: 0.15, ii: 0.1, V7: 0.1, '♭VII': 0.1, iii: 0.05 },
  // ...
};

// ───── Main Component ─────

const PingPongHarmony = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();
  const answerTimeStartRef = useRef(null);
  const totalAnswerTimeRef = useRef(0);
  const hasLoggedRef = useRef(false);
  const sessionStartTimeRef = useRef(null); // ✅ added session start time

  const {
    selectedScale = 'C',
    selectedChords = [],
    chordFunctionMap = {},
    rounds = 10,
    specialChordMode = false,
  } = state || {};

  const tonic = normalizeChord(selectedScale.replace(/m$/, ''));
  const [sequence, setSequence] = useState([]);
  const [currentRound, setCurrent] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [tries, setTries] = useState(0);
  const [canAnswer, setCanAnswer] = useState(false);
  const [roundMistake, setMistake] = useState(false);
  const [outcomeSet, setOutcome] = useState(false);
  const [awaitRetry, setRetry] = useState(false);
  const [popup, setPopup] = useState(false);
  const [flashMap, setFlashMap] = useState({});
  const [statFlash, setStatFlash] = useState('');
  const [msg, setMsg] = useState('');

  const playNote = (n) => new Audio(`/clean_cut_notes/${encodeURIComponent(`${n}.wav`)}`).play();
  const playChord = (c) => (chordNoteMap[normalizeChord(c)] || []).forEach(playNote);
  const flashBtn = (c, type) => {
    const key = normalizeChord(c);
    setFlashMap((p) => ({ ...p, [key]: type }));
    setTimeout(() => setFlashMap((p) => ({ ...p, [key]: null })), 500);
  };

  const pickNextChord = (prevChord, wasLastSpecial = false) => {
    const prevFunc = chordFunctionMap[prevChord];
    const glyphFunc = toGlyphDegree(prevFunc);
    const specials = Object.entries(chordFunctionMap).filter(([, f]) => isReallySpecial(f));
    const diatonics = Object.entries(chordFunctionMap).filter(([, f]) => !isReallySpecial(f));
    const specialChance = specials.length > 0 ? (specialChordMode ? (specials.length === 1 ? 0.35 : 0.4) : 0.1) : 0;
    const baseRule = progressionRules[glyphFunc] || progressionRules[prevFunc] || {};
    const scaledRule = Object.fromEntries(Object.entries(baseRule).map(([d, p]) => [d, p * (1 - specialChance)]));
    if (!wasLastSpecial && Math.random() < specialChance && specials.length) {
      return specials[Math.floor(Math.random() * specials.length)][0];
    }
    return weightedPick(scaledRule, chordFunctionMap, prevChord) || diatonics[Math.floor(Math.random() * diatonics.length)][0];
  };

  const startGame = () => {
    if (!selectedChords.map(normalizeChord).includes(tonic)) return;

    const middle = [];
    let prev = tonic;
    let wasSpecial = isReallySpecial(chordFunctionMap[tonic]);
    for (let i = 0; i < rounds - 2; i++) {
      const next = pickNextChord(prev, wasSpecial);
      wasSpecial = isReallySpecial(chordFunctionMap[next]);
      middle.push(next);
      prev = next;
    }

    const seq = [tonic, ...middle, tonic];
    setSequence(seq);
    setCurrent(0);
    setCorrect(0);
    setWrong(0);
    setTries(0);
    totalAnswerTimeRef.current = 0;
    sessionStartTimeRef.current = Date.now(); // ✅ set session start time
    hasLoggedRef.current = false;

    setPlaying(true);
    setCanAnswer(false);
    setMistake(false);
    setOutcome(false);
    setRetry(false);
    setMsg('');
    setPopup(false);

    setTimeout(() => playNextChord(seq[0]), 300);
  };

  const playNextChord = (c) => {
    playChord(c);
    setCanAnswer(true);
    answerTimeStartRef.current = performance.now();
    setMistake(false);
    setOutcome(false);
    setRetry(false);
    setMsg('');
    setStatFlash('current');
    setTimeout(() => setStatFlash(''), 400);
  };

  const handleCurrent = () => {
    if (sequence[currentRound]) {
      playChord(sequence[currentRound]);
      setRetry(false);
      setMsg('🔁 Listen again...');
    }
  };

  const handleAnswer = (c) => {
    if (!canAnswer || !isPlaying) return;
    if (answerTimeStartRef.current) {
      totalAnswerTimeRef.current += performance.now() - answerTimeStartRef.current;
    }
    const guess = normalizeChord(c);
    const expected = normalizeChord(sequence[currentRound]);
    const notes = chordNoteMap[guess];
    if (!notes) return;
    setTries((t) => t + 1);
    setStatFlash('tries');
    setTimeout(() => setStatFlash(''), 400);

    if (guess === expected) {
      if (!outcomeSet && !roundMistake) {
        setCorrect((n) => n + 1);
        setStatFlash('correct');
        setTimeout(() => setStatFlash(''), 400);
        setOutcome(true);
        setMsg("✅ You're right!");
      }
      setCanAnswer(false);
      keyboardRef.current?.setFlashRight(notes);
      flashBtn(guess, 'correct');
      if (currentRound + 1 >= sequence.length) {
        setPlaying(false);
        setPopup(true);
      } else {
        setTimeout(() => {
          setCurrent((r) => r + 1);
          playNextChord(sequence[currentRound + 1]);
        }, 600);
      }
    } else {
      if (!outcomeSet) {
        setWrong((n) => n + 1);
        setStatFlash('wrong');
        setTimeout(() => setStatFlash(''), 400);
        setOutcome(true);
        setMsg("❌ You're wrong! Click 'Current' to hear again.");
      }
      setMistake(true);
      setRetry(true);
      keyboardRef.current?.setFlashWrong(notes);
      flashBtn(guess, 'wrong');
    }
  };

  const totalAnswerTimeSec = totalAnswerTimeRef.current / 1000;
  const sessionDurationSec = sessionStartTimeRef.current
    ? Math.round((Date.now() - sessionStartTimeRef.current) / 1000)
    : 0;

  const { score, max, level, rightScore, tryScore, speedScore, avgTimePerAnswer } =
    calculatePingPongHarmonyRank({
      selectedChords,
      correctCount: correct,
      triesCount: tries,
      rounds,
      hasSpecialChords: specialChordMode,
      totalAnswerTimeSec,
    });

  const rows = selectedChords.length > 12 ? 2 : 1;
  const cols = Math.ceil(selectedChords.length / rows || 1);
  const unique = [...new Set(selectedChords.map(normalizeChord))];

  return (
    <div className="harmonygame-container">
        {/* ── Navbar ── */}
        <nav className="harmonygame-navbar">
          <div className="harmonygame-navbar-left">
            <div className="harmonygame-logo">Sabers Harmony</div>
            <button className="harmonygame-btn" onClick={() => playChord(tonic)}>
              {tonic}
            </button>
            <button
              className={`harmonygame-btn ${awaitRetry ? 'bounce-flash' : ''}`}
              onClick={handleCurrent}
            >
              Current
            </button>
          </div>
    
          <div className="harmonygame-stats">
            <span className="harmonygame-stat total">{rounds}</span>/
            <span className={`harmonygame-stat current ${statFlash === 'current' ? 'stat-flash' : ''}`}>
              {currentRound}
            </span>/
            <span className={`harmonygame-stat correct ${statFlash === 'correct' ? 'stat-flash' : ''}`}>
              {correct}
            </span>/
            <span className={`harmonygame-stat wrong ${statFlash === 'wrong' ? 'stat-flash' : ''}`}>
              {wrong}
            </span>/
            <span className={`harmonygame-stat tries ${statFlash === 'tries' ? 'stat-flash' : ''}`}>
              {tries}
            </span>
          </div>
    
          <button className="harmonygame-btn harmonygame-start-btn" onClick={startGame}>
            {isPlaying ? 'Restart' : 'Start'}
          </button>
        </nav>
    
        {/* ── Floating status message ── */}
        {msg && <div className="floating-message">{msg}</div>}
    
        <div className="harmonygame-fill-space" />
    
        {/* ── Chord buttons & keyboard ── */}
        <div className="harmonygame-bottom">
          <div
            className="harmonygame-chords"
            style={{
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}
          >
            {unique.map((ch) => (
              <button
                key={ch}
                className={`harmonygame-chord-btn ${
                  flashMap[ch] === 'correct' ? 'btn-flash-correct' : ''
                } ${flashMap[ch] === 'wrong' ? 'btn-flash-wrong' : ''}`}
                onClick={() => handleAnswer(ch)}
              >
                {ch}
              </button>
            ))}
          </div>
    
          <div className="harmonygame-keyboard">
            <PingPongHarmonyKeyboardView ref={keyboardRef} />
          </div>
        </div>
    
{/* ── End-of-game popup ── */}
{popup && (() => {
  if (rounds >= 5 && !hasLoggedRef.current) {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const gmail = storedUser?.email || null;

    if (gmail) {
      logPracticeResult({
        gmail,
        practiceName: PRACTICE_NAMES.PINGPONG_HARMONY,
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
      });
    }

    hasLoggedRef.current = true;
  }

  return (
    <div className="harmonygame-popup-overlay">
      <div className="harmonygame-popup">
        <h2>🎉 Game Over!</h2>
        <p>You completed the harmony practice!</p>
        <p><strong>Correct:</strong> {correct}</p>
        <p><strong>Wrong:</strong> {wrong}</p>
        <p><strong>Total Tries:</strong> {tries}</p>
        {rounds >= 5 ? (
          <>
            <p><strong>Level:</strong> {level}</p>
            <p><strong>Rank:</strong> {score} / {max}</p>
            <ul style={{ lineHeight: '1.6', listStyleType: 'none', paddingLeft: 0 }}>
              <li>✅ Right/Wrong: <strong>{rightScore}</strong> / 75</li>
              <li>🔁 Tries: <strong>{tryScore}</strong> / 15</li>
              <li>⚡ Speed: <strong>{speedScore}</strong> / 10</li>
            </ul>
            <p><strong>Avg Time per Answer:</strong> {avgTimePerAnswer}s</p>
          </>
        ) : (
          <p><strong>Rank:</strong> Not calculated (minimum 5 rounds required)</p>
        )}
        <div className="harmonygame-popup-buttons">
          <button onClick={startGame}>🔁 Restart</button>
          <button onClick={() => navigate('/harmony')}>⚙️ Back to Settings</button>
          <button onClick={() => navigate('/profile')}>Back to Profile</button>

        </div>
      </div>
    </div>
  );
})()}

      </div>
    );
  };
    export default PingPongHarmony;   