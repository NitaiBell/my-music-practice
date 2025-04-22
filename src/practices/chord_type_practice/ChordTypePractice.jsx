import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ChordTypePractice.css';
import ChordTypeKeyboard from './ChordTypeKeyboard';

const chordIntervals = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Maj7: [0, 4, 7, 11],
  '7': [0, 4, 7, 10],
  Min7: [0, 3, 7, 10],
  Min6: [0, 3, 7, 9],
  Sus4: [0, 5, 7],
  Dim: [0, 3, 6],
  Aug: [0, 4, 8],
};

const noteOrder = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
const baseNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const getMidiNumber = (note) => {
  const name = note.slice(0, -1);
  const octave = parseInt(note.slice(-1));
  const index = noteOrder.indexOf(name);
  return index + octave * 12;
};

const getNoteFromMidi = (midi) => {
  const index = midi % 12;
  const octave = Math.floor(midi / 12);
  return noteOrder[index] + octave;
};

const buildChord = (root, type) => {
  const intervals = chordIntervals[type] || [];
  const baseMidi = getMidiNumber(root);
  return intervals.map((interval) => getNoteFromMidi(baseMidi + interval));
};

const ChordTypePractice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const {
    selectedChordTypes = ['Major', 'Minor'],
    rounds = 10,
  } = state || {};

  const [sequence, setSequence] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [buttonFlashes, setButtonFlashes] = useState({});
  const [statFlash, setStatFlash] = useState('');
  const [roundMistake, setRoundMistake] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const playNote = (note) => {
    const encoded = encodeURIComponent(`${note}.wav`);
    const audio = new Audio(`/clean_cut_notes/${encoded}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const getRandomBase = () => baseNotes[Math.floor(Math.random() * baseNotes.length)];

  const playChord = (base, type, flash = true) => {
    const root = base + '3';
    const notes = buildChord(root, type);
    notes.forEach(playNote);
    if (flash) keyboardRef.current?.highlightChord(notes);
    return notes;
  };

  const setButtonFlash = (type, kind) => {
    setButtonFlashes((prev) => ({ ...prev, [type]: kind }));
    setTimeout(() => setButtonFlashes((prev) => ({ ...prev, [type]: null })), 500);
  };

  const startGame = () => {
    const newSequence = [];
    let attempts = 0;

    while (newSequence.length < rounds && attempts < 1000) {
      const chordType = selectedChordTypes[Math.floor(Math.random() * selectedChordTypes.length)];
      const base = getRandomBase();
      const root = base + '3';
      const chordNotes = buildChord(root, chordType);
      newSequence.push({ chordType, base });
      attempts++;
    }

    setSequence(newSequence);
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setStatusMessage('');
    setRoundMistake(false);
    setIsPlaying(true);
    setCanAnswer(false);
    setShowPopup(false);

    setTimeout(() => playNextChord(newSequence[0]), 400);
  };

  const playNextChord = ({ base, chordType }) => {
    playChord(base, chordType, false);
    setCanAnswer(true);
    setRoundMistake(false);
    setStatusMessage('');
    setStatFlash('current');
    setTimeout(() => setStatFlash(''), 400);
  };

  const handleCurrent = () => {
    const { base, chordType } = sequence[currentRound];
    playChord(base, chordType, false);
    setStatusMessage('🔁 Listen again...');
  };

  const handleAnswer = (type) => {
    if (!canAnswer || !isPlaying) return;

    setTriesCount((t) => t + 1);
    setStatFlash('tries');
    setTimeout(() => setStatFlash(''), 400);

    const { base, chordType } = sequence[currentRound];

    if (type === chordType) {
      if (!roundMistake) {
        setCorrectCount((c) => c + 1);
        setStatFlash('correct');
        setStatusMessage("✅ You're right!");
      } else {
        setWrongCount((w) => w + 1);
        setStatFlash('wrong');
        setStatusMessage("✔️ Correct, but not on first try.");
      }

      setCanAnswer(false);
      const notes = buildChord(base + '3', chordType);
      keyboardRef.current?.highlightChord(notes);
      keyboardRef.current?.flashCorrect();
      setButtonFlash(type, 'correct');

      if (currentRound + 1 >= sequence.length) {
        setIsPlaying(false);
        setShowPopup(true);
      } else {
        setTimeout(() => {
          const next = sequence[currentRound + 1];
          setCurrentRound((r) => r + 1);
          playNextChord(next);
        }, 700);
      }
    } else {
      setRoundMistake(true);
      setStatusMessage("❌ Try again!");
      keyboardRef.current?.flashWrong();
      setButtonFlash(type, 'wrong');
    }
  };

  const rows = selectedChordTypes.length > 12 ? 2 : 1;
  const columns = Math.ceil(selectedChordTypes.length / rows || 1);

  return (
    <div className="chord_type_game-container">
      <nav className="chord_type_game-navbar">
        <div className="chord_type_game-navbar-left">
          <div className="chord_type_game-logo">Sabers Chords</div>
          <button
  className="chord_type_game-btn"
  onClick={() => {
    const current = sequence[currentRound];
    if (!current) return;
    const root = current.base + '3';
    const notes = buildChord(root, current.chordType);
    notes.forEach((note, index) => {
      setTimeout(() => playNote(note), index * 400); // 400ms spacing between notes
    });
  }}
>
  Arpeggio
</button>
          <button className="chord_type_game-btn" onClick={handleCurrent}>Current</button>
        </div>
        <div className="chord_type_game-stats">
          <span className="chord_type_game-stat total">{rounds}</span>/
          <span className={`chord_type_game-stat current ${statFlash === 'current' ? 'stat-flash' : ''}`}>{currentRound}</span>/
          <span className={`chord_type_game-stat correct ${statFlash === 'correct' ? 'stat-flash' : ''}`}>{correctCount}</span>/
          <span className={`chord_type_game-stat wrong ${statFlash === 'wrong' ? 'stat-flash' : ''}`}>{wrongCount}</span>/
          <span className={`chord_type_game-stat tries ${statFlash === 'tries' ? 'stat-flash' : ''}`}>{triesCount}</span>
        </div>
        <button className="chord_type_game-btn" onClick={startGame}>
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && <div className="floating-message">{statusMessage}</div>}

      <div className="chord_type_game-fill-space" />

      <div className="chord_type_game-bottom">
        <div className="chord_type_game-buttons" style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}>
          {selectedChordTypes.map((type) => (
            <button
              key={type}
              className={`chord_type_game-chord-btn ${
                buttonFlashes[type] === 'correct' ? 'btn-flash-correct' : ''
              } ${buttonFlashes[type] === 'wrong' ? 'btn-flash-wrong' : ''}`}
              onClick={() => handleAnswer(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="chord_type_game-keyboard">
          <ChordTypeKeyboard ref={keyboardRef} />
        </div>
      </div>

      {showPopup && (
        <div className="chord_type_game-popup-overlay">
          <div className="chord_type_game-popup">
            <h2>🎉 Game Over!</h2>
            <p>Great job completing the practice!</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Tries:</strong> {triesCount}</p>
            <div className="chord_type_game-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/chord-type')}>⚙️ Back to Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChordTypePractice;
