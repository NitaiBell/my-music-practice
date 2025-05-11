// src/practices/melodic_dictation/MelodicDictation.jsx

import React, { useEffect, useRef, useState } from 'react';
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

  const allChoices = selectedNotes.flatMap(note =>
    octaves.map(oct => `${note}${oct}`)
  );

  const generateSequence = () => {
    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      const note = allChoices[Math.floor(Math.random() * allChoices.length)];
      sequence.push(note);
    }
    return sequence;
  };

  const playSequence = async (seq) => {
    setCanAnswer(false);
    for (let i = 0; i < seq.length; i++) {
      const note = seq[i];
      keyboardRef.current.playNote(note, false); // no flash on play
      await new Promise((res) => setTimeout(res, 650));
    }
    setCanAnswer(true);
    setUserInput([]);
    setMustClickReplay(false);
    setStatusMessage('🎧 Your turn');
  };

  const startGame = () => {
    setRoundIndex(0);
    setTriesCount(0);
    setCorrectCount(0);
    setWrongCount(0);
    setShowPopup(false);
    setStatusMessage('');
    const sequence = generateSequence();
    setCurrentSequence(sequence);
    playSequence(sequence);
  };

  const handleKeyClick = (note) => {
    if (!canAnswer || mustClickReplay) return;

    const nextInput = [...userInput, note];
    setUserInput(nextInput);

    const expectedNote = currentSequence[nextInput.length - 1];
    if (note === expectedNote) {
      keyboardRef.current.setFlashRight(note);
      if (nextInput.length === currentSequence.length) {
        setCorrectCount((c) => c + 1);
        setStatusMessage('✅ Correct!');
        if (roundIndex + 1 === rounds) {
          setShowPopup(true);
          setCanAnswer(false);
        } else {
          setTimeout(() => {
            const nextSequence = generateSequence();
            setRoundIndex((i) => i + 1);
            setCurrentSequence(nextSequence);
            setUserInput([]);
            setStatusMessage('');
            playSequence(nextSequence);
          }, 800);
        }
      }
    } else {
      keyboardRef.current.setFlashWrong(note);
      currentSequence.slice(0, nextInput.length - 1).forEach(n => {
        setTimeout(() => keyboardRef.current.setFlashRight(n), 150);
      });
      setWrongCount((w) => w + 1);
      setTriesCount((t) => t + 1);
      setCanAnswer(false);
      setMustClickReplay(true);
      setStatusMessage('❌ Wrong! Click Replay to hear again.');
    }
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
      keyboardRef.current.playNote(firstNote, true); // flash = true
      setStatusMessage('✨ First note flashed');
    }
  };


  const handleAnswerWithFlash = async () => {
    if (!canAnswer) return;
  
    // Count as mistake
    setWrongCount((prev) => prev + 1);
    setTriesCount((prev) => prev + 1);
    setCanAnswer(false);
    setStatusMessage('🎼 Showing Answer...');
  
    for (let i = 0; i < currentSequence.length; i++) {
      const note = currentSequence[i];
      keyboardRef.current.playNote(note, true); // flash = true
      await new Promise((res) => setTimeout(res, 700));
    }
  
    setStatusMessage('🎧 Your turn');
    setCanAnswer(true);
  };

  return (
    <div className="melodic_dictation-container">
      <nav className="melodic_dictation-navbar">
        <div className="melodic_dictation-navbar-left">
          <div className="melodic_dictation-logo">{selectedScale} Melody</div>
          <button className="melodic_dictation-btn" onClick={handleReplay}>🔁 Replay</button>
          <button className="melodic_dictation-btn" onClick={handleTonic}>{selectedScale}</button>
          <button className="melodic_dictation-btn" onClick={flashFirstNotes}>✨ Flash First Notes</button>
          <button className="melodic_dictation-btn" onClick={handleAnswerWithFlash}>
  🎼 Answer
</button>
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

      {statusMessage && (
        <div className="melodic_dictation-floating-message">{statusMessage}</div>
      )}

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