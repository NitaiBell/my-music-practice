// RealMelody.jsx (Updated with Backend Logging)
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RealMelody.css';
import RealMelodyKeyboardView from './RealMelodyKeyboardView';
import { logPracticeResult } from '../../../utils/logPracticeResult';
import { PRACTICE_NAMES } from '../../../utils/constants';

function calculateRealMelodyRank({
  selectedNotes = [],
  correctCount,
  triesCount,
  rounds,
  totalAnswerTimeSec = 0,
  normalMode = true,
}) {
  const baseLevel = Math.min(12, selectedNotes.length);
  const level = baseLevel + (normalMode ? 0 : 1);

  const accuracy = correctCount / Math.max(1, rounds);
  const efficiency = rounds / Math.max(1, triesCount);
  const avgTime = totalAnswerTimeSec / Math.max(1, triesCount);

  const rightScore = Math.round(accuracy * 75);
  const tryScore = Math.round(efficiency * 15);

  let speedScore = 0;
  if (avgTime <= 3) speedScore = 10;
  else if (avgTime <= 6) speedScore = 8;
  else if (avgTime <= 9) speedScore = 6;
  else if (avgTime <= 12) speedScore = 4;
  else if (avgTime <= 16) speedScore = 2;

  const score = rightScore + tryScore + speedScore;

  return {
    level,
    score,
    max: 100,
    rightScore,
    tryScore,
    speedScore,
    avgTimePerAnswer: +avgTime.toFixed(2),
  };
}

export default function RealMelody() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();
  const answerStartRef = useRef(null);
  const totalAnswerTimeRef = useRef(0);
  const hasLoggedRef = useRef(false);

  const {
    selectedScale = 'C',
    selectedNotes = [],
    rounds = 10,
    octaves = [4],
    normalMode = true,
  } = state || {};

  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [currentNote, setCurrentNote] = useState('');
  const [canAnswer, setCanAnswer] = useState(false);
  const [hasFailedThisRound, setHasFailedThisRound] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [rankData, setRankData] = useState(null);

  const generateSequence = () => {
    const allChoices = [];
    selectedNotes.forEach((note) => octaves.forEach((oct) => allChoices.push(`${note}${oct}`)));
    const tonicChoices = octaves.map((oct) => `${selectedScale}${oct}`);
    const body = Array.from({ length: rounds - 2 }, () =>
      allChoices[Math.floor(Math.random() * allChoices.length)]
    );
    return [
      tonicChoices[Math.floor(Math.random() * tonicChoices.length)],
      ...body,
      tonicChoices[Math.floor(Math.random() * tonicChoices.length)],
    ];
  };

  const startGame = () => {
    if (selectedNotes.length === 0) return;
    const seq = generateSequence();
    setSequence(seq);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    totalAnswerTimeRef.current = 0;
    hasLoggedRef.current = false;
    setIsPlaying(true);
    setStatusMessage('');
    setShowPopup(false);
    setHasFailedThisRound(false);
    setRankData(null);
    setTimeout(() => playNextNote(seq[0]), 300);
  };

  const playNextNote = (note) => {
    setCurrentNote(note);
    keyboardRef.current.playNote(note, false);
    setCanAnswer(true);
    setHasFailedThisRound(false);
    setStatusMessage('');
    answerStartRef.current = Date.now();
  };

  const handleReplay = () => {
    if (isPlaying && currentNote) {
      keyboardRef.current.playNote(currentNote, false);
      setStatusMessage('🔁 Replaying...');
    }
  };

  const handlePlayTonic = () => {
    keyboardRef.current.playNote(`${selectedScale}3`, true);
  };

  const getNoteBase = (note) => note.replace(/\d/, '');

  const handleAnswer = (note) => {
    if (!isPlaying || !canAnswer) return;
    const timeTaken = Date.now() - answerStartRef.current;
    totalAnswerTimeRef.current += timeTaken / 1000;
    setTriesCount((t) => t + 1);

    const isCorrect = normalMode
      ? getNoteBase(note) === getNoteBase(currentNote)
      : note === currentNote;

    if (isCorrect) {
      keyboardRef.current.setFlashRight(note);
      setStatusMessage("✅ Correct!");
      setCanAnswer(false);

      if (!hasFailedThisRound) {
        setCorrectCount((c) => c + 1);
      }

      if (currentIndex + 1 >= sequence.length) {
        const rank = calculateRealMelodyRank({
          selectedNotes,
          correctCount: correctCount + 1,
          triesCount: triesCount + 1,
          rounds,
          totalAnswerTimeSec: totalAnswerTimeRef.current,
          normalMode,
        });
        setRankData(rank);
        setIsPlaying(false);
        setShowPopup(true);

        if (!hasLoggedRef.current && rounds >= 5) {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          const gmail = storedUser?.email || null;
          if (gmail) {
            logPracticeResult({
              gmail,
              practiceName: PRACTICE_NAMES.REAL_MELODY,
              correct: correctCount + 1,
              wrong: wrongCount,
              tries: triesCount + 1,
              level: rank.level,
              rank: rank.score,
              maxRank: rank.max,
              rightScore: rank.rightScore,
              tryScore: rank.tryScore,
              speedScore: rank.speedScore,
              avgTimePerAnswer: rank.avgTimePerAnswer,
            });
          }
          hasLoggedRef.current = true;
        }
      } else {
        setTimeout(() => {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          playNextNote(sequence[nextIndex]);
        }, 600);
      }
    } else {
      keyboardRef.current.setFlashWrong(note);
      setStatusMessage("❌ Wrong! Hit Replay");
      if (!hasFailedThisRound) {
        setWrongCount((w) => w + 1);
        setHasFailedThisRound(true);
      }
    }
  };

  return (
    <div className="real-melodygame-container">
      <nav className="real-melodygame-navbar">
        <div className="real-melodygame-navbar-left">
          <div className="real-melodygame-logo">{selectedScale} Melody</div>
          <button className="real-melodygame-btn" onClick={handleReplay}>🔁 Replay</button>
          <button className="real-melodygame-btn tonic-btn" onClick={handlePlayTonic}>{selectedScale}</button>
        </div>

        <div className="real-melodygame-stats">
          <span className="real-melodygame-stat total">{rounds}</span> /
          <span className="real-melodygame-stat current">{currentIndex + 1}</span> /
          <span className="real-melodygame-stat correct">{correctCount}</span> /
          <span className="real-melodygame-stat wrong">{wrongCount}</span> /
          <span className="real-melodygame-stat tries">{triesCount}</span>
        </div>

        <button className="real-melodygame-btn real-melodygame-start-btn" onClick={startGame}>
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && <div className="real-melodygame-floating-message">{statusMessage}</div>}
      <div className="real-melodygame-fill-space" />

      <div className="real-melodygame-bottom">
        <div className="real-melodygame-keyboard">
          <RealMelodyKeyboardView
            ref={keyboardRef}
            onKeyClick={handleAnswer}
            octaves={normalMode ? [3, 4, 5] : octaves}
          />
        </div>
      </div>

      {showPopup && rankData && (
        <div className="real-melodygame-popup-overlay">
          <div className="real-melodygame-popup">
            <h2>🎉 Practice Complete!</h2>
            <p><strong>Rounds:</strong> {rounds}</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Attempts:</strong> {triesCount}</p>
            <p><strong>Level:</strong> {rankData.level}</p>
            <p><strong>Rank:</strong> {rankData.score} / 100</p>
            <ul style={{ lineHeight: '1.6', listStyleType: 'none', paddingLeft: 0 }}>
              <li>✅ Right/Wrong: <strong>{rankData.rightScore}</strong> / 75</li>
              <li>🔁 Tries: <strong>{rankData.tryScore}</strong> / 15</li>
              <li>⚡ Speed: <strong>{rankData.speedScore}</strong> / 10</li>
            </ul>
            <p><strong>Avg Time per Answer:</strong> {rankData.avgTimePerAnswer}s</p>
            <div className="real-melodygame-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/real-melody')}>⚙️ Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}