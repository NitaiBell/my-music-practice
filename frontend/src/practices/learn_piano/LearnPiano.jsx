// LearnPiano.jsx
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LearnPiano.css';
import LearnPianoKeyboard from './LearnPianoKeyboard';
import { calculateLearnPianoRank } from './calculateLearnPianoRank';
import { logPracticeResult } from '../../../utils/logPracticeResult';
import { PRACTICE_NAMES } from '../../../utils/constants';

const displayNoteName = (note, key) => {
  const base = note.replace(/\d/, '');
  const preferFlat = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'].includes(key);

  const sharps = { Cs: 'C♯', Ds: 'D♯', Fs: 'F♯', Gs: 'G♯', As: 'A♯' };
  const flats = { Cs: 'D♭', Ds: 'E♭', Fs: 'G♭', Gs: 'A♭', As: 'B♭' };
  const natural = { C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B' };

  if (natural[base]) return natural[base];
  return preferFlat ? flats[base] || base : sharps[base] || base;
};

const getNoteBase = (note) => note.replace(/\d/, '');

export default function LearnPiano() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();
  const answerTimeStartRef = useRef(null);
  const totalAnswerTimeRef = useRef(0);

  const {
    selectedScale = 'C',
    selectedNotes = [],
    rounds = 10,
    sequenceLength = 5,
    normalMode = true,
    freestyleMode = false,
  } = state || {};

  const [currentRound, setCurrentRound] = useState(0);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasFailedThisRound, setHasFailedThisRound] = useState(false);
  const [rankData, setRankData] = useState(null);

  const allNotes = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
  const octaves = [3, 4, 5];
  const allChoices = freestyleMode
    ? octaves.flatMap((oct) => allNotes.map((note) => `${note}${oct}`))
    : selectedNotes.flatMap((note) => octaves.map((oct) => `${note}${oct}`));

  const startGame = () => {
    if (allChoices.length === 0) return;
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setCurrentRound(0);
    setIsPlaying(true);
    setShowPopup(false);
    setStatusMessage('');
    setHasFailedThisRound(false);
    setRankData(null);
    totalAnswerTimeRef.current = 0;
    generateNewSequence(0);
    answerTimeStartRef.current = Date.now();
  };

  const generateNewSequence = (roundNum) => {
    const newSequence = Array.from({ length: sequenceLength }, () =>
      allChoices[Math.floor(Math.random() * allChoices.length)]
    );
    setCurrentSequence(newSequence);
    setUserInput([]);
    setCurrentRound(roundNum);
    answerTimeStartRef.current = Date.now();
  };

  const handlePlayTonic = () => {
    const tonicNote = `${selectedScale}3`;
    keyboardRef.current.setFlashBlue(tonicNote);
    keyboardRef.current.playNote(tonicNote);
  };

  const handleAnswer = (note) => {
    if (!isPlaying) return;

    keyboardRef.current.playNote(note);

    const expected = currentSequence[userInput.length];
    const isCorrect = normalMode
      ? getNoteBase(note) === getNoteBase(expected)
      : note === expected;

    if (!isCorrect) {
      keyboardRef.current.setFlashWrong(note);
      setStatusMessage('❌ Wrong! Try again');
      setTriesCount((t) => t + 1);
      if (!hasFailedThisRound) setWrongCount((w) => w + 1);
      setHasFailedThisRound(true);
      setUserInput([]);
      return;
    }

    keyboardRef.current.setFlashRight(note);
    const nextInput = [...userInput, note];
    setUserInput(nextInput);

    if (nextInput.length === currentSequence.length) {
      const elapsed = Date.now() - (answerTimeStartRef.current || Date.now());
      totalAnswerTimeRef.current += elapsed / 1000;

      const updatedTries = triesCount + 1;
      let updatedCorrect = correctCount;
      if (!hasFailedThisRound) {
        updatedCorrect += 1;
        setCorrectCount(updatedCorrect);
      }
      setTriesCount(updatedTries);

      if (currentRound + 1 >= rounds) {
        const rank = calculateLearnPianoRank({
          selectedNotes,
          sequenceLength,
          freestyleMode,
          correctCount: updatedCorrect,
          triesCount: updatedTries,
          rounds,
          totalAnswerTimeSec: totalAnswerTimeRef.current,
        });

        const storedUser = JSON.parse(localStorage.getItem('user'));
        const gmail = storedUser?.email || null;
        if (gmail) {
          logPracticeResult({
            gmail,
            practiceName: PRACTICE_NAMES.LEARN_PIANO,
            correct: updatedCorrect,
            wrong: wrongCount,
            tries: updatedTries,
            level: rank.level,
            rank: rank.score,
            maxRank: 100,
            rightScore: rank.rightScore,
            tryScore: rank.tryScore,
            speedScore: rank.speedScore,
            avgTimePerAnswer: rank.avgTimePerAnswer,
          });
        }

        setRankData(rank);
        setIsPlaying(false);
        setShowPopup(true);
      } else {
        setTimeout(() => {
          generateNewSequence(currentRound + 1);
          setHasFailedThisRound(false);
          setStatusMessage('✅ Great! New round...');
        }, 800);
      }
    } else {
      setStatusMessage('✅ Correct... keep going');
    }
  };

  return (
    <div className="learn_piano-game-container">
      <nav className="learn_piano-game-navbar">
        <div className="learn_piano-game-navbar-left">
          <div className="learn_piano-game-logo">
            {freestyleMode ? '🎲 Freestyle Mode' : `${selectedScale} Practice`}
          </div>
          {!freestyleMode && (
            <button className="learn_piano-game-btn tonic-btn" onClick={handlePlayTonic}>
              {selectedScale}
            </button>
          )}
        </div>

        <div className="learn_piano-game-stats">
          <span className="learn_piano-game-stat total">{rounds}</span> /
          <span className="learn_piano-game-stat current">{currentRound + 1}</span> /
          <span className="learn_piano-game-stat correct">{correctCount}</span> /
          <span className="learn_piano-game-stat wrong">{wrongCount}</span> /
          <span className="learn_piano-game-stat tries">{triesCount}</span>
        </div>

        <button
          className="learn_piano-game-btn learn_piano-game-start-btn"
          onClick={startGame}
        >
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && (
        <div className="learn_piano-game-floating-message">{statusMessage}</div>
      )}

      <div className="learn_piano-game-fill-space" />

      <div className="learn_piano-game-bottom">
        <div className="learn_piano-sequence-display">
          {currentSequence.map((note, idx) => {
            const isCurrent = idx === userInput.length;
            return (
              <span
                key={idx}
                className={`learn_piano-sequence-note ${isCurrent ? 'highlighted' : ''}`}
              >
                {displayNoteName(note, selectedScale)}
              </span>
            );
          })}
        </div>

        <div className="learn_piano-keyboard-wrapper">
          <LearnPianoKeyboard
            ref={keyboardRef}
            onKeyClick={handleAnswer}
            octaves={octaves}
            showLabels={false}
          />
        </div>
      </div>

      {showPopup && (
        <div className="learn_piano-popup-overlay">
          <div className="learn_piano-popup">
            <h2>🎉 Practice Complete!</h2>
            <p><strong>Rounds:</strong> {rounds}</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Attempts:</strong> {triesCount}</p>

            {rounds >= 5 && rankData ? (
              <>
                <p><strong>Level:</strong> {rankData.level}</p>
                <p><strong>Rank:</strong> {rankData.score} / 100</p>
                <ul style={{ lineHeight: '1.6', listStyleType: 'none', paddingLeft: 0 }}>
                  <li>✅ Right/Wrong: <strong>{rankData.rightScore}</strong> / 75</li>
                  <li>🔁 Tries: <strong>{rankData.tryScore}</strong> / 15</li>
                  <li>⚡ Speed: <strong>{rankData.speedScore}</strong> / 10</li>
                </ul>
                <p><strong>Avg Time per Answer:</strong> {rankData.avgTimePerAnswer}s</p>
              </>
            ) : (
              <p><strong>Rank:</strong> Not calculated (minimum 5 rounds required)</p>
            )}

            <div className="learn_piano-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/learn-piano')}>⚙️ Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
