import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LearnPiano.css';
import LearnPianoKeyboard from './LearnPianoKeyboard';

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

  const {
    selectedScale = 'C',
    selectedNotes = [],
    rounds = 10,
    sequenceLength = 5,
    normalMode = true,
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

  const allChoices = [];
  const octaves = [3, 4, 5];
  selectedNotes.forEach((note) =>
    octaves.forEach((oct) => allChoices.push(`${note}${oct}`))
  );

  const startGame = () => {
    if (selectedNotes.length === 0) return;
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setCurrentRound(0);
    setIsPlaying(true);
    setShowPopup(false);
    setStatusMessage('');
    setHasFailedThisRound(false);
    generateNewSequence(0);
  };

  const generateNewSequence = (roundNum) => {
    const newSequence = Array.from({ length: sequenceLength }, () =>
      allChoices[Math.floor(Math.random() * allChoices.length)]
    );
    setCurrentSequence(newSequence);
    setUserInput([]);
    setCurrentRound(roundNum);
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
      setTriesCount((t) => t + 1); // 🔁 count as a try
      if (!hasFailedThisRound) setWrongCount((w) => w + 1);
      setHasFailedThisRound(true);
      setUserInput([]);
      return;
    }

    keyboardRef.current.setFlashRight(note);
    const nextInput = [...userInput, note];
    setUserInput(nextInput);

    if (nextInput.length === currentSequence.length) {
      setTriesCount((t) => t + 1); // ✅ also count as a try
      if (!hasFailedThisRound) {
        setCorrectCount((c) => c + 1);
      }
      if (currentRound + 1 >= rounds) {
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
          <div className="learn_piano-game-logo">{selectedScale} Practice</div>
          <button className="learn_piano-game-btn tonic-btn" onClick={handlePlayTonic}>
            {selectedScale}
          </button>
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
    const base = getNoteBase(note);
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
