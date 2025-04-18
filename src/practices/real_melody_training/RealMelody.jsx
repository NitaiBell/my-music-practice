import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './RealMelody.css';
import RealMelodyKeyboardView from './RealMelodyKeyboardView';

export default function RealMelody() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const {
    selectedScale = 'C',
    selectedNotes = [],
    rounds = 10,
    octaves = [4],
    normalMode = true, // ✅ renamed from beginnerMode
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

  const generateSequence = () => {
    const allChoices = [];
    selectedNotes.forEach((note) =>
      octaves.forEach((oct) => allChoices.push(`${note}${oct}`))
    );

    const tonicChoices = octaves.map((oct) => `${selectedScale}${oct}`);
    const sequence = Array.from({ length: rounds - 2 }, () =>
      allChoices[Math.floor(Math.random() * allChoices.length)]
    );

    const firstTonic = tonicChoices[Math.floor(Math.random() * tonicChoices.length)];
    const lastTonic = tonicChoices[Math.floor(Math.random() * tonicChoices.length)];

    return [firstTonic, ...sequence, lastTonic];
  };

  const startGame = () => {
    if (selectedNotes.length === 0) return;
    const seq = generateSequence();
    setSequence(seq);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setIsPlaying(true);
    setStatusMessage('');
    setShowPopup(false);
    setHasFailedThisRound(false);
    setTimeout(() => playNextNote(seq[0]), 300);
  };

  const playNextNote = (note) => {
    setCurrentNote(note);
    keyboardRef.current.playNote(note, false);
    setCanAnswer(true);
    setHasFailedThisRound(false);
    setStatusMessage('');
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
        setIsPlaying(false);
        setShowPopup(true);
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
          <button className="real-melodygame-btn" onClick={handleReplay}>
            🔁 Replay
          </button>
          <button className="real-melodygame-btn tonic-btn" onClick={handlePlayTonic}>
            {selectedScale}
          </button>
        </div>

        <div className="real-melodygame-stats">
          <span className="real-melodygame-stat total">{rounds}</span> /
          <span className="real-melodygame-stat current">{currentIndex + 1}</span> /
          <span className="real-melodygame-stat correct">{correctCount}</span> /
          <span className="real-melodygame-stat wrong">{wrongCount}</span> /
          <span className="real-melodygame-stat tries">{triesCount}</span>
        </div>

        <button
          className="real-melodygame-btn real-melodygame-start-btn"
          onClick={startGame}
        >
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && (
        <div className="real-melodygame-floating-message">{statusMessage}</div>
      )}

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

      {showPopup && (
        <div className="real-melodygame-popup-overlay">
          <div className="real-melodygame-popup">
            <h2>🎉 Practice Complete!</h2>
            <p><strong>Rounds:</strong> {rounds}</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Attempts:</strong> {triesCount}</p>
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
