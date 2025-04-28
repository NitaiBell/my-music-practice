// src/practices/which_higher_note/WhichHigherNote.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './WhichHigherNote.css';

export default function WhichHigherNote() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    rounds = 10,
    octaves = [3, 4],
  } = state || {};

  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [notePair, setNotePair] = useState([]);
  const [canAnswer, setCanAnswer] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [flashButton, setFlashButton] = useState('');

  const allNotes = [];
  ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'].forEach((note) => {
    octaves.forEach((oct) => allNotes.push(`${note}${oct}`));
  });

  const noteOrder = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];

  const getNoteBase = (note) => note.replace(/\d/, '');
  const getNoteIndex = (note) => noteOrder.indexOf(getNoteBase(note));

  const playNote = (note) => {
    const audio = new Audio(`/clean_cut_notes/${note}.wav`);
    audio.play();
  };

  const playCorrect = () => {
    const audio = new Audio('/wrong_right/correct.mp3');
    audio.play();
  };

  const playWrong = () => {
    const audio = new Audio('/wrong_right/wrong.mp3');
    audio.play();
  };

  const generateNotePair = () => {
    const firstNote = allNotes[Math.floor(Math.random() * allNotes.length)];
    const firstIdx = getNoteIndex(firstNote);
    const firstOctave = parseInt(firstNote.replace(/\D/g, ''), 10);

    const offsets = [-3, -2, -1, 1, 2, 3];
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    let secondIdx = firstIdx + offset;
    let secondOctave = firstOctave;

    if (secondIdx < 0) {
      secondIdx += 12;
      secondOctave -= 1;
    } else if (secondIdx > 11) {
      secondIdx -= 12;
      secondOctave += 1;
    }

    const secondNote = `${noteOrder[secondIdx]}${secondOctave}`;
    return [firstNote, secondNote];
  };

  const startGame = () => {
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setShowPopup(false);
    loadNextRound();
  };

  const loadNextRound = () => {
    if (currentRound >= rounds) {
      setShowPopup(true);
      return;
    }
    const newPair = generateNotePair();
    setNotePair(newPair);
    setCanAnswer(false);
    setStatusMessage('🎶 Listen carefully...');
    setFlashButton('');

    setTimeout(() => {
      playNote(newPair[0]);
      setTimeout(() => {
        playNote(newPair[1]);
        setTimeout(() => {
          setCanAnswer(true);
          setStatusMessage('');
        }, 500);
      }, 600);
    }, 500);
  };

  const handleAnswer = (choice) => {
    if (!canAnswer) return;
    setTriesCount((t) => t + 1);

    const firstIdx = getNoteIndex(notePair[0]) + 12 * parseInt(notePair[0].replace(/\D/g, ''), 10);
    const secondIdx = getNoteIndex(notePair[1]) + 12 * parseInt(notePair[1].replace(/\D/g, ''), 10);

    const correctChoice = firstIdx > secondIdx ? 'first' : 'second';

    if (choice === correctChoice) {
      playCorrect();
      setStatusMessage('✅ Correct!');
      setFlashButton(choice + '-correct');
      setCorrectCount((c) => c + 1);
      setCanAnswer(false);
      setTimeout(() => {
        setCurrentRound((r) => r + 1);
        loadNextRound();
      }, 1000);
    } else {
      playWrong();
      setStatusMessage('❌ Wrong! Try Again.');
      setFlashButton(choice + '-wrong');
      setWrongCount((w) => w + 1);
      setTimeout(() => setFlashButton(''), 800);
    }
  };

  const handleReplayBoth = () => {
    if (notePair.length) {
      playNote(notePair[0]);
      setTimeout(() => playNote(notePair[1]), 600);
    }
  };

  const handleReplayFirst = () => {
    if (notePair[0]) playNote(notePair[0]);
  };

  const handleReplaySecond = () => {
    if (notePair[1]) playNote(notePair[1]);
  };

  return (
    <div className="which_higher_note-container">
      <nav className="which_higher_note-navbar">
        <div className="which_higher_note-navbar-left">
          <div className="which_higher_note-logo">Which Note is Higher?</div>
          <button className="which_higher_note-btn" onClick={handleReplayBoth}>🔁 Replay Both</button>
          <button className="which_higher_note-btn" onClick={handleReplayFirst}>🎵 First</button>
          <button className="which_higher_note-btn" onClick={handleReplaySecond}>🎶 Second</button>
        </div>

        <div className="which_higher_note-stats">
          <span className="which_higher_note-stat total">{rounds}</span> /
          <span className="which_higher_note-stat current">{currentRound + 1}</span> /
          <span className="which_higher_note-stat correct">{correctCount}</span> /
          <span className="which_higher_note-stat wrong">{wrongCount}</span> /
          <span className="which_higher_note-stat tries">{triesCount}</span>
        </div>

        <button className="which_higher_note-btn which_higher_note-start-btn" onClick={startGame}>
          {currentRound === 0 ? 'Start' : 'Restart'}
        </button>
      </nav>

      {statusMessage && (
        <div className="which_higher_note-floating-message">{statusMessage}</div>
      )}

      <div className="which_higher_note-fill-space" />

      <div className="which_higher_note-bottom">
        <button
          className={`which_higher_note-answer-btn ${
            flashButton === 'first-correct' ? 'flash-correct-which-note' : ''
          } ${flashButton === 'first-wrong' ? 'flash-wrong-which-note' : ''}`}
          onClick={() => handleAnswer('first')}
        >
          First Note
        </button>

        <button
          className={`which_higher_note-answer-btn ${
            flashButton === 'second-correct' ? 'flash-correct-which-note' : ''
          } ${flashButton === 'second-wrong' ? 'flash-wrong-which-note' : ''}`}
          onClick={() => handleAnswer('second')}
        >
          Second Note
        </button>
      </div>

      {showPopup && (
        <div className="which_higher_note-popup-overlay">
          <div className="which_higher_note-popup">
            <h2>🎉 Practice Complete!</h2>
            <p><strong>Rounds:</strong> {rounds}</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Attempts:</strong> {triesCount}</p>
            <div className="which_higher_note-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/which-higher-note/settings')}>⚙️ Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
