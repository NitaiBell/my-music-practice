// src/practices/difference_practice/DifferencePractice.jsx

import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DifferencePractice.css';
import DifferencePracticeKeyboardView from './DifferencePracticeKeyboardView';
import { calculateDifferenceRank } from './calculateDifferenceRank';

const DifferencePractice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();
  const startAnswerTimeRef = useRef(null);
  const totalAnswerTimeRef = useRef(0);

  const {
    selectedScale = 'C',
    selectedNotes = [],
    rounds = 10,
    sequenceLength = 4,
  } = state || {};

  const [sequence1, setSequence1] = useState([]);
  const [sequence2, setSequence2] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [canAnswer, setCanAnswer] = useState(false);
  const [wrongNoteIndex, setWrongNoteIndex] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [floatingAnim, setFloatingAnim] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [buttonFlashes, setButtonFlashes] = useState({});
  const [statFlash, setStatFlash] = useState('');
  const [roundMistake, setRoundMistake] = useState(false);

  const playNote = (note) => {
    const normalized = note.replace('#', 's').replace('b', 'f');
    const encoded = encodeURIComponent(`${normalized}3.wav`);
    const audio = new Audio(`/clean_cut_notes/${encoded}`);
    audio.play().catch((err) => console.error(`Error playing ${note}:`, err));
  };

  const playSequence = async (seq) => {
    for (let note of seq) {
      playNote(note);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  };

  const generateSequences = () => {
    const seq1 = Array.from({ length: sequenceLength }, () =>
      selectedNotes[Math.floor(Math.random() * selectedNotes.length)]
    );
    const seq2 = [...seq1];
    const changeIndex = Math.floor(Math.random() * sequenceLength);
    let newNote;
    do {
      newNote = selectedNotes[Math.floor(Math.random() * selectedNotes.length)];
    } while (newNote === seq1[changeIndex]);
    seq2[changeIndex] = newNote;

    return { seq1, seq2, changeIndex };
  };

  const prepareNextRound = () => {
    const { seq1, seq2, changeIndex } = generateSequences();

    setSequence1(seq1);
    setSequence2(seq2);
    setWrongNoteIndex(changeIndex);
    setRoundMistake(false);

    setStatusMessage('🎶 Preparing next round...');
    triggerFloating();
    setIsPlayingSequence(true);
    setCanAnswer(false);

    setTimeout(async () => {
      setStatusMessage('🎶 Listening...');
      triggerFloating();
      await playSequence(seq1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await playSequence(seq2);

      setIsPlayingSequence(false);
      setCanAnswer(true);
      startAnswerTimeRef.current = performance.now();
      setStatusMessage('🧠 Find the difference!');
      triggerFloating();
    }, 500);
  };

  const startGame = () => {
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setIsPlaying(true);
    setCanAnswer(false);
    setStatusMessage('');
    setShowPopup(false);
    setButtonFlashes({});
    totalAnswerTimeRef.current = 0;
    prepareNextRound();
  };

  const handleReplay = async (target) => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);
    setCanAnswer(false);
    setStatusMessage('🎶 Listening...');
    triggerFloating();
    if (target === 'both') {
      await playSequence(sequence1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await playSequence(sequence2);
    } else if (target === 'seq1') {
      await playSequence(sequence1);
    } else if (target === 'seq2') {
      await playSequence(sequence2);
    }
    setIsPlayingSequence(false);
    setCanAnswer(true);
    startAnswerTimeRef.current = performance.now();
    setStatusMessage('🧠 Find the difference!');
    triggerFloating();
  };

  const setButtonFlash = (index, type) => {
    setButtonFlashes((prev) => ({ ...prev, [index]: type }));
    setTimeout(() => {
      setButtonFlashes((prev) => ({ ...prev, [index]: null }));
    }, 600);
  };

  const triggerFloating = () => {
    setFloatingAnim(false);
    setTimeout(() => setFloatingAnim(true), 30);
  };

  const handleAnswer = async (index) => {
    if (!canAnswer || !isPlaying || isPlayingSequence) return;

    totalAnswerTimeRef.current += (performance.now() - startAnswerTimeRef.current);
    setTriesCount((t) => t + 1);
    setStatFlash('tries');
    setTimeout(() => setStatFlash(''), 400);

    if (index === wrongNoteIndex) {
      if (!roundMistake) setCorrectCount((c) => c + 1);
      setStatFlash('correct');
      setTimeout(() => setStatFlash(''), 400);
      setButtonFlash(index, 'correct');
      setStatusMessage('✅ Correct! Good ears!');
      triggerFloating();
      setCanAnswer(false);

      if (currentRound + 1 >= rounds) {
        setIsPlaying(false);
        setShowPopup(true);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setCurrentRound((r) => r + 1);
        prepareNextRound();
      }
    } else {
      if (!roundMistake) {
        setWrongCount((w) => w + 1);
        setRoundMistake(true);
      }
      setStatFlash('wrong');
      setTimeout(() => setStatFlash(''), 400);
      setButtonFlash(index, 'wrong');
      setStatusMessage('❌ Wrong! Click replay to hear again.');
      triggerFloating();
    }
  };

  const rows = sequenceLength > 8 ? 2 : 1;
  const columns = Math.ceil(sequenceLength / rows || 1);

  return (
    <div className="differencegame-container">
      <nav className="differencegame-navbar">
        <div className="differencegame-navbar-left">
          <div className="differencegame-logo">Difference Practice</div>
          <button className="differencegame-btn" onClick={() => handleReplay('both')} disabled={isPlayingSequence}>Replay Both</button>
          <button className="differencegame-btn" onClick={() => handleReplay('seq1')} disabled={isPlayingSequence}>Replay Seq 1</button>
          <button className="differencegame-btn" onClick={() => handleReplay('seq2')} disabled={isPlayingSequence}>Replay Seq 2</button>
        </div>
        <div className="differencegame-stats">
          <span className="differencegame-stat total">{rounds}</span>/
          <span className={`differencegame-stat current ${statFlash === 'current' ? 'stat-flash' : ''}`}>{currentRound}</span>/
          <span className={`differencegame-stat correct ${statFlash === 'correct' ? 'stat-flash' : ''}`}>{correctCount}</span>/
          <span className={`differencegame-stat wrong ${statFlash === 'wrong' ? 'stat-flash' : ''}`}>{wrongCount}</span>/
          <span className={`differencegame-stat tries ${statFlash === 'tries' ? 'stat-flash' : ''}`}>{triesCount}</span>
        </div>
        <button className="differencegame-btn differencegame-start-btn" onClick={startGame}>
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && (
        <div className={`differencegame-floating-message ${floatingAnim ? 'floating-anim' : ''}`}>
          {statusMessage}
        </div>
      )}

      <div className="differencegame-fill-space" />

      <div className="differencegame-bottom">
        <div
          className="differencegame-buttons"
          style={{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {Array.from({ length: sequenceLength }, (_, idx) => (
            <button
              key={idx}
              className={`differencegame-note-btn ${buttonFlashes[idx] === 'correct' ? 'btn-flash-correct' : ''} ${buttonFlashes[idx] === 'wrong' ? 'btn-flash-wrong' : ''}`}
              onClick={() => handleAnswer(idx)}
              disabled={isPlayingSequence}
            >
              Note {idx + 1}
            </button>
          ))}
        </div>

        <div className="differencegame-keyboard">
          <DifferencePracticeKeyboardView ref={keyboardRef} />
        </div>
      </div>

      {showPopup && (
  <div className="differencegame-popup-overlay">
    <div className="differencegame-popup">
      <h2>🎉 Great Job!</h2>
      <p>You finished the difference practice!</p>
      <p><strong>Correct:</strong> {correctCount}</p>
      <p><strong>Wrong:</strong> {wrongCount}</p>
      <p><strong>Total Tries:</strong> {triesCount}</p>

      {rounds >= 5 ? (() => {
        const {
          score,
          max,
          avgTimePerAnswer,
          level,
          rightScore,
          tryScore,
          speedScore
        } = calculateDifferenceRank({
          selectedNotes,
          sequenceLength,
          correctCount,
          triesCount,
          rounds,
          totalAnswerTimeSec: totalAnswerTimeRef.current / 1000,
        });

        return (
          <>
            <p><strong>Level:</strong> {level}</p>
            <p><strong>Overall Rank:</strong> {score} / {max}</p>
            <p><strong>Breakdown:</strong></p>
            <ul style={{ lineHeight: '1.6', listStyleType: 'none', paddingLeft: 0 }}>
              <li>✅ Right/Wrong: <strong>{rightScore}</strong> / 75</li>
              <li>🔁 Tries: <strong>{tryScore}</strong> / 15</li>
              <li>⚡ Speed: <strong>{speedScore}</strong> / 10</li>
            </ul>
            <p><strong>Avg Time per Answer:</strong> {avgTimePerAnswer}s</p>
          </>
        );
      })() : (
        <p><strong>Rank:</strong> Not calculated (minimum 5 rounds required)</p>
      )}

      <div className="differencegame-popup-buttons">
        <button onClick={startGame}>🔁 Restart</button>
        <button onClick={() => navigate('/difference/settings')}>⚙️ Back to Settings</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default DifferencePractice;
