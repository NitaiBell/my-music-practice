// Update: Full logic for keyboard + buttons input, with full game behavior

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardView from './KeyboardView';
import './PingPongMelody.css';

const noteDisplayMap = {
  C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B',
  Cs: 'C#', Ds: 'D#', Fs: 'F#', Gs: 'G#', As: 'A#',
  Bb: 'Bb', Eb: 'Eb', Ab: 'Ab', Db: 'Db',
};

const getBaseNote = (note) => note.replace(/\d$/, '');

const scales = {
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'Fs'],
  D: ['D', 'E', 'Fs', 'G', 'A', 'B', 'Cs'],
  A: ['A', 'B', 'Cs', 'D', 'E', 'Fs', 'Gs'],
  E: ['E', 'Fs', 'Gs', 'A', 'B', 'Cs', 'Ds'],
  F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  Am: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  Dm: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
  Em: ['E', 'Fs', 'G', 'A', 'B', 'C', 'D'],
  Fm: ['F', 'G', 'Gs', 'As', 'C', 'Cs', 'Ds'],
  Gm: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
  Bm: ['B', 'Cs', 'D', 'E', 'Fs', 'G', 'A'],
};

const PingPongMelody = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedNotes = [],
    rounds = 1,
    octaves = [3],
    selectedScale = 'C',
    viewMode = 'buttons',
  } = location.state || {};

  const scaleNotes = selectedNotes.length > 0 ? selectedNotes : scales[selectedScale];
  const tonicNote = selectedScale.replace(/m$/, '');

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
    const middleRounds = rounds - 2;
    const nonTonicNotes = scaleNotes.filter(n => n !== tonicNote);
    if (!scaleNotes.includes(tonicNote) || nonTonicNotes.length === 0) return;

    let pool = [];
    const minPerNote = Math.floor(middleRounds / nonTonicNotes.length);
    const remainder = middleRounds % nonTonicNotes.length;
    nonTonicNotes.forEach((note, i) => {
      const extra = i < remainder ? 1 : 0;
      for (let j = 0; j < minPerNote + extra; j++) pool.push(note);
    });
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return [tonicNote, ...pool, tonicNote];
  };

  const playNote = (note) => {
    const isReference = note === 'TONIC-ref';
    const baseNote = isReference ? tonicNote : note;
    const octave = isReference ? 3 : octaves[Math.floor(Math.random() * octaves.length)];
    const fileNote = baseNote
      .replace('C#', 'Cs').replace('D#', 'Ds').replace('F#', 'Fs')
      .replace('G#', 'Gs').replace('A#', 'As')
      .replace('Db', 'Cs').replace('Eb', 'Ds').replace('Gb', 'Fs')
      .replace('Ab', 'Gs').replace('Bb', 'As');
    const filename = `${fileNote}${octave}.wav`;
    const audio = new Audio(`/clean_cut_notes/${filename}`);
    audio.play();
  };

  const handleStart = () => {
    const newSequence = generateSequence();
    if (!newSequence) return;
    setSequence(newSequence);
    setIsPlaying(true);
    setShowPopup(false);
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setHasAnsweredWrong(false);
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

    const flashClass = isCorrect ? 'correct-flash' : 'wrong-flash';
    const baseNote = getBaseNote(note);

    // Flash the button
    const btnTarget = document.getElementById(`note-btn-${baseNote}`);
    if (btnTarget) {
      btnTarget.classList.add(flashClass);
      setTimeout(() => {
        btnTarget.classList.remove('correct-flash', 'wrong-flash');
      }, 400);
    }

    // Flash the keyboard key
    const keyTarget = document.getElementById(`key-${note}`);
    if (keyTarget) {
      keyTarget.classList.add(flashClass);
      setTimeout(() => {
        keyTarget.classList.remove('correct-flash', 'wrong-flash');
      }, 400);
    }

    if (isCorrect) {
      if (!hasAnsweredWrong) setCorrectCount((c) => c + 1);
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

  return (
    <div className="container_game">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo-title">Sabers melody</div>
          <button className="c-note-btn" onClick={() => playNote('TONIC-ref')}>
            {noteDisplayMap[tonicNote] || tonicNote}
          </button>
          <button className="current-btn" onClick={() => playCurrent()}>Current</button>
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
        <p>You are practicing in the <strong>{selectedScale}</strong> scale</p>
        <p>Notes: <strong>{scaleNotes.map(n => noteDisplayMap[n] || n).join(', ')}</strong></p>
        <p>Octaves: <strong>{octaves.sort().join(', ')}</strong></p>
        <p>(Starts and ends on the tonic — total notes played: <strong>{rounds}</strong>)</p>
      </div>

      {viewMode === 'buttons' ? (
        <div
          className="letter-buttons-area"
          style={{
            gridTemplateRows: `repeat(${Math.min(4, Math.ceil(scaleNotes.length / 6))}, 1fr)`,
            gridTemplateColumns: `repeat(${Math.ceil(scaleNotes.length / Math.min(4, Math.ceil(scaleNotes.length / 6)))}, 1fr)`
          }}>
          {scaleNotes.map((note) => (
            <button
              key={note}
              id={`note-btn-${note}`}
              className="letter-btn"
              onClick={() => handleAnswer(note)}>
              {noteDisplayMap[note] || note}
            </button>
          ))}
        </div>
      ) : (
        <KeyboardView
          mode="game"
          selectedScale={selectedScale}
          selectedNotes={selectedNotes}
          tonic={tonicNote}
          playNote={(note) => {
            playNote(note);
            handleAnswer(note);
          }}
        />
      )}

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
