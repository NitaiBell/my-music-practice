// src/practices/special_chord_practice/SpecialChordPractice.jsx

import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SpecialChordPractice.css';
import SpecialChordPracticeKeyboard from './SpecialChordPracticeKeyboard';
import {
  chordNoteMap,
  scaleChordsMap,
  specialChordsByScale as extraChordsByScale,
  chordDisplayMap,
} from './specialChordData';

const SpecialChordPractice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const selectedScale = state?.selectedScale || 'C';
  const selectedChord = state?.selectedChord || '';
  const rounds = state?.rounds || 10;

  const scaleChords = scaleChordsMap[selectedScale] || [];
  const [sequence, setSequence] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [roundMistakeMade, setRoundMistakeMade] = useState(false);
  const [roundOutcomeSet, setRoundOutcomeSet] = useState(false);
  const [awaitingRetry, setAwaitingRetry] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statFlash, setStatFlash] = useState('');
  const [flashChord, setFlashChord] = useState('');

  const playNote = (note) => {
    const audio = new Audio(`/clean_cut_notes/${encodeURIComponent(note + '.wav')}`);
    audio.play().catch(() => {});
  };

  const playChord = (chord) => {
    const notes = chordNoteMap[chord];
    if (!notes) return;
    notes.forEach(playNote);
  };

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const startGame = () => {
    const totalRounds = rounds || 30;
    const chordPool = [...scaleChords.filter(c => c !== selectedChord), selectedChord];

    const newSequence = [];
    for (let i = 0; i < totalRounds; i++) {
      newSequence.push(pickRandom(chordPool));
    }

    setSequence(newSequence);
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setIsPlaying(true);
    setCanAnswer(false);
    setShowPopup(false);
    setStatusMessage('');
    setRoundMistakeMade(false);
    setRoundOutcomeSet(false);
    setAwaitingRetry(false);

    playNextChord(newSequence[0]);
  };

  const playNextChord = (chord) => {
    playChord(chord);
    setCanAnswer(true);
    setRoundMistakeMade(false);
    setRoundOutcomeSet(false);
    setAwaitingRetry(false);
    setStatusMessage('');
    setStatFlash('current');
    setTimeout(() => setStatFlash(''), 300);
  };

  const handleAnswer = (chord) => {
    if (!canAnswer || !isPlaying) return;

    const expected = sequence[currentRound];
    const notes = chordNoteMap[chord];

    setTriesCount(t => t + 1);
    setStatFlash('tries');
    setTimeout(() => setStatFlash(''), 300);
    setFlashChord(chord);

    if (chord === expected) {
      if (!roundMistakeMade && !roundOutcomeSet) {
        setCorrectCount(c => c + 1);
        setStatFlash('correct');
        setTimeout(() => setStatFlash(''), 300);
        setRoundOutcomeSet(true);
        setStatusMessage("✅ Correct!");
      }

      setCanAnswer(false);
      keyboardRef.current?.setFlashRight(notes);

      if (currentRound + 1 >= sequence.length) {
        setIsPlaying(false);
        setShowPopup(true);
      } else {
        setTimeout(() => {
          const nextChord = sequence[currentRound + 1];
          setCurrentRound(r => r + 1);
          playNextChord(nextChord);
        }, 700);
      }
    } else {
      if (!roundOutcomeSet) {
        setWrongCount(w => w + 1);
        setStatFlash('wrong');
        setTimeout(() => setStatFlash(''), 300);
        setRoundOutcomeSet(true);
        setStatusMessage("❌ Wrong! Try again.");
      }
      setRoundMistakeMade(true);
      setAwaitingRetry(true);
      keyboardRef.current?.setFlashWrong(notes);
    }

    setTimeout(() => setFlashChord(''), 500);
  };

  return (
    <div className="special_chord-container">
      <nav className="special_chord-navbar">
        <div className="special_chord-left">
          <div className="special_chord-logo">Sabers Special Chord</div>
          <button className="special_chord-btn" onClick={() => playChord(selectedScale)}>Tonic</button>
          <button className={`special_chord-btn ${awaitingRetry ? 'bounce-flash' : ''}`} onClick={() => playChord(sequence[currentRound])}>
            Current
          </button>
        </div>
        <div className="special_chord-stats">
          <span className="special_chord-stat total">{rounds}</span> /
          <span className={`special_chord-stat current ${statFlash === 'current' ? 'stat-flash' : ''}`}>{currentRound}</span> /
          <span className={`special_chord-stat correct ${statFlash === 'correct' ? 'stat-flash' : ''}`}>{correctCount}</span> /
          <span className={`special_chord-stat wrong ${statFlash === 'wrong' ? 'stat-flash' : ''}`}>{wrongCount}</span> /
          <span className={`special_chord-stat tries ${statFlash === 'tries' ? 'stat-flash' : ''}`}>{triesCount}</span>
        </div>
        <button className="special_chord-btn special_chord-start-btn" onClick={startGame}>
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && <div className="special_chord-floating">{statusMessage}</div>}

      <div className="special_chord-fill" />

      <div className="special_chord_settings-chord-row">
        <div className="special_chord_settings-section horizontal">
          <h3>🎵 Scale Chords:</h3>
          <div className="special_chord_settings-chord-grid">
            {scaleChords.map((chord) => (
              <button
                key={chord}
                className={`special_chord_settings-chord-btn ${flashChord === chord ? 'btn-flash-correct' : ''}`}
                onClick={() => handleAnswer(chord)}
              >
                {chord}
              </button>
            ))}
          </div>
        </div>

        <div className="special_chord_settings-section horizontal">
          <h3>🎯 Special Chord:</h3>
          <div className="special_chord_settings-chord-grid">
            <button
              className={`special_chord_settings-chord-btn ${flashChord === selectedChord ? 'btn-flash-correct' : ''}`}
              onClick={() => handleAnswer(selectedChord)}
            >
              {selectedChord}
            </button>
          </div>
        </div>
      </div>

      <div className="special_chord_settings-keyboard">
        <SpecialChordPracticeKeyboard ref={keyboardRef} />
      </div>

      {showPopup && (
        <div className="special_chord-popup-overlay">
          <div className="special_chord-popup">
            <h2>🎉 Done!</h2>
            <p>You completed the special chord practice.</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Tries:</strong> {triesCount}</p>
            <div className="special_chord-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/special_chord/settings')}>⚙️ Back to Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialChordPractice;
