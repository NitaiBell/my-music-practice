// src/practices/melodic_dictation/MelodicDictation.jsx

import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MelodicDictation.css';
import MelodicDictationKeyboard from './MelodicDictationKeyboard';
import { calculateMelodicDictationRank } from './calculateMelodicDictationRank';
import { logPracticeResult } from '../../../utils/logPracticeResult';
import { PRACTICE_NAMES } from '../../../utils/constants';

export default function MelodicDictation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();
  const totalAnswerTimeRef = useRef(0);
  const answerTimeStartRef = useRef(null);

  const {
    selectedScale = 'C',
    selectedNotes = [],
    rounds = 5,
    sequenceLength = 4,
    octaves = [4],
    difficulty = 'normal',
  } = state || {};

  const [roundIndex, setRoundIndex] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [canAnswer, setCanAnswer] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [mustClickReplay, setMustClickReplay] = useState(false);
  const [rankData, setRankData] = useState(null);

  const [attemptsThisRound, setAttemptsThisRound] = useState(0);
  const [madeMistake, setMadeMistake] = useState(false);

  const allChoices = selectedNotes.flatMap((note) =>
    octaves.map((oct) => `${note}${oct}`)
  );

  const generateSequence = () => {
    return Array.from({ length: sequenceLength }, () =>
      allChoices[Math.floor(Math.random() * allChoices.length)]
    );
  };

  const playSequence = async (seq) => {
    setCanAnswer(false);
    for (let i = 0; i < seq.length; i++) {
      keyboardRef.current.playNote(seq[i], false);
      await new Promise((res) => setTimeout(res, 650));
    }
    setUserInput([]);
    setMustClickReplay(false);
    setStatusMessage('🎧 Your turn');
    setCanAnswer(true);
    answerTimeStartRef.current = Date.now();
  };

  const startRound = (newRoundIdx) => {
    setAttemptsThisRound(0);
    setMadeMistake(false);
    const seq = generateSequence();
    setCurrentSequence(seq);
    setRoundIndex(newRoundIdx);
    playSequence(seq);
  };

  const startGame = () => {
    setShowPopup(false);
    setTriesCount(0);
    setCorrectCount(0);
    setWrongCount(0);
    setRankData(null);
    setStatusMessage('');
    totalAnswerTimeRef.current = 0;
    startRound(0);
  };

  const correctSound = new Audio('/wrong_right/correct.mp3');
  const wrongSound = new Audio('/wrong_right/wrong.mp3');

  const handleKeyClick = (note) => {
    if (!canAnswer || mustClickReplay) return;

    keyboardRef.current.playNote(note, false);
    const nextInput = [...userInput, note];
    setUserInput(nextInput);
    const expectedNote = currentSequence[nextInput.length - 1];

    if (note === expectedNote) {
      keyboardRef.current.setFlashRight(note);
      if (nextInput.length === currentSequence.length) {
        const firstAttempt = attemptsThisRound === 0;
        setTriesCount((t) => t + 1);
        if (firstAttempt) setCorrectCount((c) => c + 1);
        setCanAnswer(false);
        setStatusMessage('✅ Correct!');

        const timeSpent = Date.now() - answerTimeStartRef.current;
        totalAnswerTimeRef.current += timeSpent / 1000;

        correctSound.play();

        if (roundIndex + 1 === rounds) {
          correctSound.onended = () => {
            const rank = calculateMelodicDictationRank({
              selectedNotes,
              sequenceLength,
              difficulty,
              correctCount: correctCount + 1,
              triesCount: triesCount + 1,
              rounds,
              totalAnswerTimeSec: totalAnswerTimeRef.current,
            });
            setRankData(rank);

            const user = JSON.parse(localStorage.getItem('user'));
            const gmail = user?.email || null;

            if (gmail) {
              logPracticeResult({
                gmail,
                practiceName: PRACTICE_NAMES.MELODIC_DICTATION,
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
                date: new Date().toISOString(),
              });
            }

            setShowPopup(true);
          };
        } else {
          correctSound.onended = () => startRound(roundIndex + 1);
        }
      }
      return;
    }

    keyboardRef.current.setFlashWrong(note);
    wrongSound.play();
    setTriesCount((t) => t + 1);
    setAttemptsThisRound((a) => a + 1);
    if (!madeMistake) {
      setWrongCount((w) => w + 1);
      setMadeMistake(true);
    }
    setMustClickReplay(true);
    setCanAnswer(false);
    setUserInput([]);
    setStatusMessage('❌ Wrong! Click Replay to hear again.');
  };

  const handleReplay = () => {
    if (currentSequence.length) {
      setStatusMessage('🔁 Replaying...');
      playSequence(currentSequence);
    }
  };

  const handleTonic = () => keyboardRef.current.playNote(`${selectedScale}3`);

  const flashFirstNotes = () => {
    if (currentSequence.length) {
      const firstNote = currentSequence[0];
      keyboardRef.current.playNote(firstNote, true);
      setStatusMessage('✨ First note flashed');
    }
  };

  const handleAnswerWithFlash = async () => {
    if (!canAnswer) return;
    setTriesCount((t) => t + 1);
    setAttemptsThisRound((a) => a + 1);
    if (!madeMistake) {
      setWrongCount((w) => w + 1);
      setMadeMistake(true);
    }
    setCanAnswer(false);
    setStatusMessage('🎼 Showing Answer...');
    for (let note of currentSequence) {
      keyboardRef.current.playNote(note, true);
      await new Promise((res) => setTimeout(res, 700));
    }
    setStatusMessage('🎧 Your turn');
    setMustClickReplay(false);
    setCanAnswer(true);
    setUserInput([]);
  };

  return (
    <div className="melodic_dictation-container">
      <nav className="melodic_dictation-navbar">
        <div className="melodic_dictation-navbar-left">
          <div className="melodic_dictation-logo">{selectedScale} Melody</div>
          <button className="melodic_dictation-btn" onClick={handleReplay}>🔁 Replay</button>
          <button className="melodic_dictation-btn" onClick={handleTonic}>{selectedScale}</button>
          <button className="melodic_dictation-btn" onClick={flashFirstNotes}>✨ Flash First Notes</button>
          <button className="melodic_dictation-btn" onClick={handleAnswerWithFlash}>🎼 Answer</button>
        </div>
        <div className="melodic_dictation-stats">
          <span className="melodic_dictation-stat total">{rounds}</span> /
          <span className="melodic_dictation-stat current">{roundIndex + 1}</span> /
          <span className="melodic_dictation-stat correct">{correctCount}</span> /
          <span className="melodic_dictation-stat wrong">{wrongCount}</span> /
          <span className="melodic_dictation-stat tries">{triesCount}</span>
        </div>
        <button className="melodic_dictation-btn melodic_dictation-start-btn" onClick={startGame}>
          {roundIndex > 0 || currentSequence.length ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && <div className="melodic_dictation-floating-message">{statusMessage}</div>}
      <div className="melodic_dictation-fill-space" />

      <div className="melodic_dictation-bottom">
        <div className="melodic_dictation-keyboard-wrapper">
          <MelodicDictationKeyboard
            ref={keyboardRef}
            onKeyClick={handleKeyClick}
            octaves={[3, 4, 5]}
          />
        </div>
      </div>

      {showPopup && rankData && (
        <div className="melodic_dictation-popup-overlay">
          <div className="melodic_dictation-popup">
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
            <div className="melodic_dictation-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/melodic-dictation')}>⚙️ Settings</button>
              <button onClick={() => navigate('/profile')}>Back to Profile</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
