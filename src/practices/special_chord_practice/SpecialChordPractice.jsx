// src/practices/special_chord_practice/SpecialChordPractice.jsx

import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SpecialChordPractice.css';
import SpecialChordPracticeKeyboard from './SpecialChordPracticeKeyboard';

const chordNoteMap = {
  C: ['C3', 'E3', 'G3'], Dm: ['D3', 'F3', 'A3'], Em: ['E3', 'G3', 'B3'],
  F: ['F3', 'A3', 'C4'], G: ['G3', 'B3', 'D4'], Am: ['A3', 'C4', 'E4'], Bdim: ['B3', 'D4', 'F4'],
  E: ['E3', 'Gs3', 'B3'], D: ['D3', 'Fs3', 'A3'], A: ['A3', 'Cs4', 'E4'],
  Fm: ['F3', 'Gs3', 'C4'], 'E♭': ['Ds3', 'G3', 'As3'], 'B♭': ['As2', 'D3', 'F3'],
  D7: ['D3', 'Fs3', 'A3', 'C4'], E7: ['E3', 'Gs3', 'B3', 'D4'], A7: ['A3', 'Cs4', 'E4', 'G4']
};

const scaleChordMap = {
  C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
  D: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
  E: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
  F: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
  G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
  A: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
  B: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
};

const SpecialChordPractice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const selectedScale = state?.selectedScale || 'C';
  const selectedChord = state?.selectedChord || '';
  const rounds = state?.rounds || 10;

  const scaleChords = scaleChordMap[selectedScale] || [];

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
    audio.play().catch(err => console.error(`Error playing ${note}:`, err));
  };

  const playChord = (chord) => {
    const notes = chordNoteMap[chord];
    if (!notes) return;
    notes.forEach(playNote);
  };

const startGame = () => {
  const middleLength = rounds - 2;
  const minSpecialCount = Math.max(1, Math.floor(rounds * 0.25));

  const middle = [];
  let specialCount = 0;

  const IV_VI_by_scale = {
    C: ['F', 'Am'],
    D: ['G', 'Bm'],
    E: ['A', 'C#m'],
    F: ['Bb', 'Dm'],
    G: ['C', 'Em'],
    A: ['D', 'F#m'],
    B: ['E', 'G#m'],
  };

  const IV_VI = IV_VI_by_scale[selectedScale] || [];

  // Define special chords to control
  const controlledChords = ['E', 'E7'];

  for (let i = 0; i < middleLength;) {
    const remaining = middleLength - i;
    const remainingSpecialNeeded = minSpecialCount - specialCount;
    const forceSpecial = remaining === remainingSpecialNeeded;

    if ((Math.random() < 0.3 || forceSpecial) && specialCount < minSpecialCount) {
      const special = controlledChords[Math.floor(Math.random() * controlledChords.length)];
      middle.push(special);
      specialCount++;
      i++;
      if (i < middleLength) {
        const next = IV_VI[Math.floor(Math.random() * IV_VI.length)];
        middle.push(next);
        i++;
      }
    } else {
      const other = scaleChords[Math.floor(Math.random() * scaleChords.length)];
      if (!controlledChords.includes(other)) {
        middle.push(other);
        i++;
      }
    }
  }

  const fullSequence = [selectedScale, ...middle.slice(0, middleLength), selectedScale];

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
  setShowPopup(false);
  setStatusMessage('');
  setTimeout(() => playNextChord(fullSequence[0]), 400);
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
    setFlashChord(chord); // only visual feedback

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
          setCurrentRound(r => r + 1);
          playNextChord(sequence[currentRound + 1]);
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
