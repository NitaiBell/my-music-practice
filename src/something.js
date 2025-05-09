// ✅ Full updated PingPongHarmony.jsx with special chord mode logic

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PingPongHarmony.css';
import PingPongHarmonyKeyboardView from './PingPongHarmonyKeyboardView';
import { chordNoteMap } from './HarmonyTrainingData';

const normalizeChord = (chord) => chord.trim();

// 🎯 Harmony transition map
const progressionRules = {
  I: { IV: 0.3, V: 0.25, vi: 0.15, ii: 0.1, V7: 0.1 },
  ii: { V: 0.4, V7: 0.3, IV: 0.1, 'vii°': 0.1 },
  iii: { vi: 0.4, IV: 0.3, I: 0.2 },
  IV: { I: 0.3, V: 0.25, ii: 0.15, V7: 0.1 },
  V: { I: 0.5, vi: 0.2, IV: 0.1, V7: 0.1 },
  vi: { ii: 0.3, IV: 0.25, V: 0.15, I: 0.1 },
  'vii°': { I: 0.6, iii: 0.2, V: 0.1 },
  'V7/vi': { vi: 0.8, ii: 0.2 },
  'V7/ii': { ii: 0.8, V: 0.15 },
  'V7/iii': { iii: 0.7, vi: 0.2 },
  'V7/iv': { iv: 0.8, I: 0.1 },
  'V7/V': { V: 0.9 },
  'V7': { I: 0.9, vi: 0.1 },
  'V/iii': { iii: 0.8, vi: 0.2 },
  'V/V': { V: 0.9 },
  iv: { I: 0.5, V: 0.2 },
  '♯III': { vi: 0.4, ii: 0.3, I: 0.2 },
  '♭III': { I: 0.3, vi: 0.3, IV: 0.2 },
  '♭VI': { V: 0.3, I: 0.3, IV: 0.2 },
  '♭VII': { I: 0.4, IV: 0.3 },
  chromaticMediant: { I: 0.4, V: 0.3 },
  IV7: { I: 0.6, vi: 0.2 },
  neapolitan: { V: 0.6, I: 0.2 },
  v: { I: 0.5, IV: 0.3 },
  'ii/vi': { vi: 0.6, ii: 0.2 },
};

function weightedPick(weights, chordMap, excludeChord) {
  const entries = Object.entries(weights);
  let total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const rand = Math.random() * total;
  let acc = 0;
  for (let [degree, weight] of entries) {
    acc += weight;
    if (rand <= acc) {
      const candidate = Object.entries(chordMap).find(
        ([ch, func]) => func === degree && ch !== excludeChord
      );
      if (candidate) return candidate[0];
    }
  }
  return null;
}

const PingPongHarmony = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const {
    selectedScale = 'C',
    selectedChords = [],
    chordFunctionMap = {},
    rounds = 10,
    specialChordMode = false,
  } = state || {};

  const tonic = normalizeChord(selectedScale.replace(/m$/, ''));

  const [sequence, setSequence] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [currentChord, setCurrentChord] = useState('');
  const [canAnswer, setCanAnswer] = useState(false);
  const [roundMistakeMade, setRoundMistakeMade] = useState(false);
  const [roundOutcomeSet, setRoundOutcomeSet] = useState(false);
  const [awaitingRetry, setAwaitingRetry] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [buttonFlashes, setButtonFlashes] = useState({});
  const [statFlash, setStatFlash] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const playNote = (note) => {
    const encoded = encodeURIComponent(`${note}.wav`);
    const audio = new Audio(`/clean_cut_notes/${encoded}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const playChord = (chord) => {
    const notes = chordNoteMap[normalizeChord(chord)];
    if (!notes) return;
    notes.forEach(playNote);
  };

  const pickNextChord = (prevChord) => {
    const prevDegree = chordFunctionMap[prevChord];
    const isSpecial = (deg) => /[#♭/]|chromatic|neapolitan/.test(deg);
    const specials = Object.entries(chordFunctionMap).filter(([, func]) => isSpecial(func));
    const diatonics = Object.entries(chordFunctionMap).filter(([, func]) => !isSpecial(func));

    const totalSpecialChance = specials.length > 0
      ? specialChordMode
        ? (specials.length === 1 ? 0.35 : 0.4)
        : 0.1
      : 0;

    const rand = Math.random();
    if (rand < totalSpecialChance && specials.length > 0) {
      return specials[Math.floor(Math.random() * specials.length)][0];
    }

    const rule = progressionRules[prevDegree] || {};
    const scaledRule = {};
    const scale = 1 - totalSpecialChance;
    for (let [deg, prob] of Object.entries(rule)) {
      scaledRule[deg] = prob * scale;
    }
    return weightedPick(scaledRule, chordFunctionMap, prevChord) ||
           diatonics[Math.floor(Math.random() * diatonics.length)][0];
  };

  const startGame = () => {
    const normalizedChords = selectedChords.map(normalizeChord);
    if (!normalizedChords.includes(tonic)) return;

    const middleLength = rounds - 2;
    const middle = [];
    let lastChord = tonic;

    for (let i = 0; i < middleLength; i++) {
      const next = pickNextChord(lastChord);
      middle.push(next);
      lastChord = next;
    }

    const fullSequence = [tonic, ...middle, tonic];

    setSequence(fullSequence);
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setIsPlaying(true);
    setCanAnswer(false);
    setRoundMistakeMade(false);
    setRoundOutcomeSet(false);
    setAwaitingRetry(false);
    setStatusMessage('');
    setShowPopup(false);

    setTimeout(() => playNextChord(fullSequence[0]), 300);
  };

  const playNextChord = (chord) => {
    setCurrentChord(chord);
    playChord(chord);
    setCanAnswer(true);
    setRoundMistakeMade(false);
    setRoundOutcomeSet(false);
    setAwaitingRetry(false);
    setStatusMessage('');
    setStatFlash('current');
    setTimeout(() => setStatFlash(''), 400);
  };

 const handleCurrent = () => {
    if (sequence[currentRound]) {
      playChord(sequence[currentRound]);
      setAwaitingRetry(false);
      setStatusMessage('🔁 Listen again...');
    }
  };

  const handleAnswer = (chord) => {
    if (!canAnswer || !isPlaying) return;

    const guess = normalizeChord(chord);
    const expected = normalizeChord(sequence[currentRound]);
    const notes = chordNoteMap[guess];

    if (!notes) {
      console.warn(`Chord not found for answer: "${guess}"`);
      return;
    }

    setTriesCount((t) => t + 1);
    setStatFlash('tries');
    setTimeout(() => setStatFlash(''), 400);

    if (guess === expected) {
      if (!roundOutcomeSet && !roundMistakeMade) {
        setCorrectCount((c) => c + 1);
        setStatFlash('correct');
        setTimeout(() => setStatFlash(''), 400);
        setRoundOutcomeSet(true);
        setStatusMessage("✅ You're right!");
      }

      setCanAnswer(false);
      keyboardRef.current?.setFlashRight(notes);
      setButtonFlash(guess, 'correct');

      if (currentRound + 1 >= sequence.length) {
        setIsPlaying(false);
        setShowPopup(true);
      } else {
        setTimeout(() => {
          const next = sequence[currentRound + 1];
          setCurrentRound((r) => r + 1);
          playNextChord(next);
        }, 600);
      }
    } else {
      if (!roundOutcomeSet) {
        setWrongCount((w) => w + 1);
        setStatFlash('wrong');
        setTimeout(() => setStatFlash(''), 400);
        setRoundOutcomeSet(true);
        setStatusMessage("❌ You're wrong! Click 'Current' to hear it again.");
      }

      setRoundMistakeMade(true);
      setAwaitingRetry(true);
      keyboardRef.current?.setFlashWrong(notes);
      setButtonFlash(guess, 'wrong');
    }
  };

  const rows = selectedChords.length > 12 ? 2 : 1;
  const columns = Math.ceil(selectedChords.length / rows || 1);
  const uniqueChords = Array.from(new Set(selectedChords.map(normalizeChord)));
  return (
    <div className="harmonygame-container">
    <nav className="harmonygame-navbar">
        <div className="harmonygame-navbar-left">
          <div className="harmonygame-logo">Sabers Harmony</div>
          <button className="harmonygame-btn" onClick={() => playChord(tonic)}>{tonic}</button>
          <button
            className={`harmonygame-btn ${awaitingRetry ? 'bounce-flash' : ''}`}
            onClick={handleCurrent}
          >
            Current
          </button>
        </div>
        <div className="harmonygame-stats">
          <span className="harmonygame-stat total">{rounds}</span>/
          <span className={`harmonygame-stat current ${statFlash === 'current' ? 'stat-flash' : ''}`}>{currentRound}</span>/
          <span className={`harmonygame-stat correct ${statFlash === 'correct' ? 'stat-flash' : ''}`}>{correctCount}</span>/
          <span className={`harmonygame-stat wrong ${statFlash === 'wrong' ? 'stat-flash' : ''}`}>{wrongCount}</span>/
          <span className={`harmonygame-stat tries ${statFlash === 'tries' ? 'stat-flash' : ''}`}>{triesCount}</span>
        </div>
        <button className="harmonygame-btn harmonygame-start-btn" onClick={startGame}>
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && <div className="floating-message">{statusMessage}</div>}

      <div className="harmonygame-fill-space" />

      <div className="harmonygame-bottom">
        <div
          className="harmonygame-chords"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {uniqueChords.map((chord) => (
            <button
              key={chord}
              className={`harmonygame-chord-btn ${buttonFlashes[chord] === 'correct' ? 'btn-flash-correct' : ''} ${buttonFlashes[chord] === 'wrong' ? 'btn-flash-wrong' : ''}`}
              onClick={() => handleAnswer(chord)}
            >
              {chord}
            </button>
          ))}
        </div>

        <div className="harmonygame-keyboard">
          <PingPongHarmonyKeyboardView ref={keyboardRef} />
        </div>
      </div>

      {showPopup && (
        <div className="harmonygame-popup-overlay">
          <div className="harmonygame-popup">
            <h2>🎉 Game Over!</h2>
            <p>You completed the harmony practice!</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Tries:</strong> {triesCount}</p>
            <div className="harmonygame-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/harmony')}>⚙️ Back to Settings</button>
            </div>
          </div>
        </div>
      )}    </div>
  );
};

export default PingPongHarmony;
