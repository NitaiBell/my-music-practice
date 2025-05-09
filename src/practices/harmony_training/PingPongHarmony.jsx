// src/practices/ping_pong_harmony/PingPongHarmony.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PingPongHarmony.css';
import PingPongHarmonyKeyboardView from './PingPongHarmonyKeyboardView';
import { chordNoteMap } from './HarmonyTrainingData';

const normalizeChord = (chord) => chord.trim();

const PingPongHarmony = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const { selectedScale = 'C', selectedChords = [], rounds = 10 } = state || {};
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
    const clean = normalizeChord(chord);
    const notes = chordNoteMap[clean];
    if (!notes) {
      console.warn(`Chord not found in chordNoteMap: "${clean}"`);
      return;
    }
    notes.forEach(playNote);
  };

  const setButtonFlash = (chord, type) => {
    const clean = normalizeChord(chord);
    setButtonFlashes((prev) => ({ ...prev, [clean]: type }));
    setTimeout(() => {
      setButtonFlashes((prev) => ({ ...prev, [clean]: null }));
    }, 500);
  };

  const startGame = () => {
    const normalizedChords = selectedChords.map(normalizeChord);
    if (!normalizedChords.includes(tonic)) return;
  
    const middleLength = rounds - 2;
    const nonTonicChords = normalizedChords.filter((chord) => chord !== tonic);
    if (middleLength <= 0 || nonTonicChords.length === 0) return;
  
    const middle = [];
  
    // Edge case: only 1 or 2 chords
    if (nonTonicChords.length <= 2) {
      for (let i = 0; i < middleLength; i++) {
        middle.push(nonTonicChords[Math.floor(Math.random() * nonTonicChords.length)]);
      }
    } else {
      // 3+ chords → better variety
      let lastChord = tonic;
  
      for (let i = 0; i < middleLength; i++) {
        // Shuffle and avoid same chord back-to-back
        const options = nonTonicChords.filter((ch) => ch !== lastChord);
        const pool = options.length ? options : nonTonicChords;
        const next = pool[Math.floor(Math.random() * pool.length)];
        middle.push(next);
        lastChord = next;
      }
  
      // Optional: try to guarantee each chord appears at least once
      const mustInclude = new Set(nonTonicChords);
      middle.forEach((ch) => mustInclude.delete(ch));
      const missing = Array.from(mustInclude);
  
      // Replace some random middle spots with the missing ones
      for (let i = 0; i < missing.length && i < middle.length; i++) {
        const swapIndex = Math.floor(Math.random() * middle.length);
        middle[swapIndex] = missing[i];
      }
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
    const clean = normalizeChord(chord);
    setCurrentChord(clean);
    playChord(clean);
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
      )}
    </div>
  );
};

export default PingPongHarmony;
