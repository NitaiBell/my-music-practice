// src/practices/write_notes_practice/WriteNotesPractice.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './WriteNotesPractice.css';
import WriteNotesStaffView from './WriteNotesStaffView';

const WriteNotesPractice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const staffRef = useRef();

  const {
    selectedScale = 'C',
    selectedNotes = [],
    rounds = 10,
    notesPerRound = 4,
  } = state || {};

  const [currentRound, setCurrentRound] = useState(0);
  const [targetSequence, setTargetSequence] = useState([]);
  const [userIndex, setUserIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [floatingAnim, setFloatingAnim] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [statFlash, setStatFlash] = useState('');

  const generateSequence = () => {
    return Array.from({ length: notesPerRound }, () =>
      selectedNotes[Math.floor(Math.random() * selectedNotes.length)]
    );
  };

  const triggerFloating = () => {
    setFloatingAnim(false);
    setTimeout(() => setFloatingAnim(true), 30);
  };

  const startGame = () => {
    setIsPlaying(true);
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setShowPopup(false);
    setStatusMessage('🎯 Start placing the notes!');
    triggerFloating();
    setUserIndex(0);
    setTargetSequence(generateSequence());
  };

  const handleNoteSelected = (note) => {
    if (!isPlaying || userIndex >= targetSequence.length) return;

    setTriesCount((t) => t + 1);
    setStatFlash('tries');
    setTimeout(() => setStatFlash(''), 400);

    const expected = targetSequence[userIndex];
    const normalize = (n) => n.replace('#', '♯').replace('b', '♭').toUpperCase();
    if (normalize(note[0]) === normalize(expected[0])) {
      setUserIndex((i) => i + 1);
      staffRef.current?.setFlashRight(note);
      if (userIndex + 1 === targetSequence.length) {
        setCorrectCount((c) => c + 1);
        setStatFlash('correct');
        setStatusMessage('✅ Correct sequence!');
        triggerFloating();
        setTimeout(() => {
          if (currentRound + 1 >= rounds) {
            setIsPlaying(false);
            setShowPopup(true);
          } else {
            setCurrentRound((r) => r + 1);
            setTargetSequence(generateSequence());
            setUserIndex(0);
            setStatusMessage('🎯 Next round!');
            triggerFloating();
          }
        }, 800);
      } else {
        setStatusMessage(`✅ Correct: ${expected}`);
        triggerFloating();
      }
    } else {
      setWrongCount((w) => w + 1);
      setStatFlash('wrong');
      staffRef.current?.setFlashWrong(note);
      setStatusMessage('❌ Wrong! Restart the sequence.');
      triggerFloating();
      setUserIndex(0);
    }
  };

  return (
    <div className="write_notes_practice-container">
      <nav className="write_notes_practice-navbar">
        <div className="write_notes_practice-navbar-left">
          <div className="write_notes_practice-logo">Write Notes</div>
        </div>
        <div className="write_notes_practice-stats">
          <span className="write_notes_practice-stat total">{rounds}</span>/
          <span className={`write_notes_practice-stat current ${statFlash === 'current' ? 'stat-flash' : ''}`}>{currentRound}</span>/
          <span className={`write_notes_practice-stat correct ${statFlash === 'correct' ? 'stat-flash' : ''}`}>{correctCount}</span>/
          <span className={`write_notes_practice-stat wrong ${statFlash === 'wrong' ? 'stat-flash' : ''}`}>{wrongCount}</span>/
          <span className={`write_notes_practice-stat tries ${statFlash === 'tries' ? 'stat-flash' : ''}`}>{triesCount}</span>
        </div>
        <button className="write_notes_practice-btn write_notes_practice-start-btn" onClick={startGame}>
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && (
        <div className={`write_notes_practice-floating-message ${floatingAnim ? 'floating-anim' : ''}`}>
          {statusMessage}
        </div>
      )}

      <div className="write_notes_practice-sequence">
        {targetSequence.map((note, idx) => (
          <div
            key={idx}
            className={`write_notes_practice-sequence-card ${idx === userIndex ? 'active' : ''}`}
          >
            {note}
          </div>
        ))}
      </div>

      <div className="write_notes_practice-staff-wrapper">
        <WriteNotesStaffView ref={staffRef} onNoteSelected={handleNoteSelected} />
      </div>

      {showPopup && (
        <div className="write_notes_practice-popup-overlay">
          <div className="write_notes_practice-popup">
            <h2>🎉 Well Done!</h2>
            <p>You finished the Write Notes practice!</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Tries:</strong> {triesCount}</p>
            <div className="write_notes_practice-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/write-notes/settings')}>⚙️ Back to Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WriteNotesPractice;
