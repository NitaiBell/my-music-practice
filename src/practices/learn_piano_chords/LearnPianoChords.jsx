// LearnPianoChords.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LearnPianoChords.css';
import LearnPianoChordsKeyboardView from './LearnPianoChordsKeyboardView';

const chordNoteMap = {
  C: ['C3', 'E3', 'G3'], D: ['D3', 'Fs3', 'A3'], Dm: ['D3', 'F3', 'A3'], Em: ['E3', 'G3', 'B3'],
  F: ['F3', 'A3', 'C4'], G: ['G3', 'B3', 'D4'], Am: ['A3', 'C4', 'E4'], Bdim: ['B3', 'D4', 'F4'],
  Bm: ['B3', 'D4', 'Fs4'], 'F#dim': ['Fs3', 'A3', 'C4'], Gm: ['G3', 'As3', 'D4'], Bb: ['As2', 'D3', 'F3'],
  Edim: ['E3', 'G3', 'As3'], A: ['A3', 'Cs4', 'E4'], 'C#m': ['Cs3', 'E3', 'Gs3'], E: ['E3', 'Gs3', 'B3'],
  'F#m': ['Fs3', 'A3', 'Cs4'], 'G#dim': ['Gs3', 'B3', 'D4'], 'G#m': ['Gs3', 'B3', 'Ds4'],
  B: ['B3', 'Ds4', 'Fs4'], 'C#dim': ['Cs3', 'E3', 'G3'], 'D#dim': ['Ds3', 'Fs3', 'A3'],
  'D#m': ['Ds3', 'Fs3', 'As3'], 'F#': ['Fs3', 'As3', 'Cs4'], 'A#dim': ['As3', 'Cs4', 'E4'],

  // Additional chords:
  Cm: ['C3', 'Ds3', 'G3'], 'C7': ['C3', 'E3', 'G3', 'As3'], 'Cm7': ['C3', 'Ds3', 'G3', 'As3'],
  D7: ['D3', 'Fs3', 'A3', 'C4'], Dmaj7: ['D3', 'Fs3', 'A3', 'Cs4'], Dm7: ['D3', 'F3', 'A3', 'C4'],
  E7: ['E3', 'Gs3', 'B3', 'D4'], Edom7: ['E3', 'Gs3', 'B3', 'D4'],
  F7: ['F3', 'A3', 'C4', 'Ds4'], Fmaj7: ['F3', 'A3', 'C4', 'E4'], Fm7: ['F3', 'Gs3', 'C4', 'Ds4'],
  G7: ['G3', 'B3', 'D4', 'F4'], Gmaj7: ['G3', 'B3', 'D4', 'Fs4'], Gm7: ['G3', 'As3', 'D4', 'F4'],
  A7: ['A3', 'Cs4', 'E4', 'G4'], Amaj7: ['A3', 'Cs4', 'E4', 'Gs4'], Am7: ['A3', 'C4', 'E4', 'G4'],
  B7: ['B3', 'Ds4', 'Fs4', 'A4'], Bm7: ['B3', 'D4', 'Fs4', 'A4'],

  // Enharmonic additions:
  'Db': ['Cs3', 'F3', 'Gs3'], 'Eb': ['Ds3', 'G3', 'As3'], 'Ab': ['Gs3', 'C4', 'Ds4'],
  'Dbm': ['Cs3', 'E3', 'Gs3'], 'Ebm': ['Ds3', 'F3', 'As3'], 'Abm': ['Gs3', 'B3', 'Ds4'],
  'Bbm': ['As3', 'C4', 'F4'], 'Bbm7': ['As3', 'C4', 'F4', 'Gs4']
};

const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

const LearnPianoChords = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const {
    selectedScale = 'C',
    selectedChords = [],
    rounds = 10,
    freestyleMode = false
  } = state || {};

  const tonic = selectedScale.replace(/m$/, '');
  const allChords = Object.keys(chordNoteMap);

  const [sequence, setSequence] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [currentChord, setCurrentChord] = useState('');
  const [currentOptions, setCurrentOptions] = useState([]);
  const [awaitingRetry, setAwaitingRetry] = useState(false);
  const [buttonFlashes, setButtonFlashes] = useState({});
  const [statFlash, setStatFlash] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [roundMistakeMade, setRoundMistakeMade] = useState(false);
  const [roundOutcomeSet, setRoundOutcomeSet] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);

  const playNote = (note) => {
    const encoded = encodeURIComponent(`${note}.wav`);
    const audio = new Audio(`/clean_cut_notes/${encoded}`);
    audio.play().catch(err => console.error(`Error playing ${note}:`, err));
  };

  const playChord = (chord) => {
    const notes = chordNoteMap[chord];
    notes.forEach(playNote);
  };

  const flashButton = (chord, type) => {
    setButtonFlashes(prev => ({ ...prev, [chord]: type }));
    setTimeout(() => {
      setButtonFlashes(prev => ({ ...prev, [chord]: null }));
    }, 500);
  };

  const startGame = () => {
    const chordPool = freestyleMode ? allChords : selectedChords.filter(c => chordNoteMap[c]);
    if (chordPool.length === 0) return;

    const generated = Array.from({ length: rounds }, () =>
      chordPool[Math.floor(Math.random() * chordPool.length)]
    );

    setSequence(generated);
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setIsPlaying(true);
    setShowPopup(false);
    setStatusMessage('');
    setRoundMistakeMade(false);
    setRoundOutcomeSet(false);
    setCanAnswer(false);

    setTimeout(() => showNextChord(generated[0]), 300);
  };

  const showNextChord = (chord) => {
    setCurrentChord(chord);
    setCanAnswer(false);

    if (freestyleMode) {
      const others = allChords.filter(c => c !== chord);
      const randomSet = others.sort(() => 0.5 - Math.random()).slice(0, 6);
      setCurrentOptions([...randomSet, chord].sort(() => 0.5 - Math.random()));
    }

    const notes = chordNoteMap[chord];
    let count = 0;
    const repeatFlash = () => {
      keyboardRef.current?.setFlashBlue(notes);
      count++;
      if (count < 3) {
        setTimeout(repeatFlash, 600);
      } else {
        setCanAnswer(true);
      }
    };
    repeatFlash();
  };

  const handleAnswer = (chord) => {
    if (!isPlaying || !currentChord || !canAnswer) return;

    const expectedNotes = chordNoteMap[currentChord].slice().sort();
    const answerNotes = chordNoteMap[chord]?.slice().sort();

    setTriesCount(t => t + 1);
    setStatFlash('tries');
    setTimeout(() => setStatFlash(''), 400);

    if (arraysEqual(answerNotes, expectedNotes)) {
      if (!roundMistakeMade && !roundOutcomeSet) {
        setCorrectCount(c => c + 1);
        setStatFlash('correct');
        setTimeout(() => setStatFlash(''), 400);
        setRoundOutcomeSet(true);
        setStatusMessage("✅ You're right!");
      }

      keyboardRef.current?.setFlashRight(answerNotes);
      flashButton(chord, 'correct');

      if (currentRound + 1 >= sequence.length) {
        setIsPlaying(false);
        setShowPopup(true);
      } else {
        setTimeout(() => {
          const next = sequence[currentRound + 1];
          setCurrentRound(r => r + 1);
          setRoundMistakeMade(false);
          setRoundOutcomeSet(false);
          showNextChord(next);
          setStatusMessage('');
        }, 600);
      }
    } else {
      if (!roundOutcomeSet) {
        setWrongCount(w => w + 1);
        setStatFlash('wrong');
        setTimeout(() => setStatFlash(''), 400);
        setRoundOutcomeSet(true);
        setStatusMessage("❌ Wrong! Try again.");
      }

      setRoundMistakeMade(true);
      setAwaitingRetry(true);
      keyboardRef.current?.setFlashWrong(answerNotes);
      flashButton(chord, 'wrong');
    }
  };

  const displayedChords = freestyleMode ? currentOptions : selectedChords;
  const rows = displayedChords.length > 12 ? 2 : 1;
  const columns = Math.ceil(displayedChords.length / rows || 1);

  return (
    <div className="learn_piano_chords-container">
      <nav className="learn_piano_chords-navbar">
        <div className="learn_piano_chords-navbar-left">
          <div className="learn_piano_chords-logo">Learn Piano Chords</div>
          <button className="learn_piano_chords-btn" onClick={() => {
            const tonicNotes = chordNoteMap[tonic];
            if (tonicNotes) {
              setCanAnswer(false);
              keyboardRef.current?.setFlashBlue(tonicNotes);
              setTimeout(() => setCanAnswer(true), 1800);
            }
          }}>{tonic}</button>
          <button className={`learn_piano_chords-btn ${awaitingRetry ? 'bounce-flash' : ''}`} onClick={() => {
            if (currentChord) {
              setCanAnswer(false);
              const notes = chordNoteMap[currentChord];
              keyboardRef.current?.setFlashBlue(notes);
              setTimeout(() => setCanAnswer(true), 1800);
              setStatusMessage('🔁 Listen again...');
              setAwaitingRetry(false);
            }
          }}>Replay</button>
        </div>
        <div className="learn_piano_chords-stats">
          <span className="learn_piano_chords-stat total">{rounds}</span>/
          <span className={`learn_piano_chords-stat current ${statFlash === 'current' ? 'stat-flash' : ''}`}>{currentRound}</span>/
          <span className={`learn_piano_chords-stat correct ${statFlash === 'correct' ? 'stat-flash' : ''}`}>{correctCount}</span>/
          <span className={`learn_piano_chords-stat wrong ${statFlash === 'wrong' ? 'stat-flash' : ''}`}>{wrongCount}</span>/
          <span className={`learn_piano_chords-stat tries ${statFlash === 'tries' ? 'stat-flash' : ''}`}>{triesCount}</span>
        </div>
        <button className="learn_piano_chords-btn learn_piano_chords-start-btn" onClick={startGame}>{isPlaying ? 'Restart' : 'Start'}</button>
      </nav>

      {statusMessage && <div className="floating-message">{statusMessage}</div>}
      <div className="learn_piano_chords-fill-space" />

      <div className="learn_piano_chords-bottom">
        <div className="learn_piano_chords-chords" style={{ gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {displayedChords.map((chord) => (
            <button
              key={chord}
              className={`learn_piano_chords-chord-btn ${!canAnswer ? 'disabled-answer' : ''} ${buttonFlashes[chord] === 'correct' ? 'btn-flash-correct' : ''} ${buttonFlashes[chord] === 'wrong' ? 'btn-flash-wrong' : ''}`}
              onClick={() => { if (canAnswer) { playChord(chord); handleAnswer(chord); } }}>
              {chord}
            </button>
          ))}
        </div>
        <div className="learn_piano_chords-keyboard">
          <LearnPianoChordsKeyboardView ref={keyboardRef} showLabels={false} />
        </div>
      </div>

      {showPopup && (
        <div className="learn_piano_chords-popup-overlay">
          <div className="learn_piano_chords-popup">
            <h2>🎉 Game Over!</h2>
            <p>Nice job finishing the round!</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Tries:</strong> {triesCount}</p>
            <div className="learn_piano_chords-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/learn-piano-chords')}>⚙️ Back to Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnPianoChords;
