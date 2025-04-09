import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PingPongMelody.css';

const noteDisplayMap = {
  C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B',
  Cs: 'C#', Ds: 'D#', Fs: 'F#', Gs: 'G#', As: 'A#',
};

const getBaseNote = (note) => note.replace(/\d$/, '');

const PingPongMelody = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedNotes = [],
    rounds = 1,
    octaves = [3],
  } = location.state || {};

  const [sequence, setSequence] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [canAnswer, setCanAnswer] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [hasAnsweredWrong, setHasAnsweredWrong] = useState(false);

  const generateSequence = () => {
    const notesCount = selectedNotes.length;
    const minC = Math.ceil(rounds / notesCount);
    const nonCNotes = selectedNotes.filter(n => n !== 'C');

    if (!selectedNotes.includes('C') || nonCNotes.length === 0) {
      alert("C must be included and there must be at least one other note.");
      return;
    }

    const otherRounds = rounds - minC;
    let pool = [];

    const cMiddleCount = Math.max(minC - 2, 0);
    for (let i = 0; i < cMiddleCount; i++) pool.push('C');

    const minPerNote = Math.floor(otherRounds / nonCNotes.length);
    const remainder = otherRounds % nonCNotes.length;

    nonCNotes.forEach((note, i) => {
      const extra = i < remainder ? 1 : 0;
      for (let j = 0; j < minPerNote + extra; j++) {
        pool.push(note);
      }
    });

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const result = ['C'];
    while (pool.length) {
      const last = result[result.length - 1];
      const secondLast = result[result.length - 2];
      let nextIndex = pool.findIndex(n => !(n === last && last === secondLast));
      if (nextIndex === -1) nextIndex = 0;
      result.push(pool[nextIndex]);
      pool.splice(nextIndex, 1);
    }

    result.push('C');
    return result;
  };

  const playNote = (note) => {
    const isReferenceC = note === 'C-ref';
    const baseNote = isReferenceC ? 'C' : note;
    const octave = isReferenceC ? 3 : octaves[Math.floor(Math.random() * octaves.length)];
    const filename = `${baseNote}${octave}.wav`;
    const audio = new Audio(`/clean_cut_notes/${filename}`);
    audio.play().catch((err) => console.error(`Error playing ${filename}:`, err));
  };

  const handleStart = () => {
    const newSequence = generateSequence();
    if (!newSequence) return;
  
    // Set state for the sequence and game details
    setSequence(newSequence);
    setIsPlaying(true);
    setShowPopup(false);
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setHasAnsweredWrong(false);
  
    // Play the first note immediately after setting up the game
    playNote(newSequence[0]);
    setCurrentNote(newSequence[0]);
    setCanAnswer(true);
  };
  

  const playCurrent = (index = currentRound) => {
    const note = sequence[index];
    setCurrentNote(note);
    playNote(note);
    setCanAnswer(true);
  };

  const handleAnswer = (note) => {
    if (!isPlaying || !canAnswer) return;

    const currentExpected = sequence[currentRound];
    const isCorrect = getBaseNote(note) === getBaseNote(currentExpected);

    const button = document.getElementById(`note-btn-${note}`);
    if (button) {
      button.classList.add(isCorrect ? 'correct-flash' : 'wrong-flash');
      setTimeout(() => {
        button.classList.remove('correct-flash', 'wrong-flash');
      }, 400);
    }

    if (isCorrect) {
      if (!hasAnsweredWrong) {
        setCorrectCount((c) => c + 1);
      }
      setCanAnswer(false);
      if (currentRound + 1 >= sequence.length) {
        setTimeout(() => {
          setIsPlaying(false);
          setShowPopup(true);
        }, 300);
      } else {
        setTimeout(() => {
          setCurrentRound((r) => r + 1);
          setHasAnsweredWrong(false);
          playCurrent(currentRound + 1);
        }, 500);
      }
    } else {
      setWrongCount((w) => w + 1);
      setHasAnsweredWrong(true);
      setCanAnswer(false);
    }
  };

  const handleReplayCurrent = () => {
    if (isPlaying) playCurrent();
  };

  return (
    <div className="container_game">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo-title">Sabers melody</div>
          <button className="c-note-btn" onClick={() => playNote('C-ref')}>C</button>
          <button className="current-btn" onClick={handleReplayCurrent}>Current</button>
        </div>

        <div className="navbar-stats">
          <span className="stat total">{rounds}</span>/
          <span className="stat current">{currentRound}</span>/
          <span className="stat correct">{correctCount}</span>/
          <span className="stat wrong">{wrongCount}</span>
        </div>

        <button className="start-btn" onClick={handleStart}>
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      <div className="summary">
        <p>You are in the game now</p>
        <p>
          You chose notes to practice:{" "}
          <strong>{selectedNotes.map(n => noteDisplayMap[n]).join(', ')}</strong>
        </p>
        <p>
          Octaves: <strong>{octaves.sort().join(', ')}</strong>
        </p>
      </div>

      <div
        className="letter-buttons-area"
        style={{
          gridTemplateRows: `repeat(${Math.min(4, Math.ceil(selectedNotes.length / 6))}, 1fr)`,
          gridTemplateColumns: `repeat(${Math.ceil(selectedNotes.length / Math.min(4, Math.ceil(selectedNotes.length / 6)))}, 1fr)`
        }}
      >
        {selectedNotes.map((note) => (
          <button
            key={note}
            id={`note-btn-${note}`}
            className="letter-btn"
            onClick={() => handleAnswer(note)}
          >
            {noteDisplayMap[note]}
          </button>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🎉 Game Over!</h2>
            <p>You completed the melody practice!</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <div className="popup-buttons">
              <button onClick={handleStart}>🔁 Restart</button>
              <button onClick={() => navigate('/melody')}>⚙️ Back to Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PingPongMelody;











