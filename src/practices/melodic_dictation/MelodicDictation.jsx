// src/practices/melodic_dictation/MelodicDictation.jsx

import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MelodicDictation.css';
import MelodicDictationKeyboard from './MelodicDictationKeyboard';

export default function MelodicDictation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const {
    selectedScale = 'C',
    selectedNotes = [],
    rounds = 5,
    sequenceLength = 4,
    octaves = [4],
    difficulty = 'normal', // reserved for future use
  } = state || {};

  /* ----------------- global stats ----------------- */
  const [roundIndex, setRoundIndex] = useState(0);
  const [triesCount, setTriesCount] = useState(0);      // total attempts across the game
  const [correctCount, setCorrectCount] = useState(0);  // +1 only if FIRST attempt of a round is correct
  const [wrongCount, setWrongCount] = useState(0);      // +1 once per round if ANY mistake is made

  /* ----------------- round‑scoped state ----------------- */
  const [currentSequence, setCurrentSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [canAnswer, setCanAnswer] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [mustClickReplay, setMustClickReplay] = useState(false);

  // helpers to keep per‑round bookkeeping
  const [attemptsThisRound, setAttemptsThisRound] = useState(0); // how many FULL sequence attempts made so far in this round
  const [madeMistake, setMadeMistake] = useState(false);         // has the player already made at least one mistake in THIS round?

  /* ----------------- utility generators ----------------- */
  const allChoices = selectedNotes.flatMap((note) =>
    octaves.map((oct) => `${note}${oct}`)
  );

  const generateSequence = () => {
    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      const note = allChoices[Math.floor(Math.random() * allChoices.length)];
      sequence.push(note);
    }
    return sequence;
  };

  /* ----------------- audio helpers ----------------- */
  const playSequence = async (seq) => {
    setCanAnswer(false);
    for (let i = 0; i < seq.length; i++) {
      const note = seq[i];
      keyboardRef.current.playNote(note, false); // play without flash
      await new Promise((res) => setTimeout(res, 650));
    }
    setUserInput([]);
    setMustClickReplay(false);
    setStatusMessage('🎧 Your turn');
    setCanAnswer(true);
  };

  /* ----------------- round / game lifecycle ----------------- */
  const startRound = (newRoundIdx) => {
    // reset round‑scoped helpers
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
    setStatusMessage('');
    startRound(0);
  };

  /* ----------------- user interaction ----------------- */
  const correctSound = new Audio('/wrong_right/correct.mp3');
  const wrongSound = new Audio('/wrong_right/wrong.mp3');
  
  const handleKeyClick = (note) => {
    if (!canAnswer || mustClickReplay) return;
  
    keyboardRef.current.playNote(note, false); // play the note
  
    const nextInput = [...userInput, note];
    setUserInput(nextInput);
  
    const expectedNote = currentSequence[nextInput.length - 1];
  
    // ✅ correct so far
    if (note === expectedNote) {
      keyboardRef.current.setFlashRight(note);
  
      // ✅ full sequence correct
      if (nextInput.length === currentSequence.length) {
        const firstAttempt = attemptsThisRound === 0;
  
        setTriesCount((t) => t + 1);
        if (firstAttempt) setCorrectCount((c) => c + 1);
  
        setCanAnswer(false);
        setStatusMessage('✅ Correct!');
  
        correctSound.play();
  
        if (roundIndex + 1 === rounds) {
          // ✅ end of game
          correctSound.onended = () => {
            setShowPopup(true);
          };
        } else {
          // ✅ next round
          correctSound.onended = () => {
            startRound(roundIndex + 1);
          };
        }
      }
  
      return; // stop here, no wrong logic needed
    }
  
    // ❌ wrong answer branch
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

  const handleTonic = () => {
    keyboardRef.current.playNote(`${selectedScale}3`);
  };

  const flashFirstNotes = () => {
    if (currentSequence.length) {
      const firstNote = currentSequence[0];
      keyboardRef.current.playNote(firstNote, true);
      setStatusMessage('✨ First note flashed');
    }
  };

  const handleAnswerWithFlash = async () => {
    if (!canAnswer) return;

    // user requested to reveal the answer – counts as a wrong attempt
    setTriesCount((t) => t + 1);
    setAttemptsThisRound((a) => a + 1);
    if (!madeMistake) {
      setWrongCount((w) => w + 1);
      setMadeMistake(true);
    }

    setCanAnswer(false);
    setStatusMessage('🎼 Showing Answer...');

    for (let i = 0; i < currentSequence.length; i++) {
      const note = currentSequence[i];
      keyboardRef.current.playNote(note, true);
      await new Promise((res) => setTimeout(res, 700));
    }

    setStatusMessage('🎧 Your turn');
    setMustClickReplay(false);
    setCanAnswer(true);
    setUserInput([]);
  };

  /* ----------------- JSX ----------------- */
  return (
    <div className="melodic_dictation-container">
      {/* -------- NAVBAR -------- */}
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

        <button
          className="melodic_dictation-btn melodic_dictation-start-btn"
          onClick={startGame}
        >
          {roundIndex > 0 || currentSequence.length ? 'Restart' : 'Start'}
        </button>
      </nav>

      {/* -------- FLOATING STATUS -------- */}
      {statusMessage && (
        <div className="melodic_dictation-floating-message">{statusMessage}</div>
      )}

      <div className="melodic_dictation-fill-space" />

      {/* -------- KEYBOARD -------- */}
      <div className="melodic_dictation-bottom">
        <div className="melodic_dictation-keyboard-wrapper">
          <MelodicDictationKeyboard
            ref={keyboardRef}
            onKeyClick={handleKeyClick}
            octaves={[3, 4, 5]}
          />
        </div>
      </div>

      {/* -------- END POPUP -------- */}
      {showPopup && (
        <div className="melodic_dictation-popup-overlay">
          <div className="melodic_dictation-popup">
            <h2>🎉 Practice Complete!</h2>
            <p><strong>Rounds:</strong> {rounds}</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Attempts:</strong> {triesCount}</p>
            <div className="melodic_dictation-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/melodic-dictation')}>⚙️ Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
