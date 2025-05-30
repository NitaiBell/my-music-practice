// src/practices/which_higher_note/WhichHigherNote.jsx
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './WhichHigherNote.css';
import { logPracticeResult } from '../../../utils/logPracticeResult';
import { PRACTICE_NAMES } from '../../../utils/constants';

export default function WhichHigherNote() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { rounds = 10, octaves = [3, 4] } = state || {};

  const allNotes = [];
  ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'].forEach((note) => {
    octaves.forEach((oct) => allNotes.push(`${note}${oct}`));
  });

  const noteOrder = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
  const getNoteBase = (note) => note.replace(/\d/, '');
  const getNoteIndex = (note) => noteOrder.indexOf(getNoteBase(note));
  const playNote = (note) => new Audio(`/clean_cut_notes/${note}.wav`).play();
  const playCorrect = () => new Audio('/wrong_right/correct.mp3').play();
  const playWrong = () => new Audio('/wrong_right/wrong.mp3').play();

  const [currentRound, setCurrentRound] = useState(0);
  const [notePair, setNotePair] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [canAnswer, setCanAnswer] = useState(false);
  const [madeMistake, setMadeMistake] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [rank, setRank] = useState(100);
  const totalTimeRef = useRef(0);
  const answerStartRef = useRef(null);

  const getRandomNotePair = () => {
    let first, second, idx1, idx2;
    while (true) {
      const index = Math.floor(Math.random() * (allNotes.length - 1));
      first = allNotes[index];
      second = allNotes[index + 1];
      idx1 = getNoteIndex(getNoteBase(first));
      idx2 = getNoteIndex(getNoteBase(second));
      if (Math.abs(idx1 - idx2) <= 2) break;
    }
    return Math.random() < 0.5 ? [first, second] : [second, first];
  };

  const startRound = () => {
    const pair = getRandomNotePair();
    setNotePair(pair);
    setCanAnswer(true);
    setMadeMistake(false);
    playNote(pair[0]);
    setTimeout(() => playNote(pair[1]), 800);
    answerStartRef.current = Date.now();
  };

  const handleAnswer = (choice) => {
    if (!canAnswer) return;
    setTriesCount((t) => t + 1);
    setCanAnswer(false);

    const [first, second] = notePair;
    const correct = getNoteIndex(getNoteBase(first)) > getNoteIndex(getNoteBase(second)) ? 'first' : 'second';
    totalTimeRef.current += (Date.now() - answerStartRef.current) / 1000;

    if (choice === correct) {
      playCorrect();
      if (!madeMistake) setCorrectCount((c) => c + 1);
    } else {
      playWrong();
      if (!madeMistake) {
        setWrongCount((w) => w + 1);
        setRank((prev) => Math.max(0, prev - Math.round(100 / rounds)));
      }
      setMadeMistake(true);
    }

    setTimeout(() => {
      const next = currentRound + 1;
      if (next >= rounds) {
        setIsPlaying(false);

        // ✅ Log to backend
        const user = JSON.parse(localStorage.getItem('user'));
        const gmail = user?.email || null;

        const avgTimePerAnswer = +(totalTimeRef.current / Math.max(1, triesCount)).toFixed(2);
        const rightScore = Math.round((correctCount / rounds) * 75);
        const tryScore = Math.round((rounds / Math.max(1, triesCount)) * 15);
        const speedScore = 0; // not implemented

        if (gmail) {
          logPracticeResult({
            gmail,
            practiceName: PRACTICE_NAMES.WHICH_HIGHER,
            correct: correctCount,
            wrong: wrongCount,
            tries: triesCount,
            level: 1,
            rank,
            maxRank: 100,
            rightScore,
            tryScore,
            speedScore,
            avgTimePerAnswer,
            date: new Date().toISOString(),
          });
        }

        setShowPopup(true);
      } else {
        setCurrentRound(next);
        setTimeout(startRound, 1000);
      }
    }, 1000);
  };

  const startGame = () => {
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setShowPopup(false);
    setIsPlaying(true);
    setRank(100);
    totalTimeRef.current = 0;
    setTimeout(startRound, 500);
  };

  const restartGame = () => startGame();
  const goToSettings = () => navigate('/which-higher-note');

  return (
    <div className="which_higher_game-container">
      <nav className="which_higher-navbar">
        <div className="which_higher-nav-buttons">
          <button onClick={() => handleAnswer('first')} disabled={!canAnswer}>First</button>
          <button onClick={() => handleAnswer('second')} disabled={!canAnswer}>Second</button>
        </div>
        <div className="which_higher-nav-stats">
          <div>Round: {currentRound + 1} / {rounds}</div>
          <div>Correct: {correctCount}</div>
          <div>Wrong: {wrongCount}</div>
          <div>Tries: {triesCount}</div>
        </div>
        <div className="which_higher-nav-controls">
          {!isPlaying ? (
            <button onClick={startGame}>Start</button>
          ) : (
            <button onClick={restartGame}>Restart</button>
          )}
        </div>
      </nav>

      <div className="which_higher-instructions">
        🎵 Listen to the two notes. Which one was higher? Click "First" or "Second".
      </div>

      {showPopup && (
        <div className="which_higher-popup">
          <div className="which_higher-popup-box">
            <h2>🎉 Game Over</h2>
            <p>Correct: {correctCount}</p>
            <p>Wrong: {wrongCount}</p>
            <p>Total Tries: {triesCount}</p>
            <p>🏆 Rank: {rank} / 100</p>
            <div className="which_higher-popup-buttons">
              <button onClick={restartGame}>🔁 Restart</button>
              <button onClick={goToSettings}>⚙️ Settings</button>
              <button onClick={() => navigate('/profile')}>Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
