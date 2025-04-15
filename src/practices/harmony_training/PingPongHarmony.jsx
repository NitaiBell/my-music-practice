import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PingPongHarmony.css';
import PingPongHarmonyKeyboardView from './PingPongHarmonyKeyboardView';

const chordNoteMap = {
  C: ['C3', 'E3', 'G3'], D: ['D3', 'Fs3', 'A3'], Dm: ['D3', 'F3', 'A3'],
  Em: ['E3', 'G3', 'B3'], F: ['F3', 'A3', 'C4'], G: ['G3', 'B3', 'D4'],
  Am: ['A3', 'C4', 'E4'], Bdim: ['B3', 'D4', 'F4'], Bm: ['B3', 'D4', 'Fs4'],
  'F#dim': ['Fs3', 'A3', 'C4'], Gm: ['G3', 'As3', 'D4'], Bb: ['As2', 'D3', 'F3'],
  Edim: ['E3', 'G3', 'As3'],
};

const PingPongHarmony = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const { selectedScale = 'C', selectedChords = [], rounds = 10 } = state || {};
  const tonic = selectedScale.replace(/m$/, '');

  const [sequence, setSequence] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [currentChord, setCurrentChord] = useState('');
  const [canAnswer, setCanAnswer] = useState(false);
  const [roundMistakeMade, setRoundMistakeMade] = useState(false);
  const [roundOutcomeSet, setRoundOutcomeSet] = useState(false);
  const [awaitingRetry, setAwaitingRetry] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [buttonFlashes, setButtonFlashes] = useState({});
  const [statFlash, setStatFlash] = useState('');
  const [statusMessage, setStatusMessage] = useState(''); // ✅ New status message

  const playNote = (note) => {
    const encoded = encodeURIComponent(`${note}.wav`);
    const audio = new Audio(`/clean_cut_notes/${encoded}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const playChord = (chord) => {
    const notes = chordNoteMap[chord];
    notes.forEach(playNote);
  };

  const setButtonFlash = (chord, type) => {
    setButtonFlashes((prev) => ({ ...prev, [chord]: type }));
    setTimeout(() => {
      setButtonFlashes((prev) => ({ ...prev, [chord]: null }));
    }, 500);
  };

  const startGame = () => {
    if (!selectedChords.includes(tonic)) return;

    const middleRounds = rounds - 2;
    const nonTonicChords = selectedChords.filter((chord) => chord !== tonic);
    if (middleRounds < 0 || nonTonicChords.length === 0) return;

    const middle = Array.from({ length: middleRounds }, () =>
      nonTonicChords[Math.floor(Math.random() * nonTonicChords.length)]
    );

    const fullSequence = [tonic, ...middle, tonic];

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
    setStatusMessage('');
    setShowPopup(false);

    setTimeout(() => playNextChord(fullSequence[0]), 300);
  };

  const playNextChord = (chord) => {
    setCurrentChord(chord);
    playChord(chord);
    setCanAnswer(true);
    setRoundMistakeMade(false);
    setRoundOutcomeSet(false);
    setAwaitingRetry(false);
    setStatusMessage('');
    setStatFlash('current');
    setTimeout(() => setStatFlash(''), 400);
  };

  const handleCurrent = () => {
    if (sequence[currentRound]) {
      playChord(sequence[currentRound]);
      setAwaitingRetry(false);
      setStatusMessage('🔁 Listen again...');
    }
  };

  const handleAnswer = (chord) => {
    if (!canAnswer || !isPlaying) return;

    const expectedChord = sequence[currentRound];
    const notes = chordNoteMap[chord];

    setTriesCount((t) => t + 1);
    setStatFlash('tries');
    setTimeout(() => setStatFlash(''), 400);

    if (chord === expectedChord) {
      if (!roundOutcomeSet && !roundMistakeMade) {
        setCorrectCount((c) => c + 1);
        setStatFlash('correct');
        setTimeout(() => setStatFlash(''), 400);
        setRoundOutcomeSet(true);
        setStatusMessage("✅ You're right!");
      }

      setCanAnswer(false);
      keyboardRef.current?.setFlashRight(notes);
      setButtonFlash(chord, 'correct');

      if (currentRound + 1 >= sequence.length) {
        setIsPlaying(false);
        setShowPopup(true);
      } else {
        setTimeout(() => {
          const next = sequence[currentRound + 1];
          setCurrentRound((r) => r + 1);
          playNextChord(next);
        }, 600);
      }
    } else {
      if (!roundOutcomeSet) {
        setWrongCount((w) => w + 1);
        setStatFlash('wrong');
        setTimeout(() => setStatFlash(''), 400);
        setRoundOutcomeSet(true);
        setStatusMessage("❌ You're wrong! Click 'Current' to hear it again.");
      }

      setRoundMistakeMade(true);
      setAwaitingRetry(true);
      keyboardRef.current?.setFlashWrong(notes);
      setButtonFlash(chord, 'wrong');
    }
  };

  const rows = selectedChords.length > 12 ? 2 : 1;
  const columns = Math.ceil(selectedChords.length / rows || 1);

  return (
    <div className="harmonygame-container">
      <nav className="harmonygame-navbar">
        <div className="harmonygame-navbar-left">
          <div className="harmonygame-logo">Sabers Harmony</div>
          <button className="harmonygame-btn" onClick={() => playChord(tonic)}>{tonic}</button>
          <button
            className={`harmonygame-btn ${awaitingRetry ? 'bounce-flash' : ''}`}
            onClick={handleCurrent}
          >
            Current
          </button>
        </div>
        <div className="harmonygame-stats">
          <span className="harmonygame-stat total">{rounds}</span>/
          <span className={`harmonygame-stat current ${statFlash === 'current' ? 'stat-flash' : ''}`}>{currentRound}</span>/
          <span className={`harmonygame-stat correct ${statFlash === 'correct' ? 'stat-flash' : ''}`}>{correctCount}</span>/
          <span className={`harmonygame-stat wrong ${statFlash === 'wrong' ? 'stat-flash' : ''}`}>{wrongCount}</span>/
          <span className={`harmonygame-stat tries ${statFlash === 'tries' ? 'stat-flash' : ''}`}>{triesCount}</span>
        </div>
        <button className="harmonygame-btn harmonygame-start-btn" onClick={startGame}>
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && (
        <div className="floating-message">
          {statusMessage}
        </div>
      )}

      <div className="harmonygame-fill-space" />

      <div className="harmonygame-bottom">
        <div
          className="harmonygame-chords"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {selectedChords.map((chord) => (
            <button
              key={chord}
              className={`harmonygame-chord-btn ${buttonFlashes[chord] === 'correct' ? 'btn-flash-correct' : ''} ${buttonFlashes[chord] === 'wrong' ? 'btn-flash-wrong' : ''}`}
              onClick={() => handleAnswer(chord)}
            >
              {chord}
            </button>
          ))}
        </div>

        <div className="harmonygame-keyboard">
          <PingPongHarmonyKeyboardView ref={keyboardRef} />
        </div>
      </div>

      {showPopup && (
        <div className="harmonygame-popup-overlay">
          <div className="harmonygame-popup">
            <h2>🎉 Game Over!</h2>
            <p>You completed the harmony practice!</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Tries:</strong> {triesCount}</p>
            <div className="harmonygame-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/harmony')}>⚙️ Back to Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PingPongHarmony;
