import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './IntervalPractice.css';
import IntervalPracticeKeyboardView from "./IntervalPracticeKeyboardView";
import { calculateIntervalPracticeRank } from './calculateIntervalPracticeRank'; // ✅ import rank function
import { logPracticeResult } from "../../../utils/logPracticeResult";


export default function IntervalPractice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();
  const answerTimeStartRef = useRef(null);
  const totalAnswerTimeRef = useRef(0);
  const [rankData, setRankData] = useState(null); // ✅ track rank result

  const {
    selectedIntervals = [],
    baseNotes = [],
    rounds = 10,
    octaves = [3, 4, 5],
    direction = 'both',
  } = state || {};

  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalPair, setIntervalPair] = useState([]);
  const [highlightNote, setHighlightNote] = useState('');
  const [answeredNotes, setAnsweredNotes] = useState([]);
  const [hasFailedThisRound, setHasFailedThisRound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const getNoteBase = (note) => note.replace(/\d/, '');

  const noteToMidi = (note) => {
    const baseMap = { C: 0, Cs: 1, D: 2, Ds: 3, E: 4, F: 5, Fs: 6, G: 7, Gs: 8, A: 9, As: 10, B: 11 };
    const base = getNoteBase(note);
    const octave = parseInt(note.match(/\d+/)?.[0] || '4');
    return 12 * (octave + 1) + baseMap[base];
  };

  const midiToNote = (midi) => {
    const noteNames = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
    const note = noteNames[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${note}${octave}`;
  };

  const getIntervalSemitone = (name) => {
    const map = {
      'Unison': 0, 'Minor 2nd': 1, 'Major 2nd': 2,
      'Minor 3rd': 3, 'Major 3rd': 4, 'Perfect 4th': 5,
      'Tritone': 6, 'Perfect 5th': 7, 'Minor 6th': 8,
      'Major 6th': 9, 'Minor 7th': 10, 'Major 7th': 11, 'Octave': 12,
    };
    return map[name] ?? 0;
  };

  const getRandomNote = () => {
    const note = baseNotes[Math.floor(Math.random() * baseNotes.length)];
    const octave = octaves[Math.floor(Math.random() * octaves.length)];
    return `${note}${octave}`;
  };

  const isNoteInRange = (note) => {
    const midi = noteToMidi(note);
    const allPossible = baseNotes.flatMap(base =>
      octaves.map(oct => noteToMidi(`${base}${oct}`))
    );
    const min = Math.min(...allPossible);
    const max = Math.max(...allPossible);
    return midi >= min && midi <= max;
  };

  const generateIntervalPair = () => {
    let attempt = 0;
    while (attempt < 10) {
      const intervalName = selectedIntervals[Math.floor(Math.random() * selectedIntervals.length)];
      const semitones = getIntervalSemitone(intervalName);
      const baseNote = getRandomNote();
      const midi = noteToMidi(baseNote);

      let secondMidi;
      if (direction === 'ascending') {
        secondMidi = midi + semitones;
      } else if (direction === 'descending') {
        secondMidi = midi - semitones;
      } else {
        secondMidi = Math.random() < 0.5 ? midi + semitones : midi - semitones;
      }

      const secondNote = midiToNote(secondMidi);
      if (isNoteInRange(secondNote)) {
        return [baseNote, secondNote];
      }

      attempt++;
    }

    return [getRandomNote(), getRandomNote()];
  };

  const playInterval = ([note1, note2]) => {
    setTimeout(() => keyboardRef.current.playNote(note1, false), 200);
    setTimeout(() => keyboardRef.current.playNote(note2, false), 700);
  };

  const startGame = () => {
    setIsPlaying(true);
    setCurrentRound(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTriesCount(0);
    setStatusMessage('');
    setAnsweredNotes([]);
    setHasFailedThisRound(false);
    setShowPopup(false);
    setRankData(null);
    totalAnswerTimeRef.current = 0;
    const newPair = generateIntervalPair();
    setIntervalPair(newPair);
    setHighlightNote(newPair[0]);
    answerTimeStartRef.current = Date.now();
    playInterval(newPair);
  };

  const handleReplay = () => {
    if (intervalPair.length === 2) playInterval(intervalPair);
  };

  const handleCurrent = () => {
    if (highlightNote) {
      keyboardRef.current.playNote(highlightNote);
    }
  };


  const handleAnswer = (note) => {
    if (!isPlaying || intervalPair.length !== 2) return;
  
    keyboardRef.current.playNote(note);
    const updatedAnswers = [...answeredNotes, note];
    setAnsweredNotes(updatedAnswers);
  
    if (updatedAnswers.length === 2) {
      const elapsed = Date.now() - (answerTimeStartRef.current || Date.now());
      totalAnswerTimeRef.current += elapsed / 1000;
  
      const newTries = triesCount + 1;
      setTriesCount(newTries);
  
      const correct = intervalPair.every((n) => updatedAnswers.includes(n));
  
      if (correct) {
        keyboardRef.current.setFlashRight(intervalPair);
  
        let newCorrect = correctCount;
        if (!hasFailedThisRound) {
          newCorrect += 1;
          setCorrectCount(newCorrect);
        }
  
        setStatusMessage('✅ Correct!');
  
        if (currentRound + 1 >= rounds) {
          const rank = calculateIntervalPracticeRank({
            selectedNotes: baseNotes,
            selectedIntervals,
            correctCount: newCorrect,
            triesCount: newTries,
            rounds,
            totalAnswerTimeSec: totalAnswerTimeRef.current,
          });
  
          setRankData(rank);
          setShowPopup(true);
          setIsPlaying(false);
          setHighlightNote('');
  
          // ✅ LOG TO BACKEND ON GAME OVER
          const storedUser = JSON.parse(localStorage.getItem('user'));
const gmail = storedUser?.email || null; // or use context if preferred
          console.log("📡 Game over, logging with email:", gmail); // Debug log
          if (gmail && rounds >= 5) {
            logPracticeResult({
              gmail,
              practiceName: 'Interval Training',
              correct: newCorrect,
              wrong: wrongCount,
              tries: newTries,
              level: rank.level,
              rank: rank.score,
              maxRank: rank.max,
              rightScore: rank.rightScore,
              tryScore: rank.tryScore,
              speedScore: rank.speedScore,
              avgTimePerAnswer: rank.avgTimePerAnswer,
            });
          }
        } else {
          const newPair = generateIntervalPair();
          setTimeout(() => {
            setIntervalPair(newPair);
            setHighlightNote(newPair[0]);
            setAnsweredNotes([]);
            setCurrentRound((r) => r + 1);
            setHasFailedThisRound(false);
            setStatusMessage('');
            answerTimeStartRef.current = Date.now();
            playInterval(newPair);
          }, 900);
        }
      } else {
        keyboardRef.current.setFlashWrong(updatedAnswers);
        if (!hasFailedThisRound) {
          setWrongCount((w) => w + 1);
          setHasFailedThisRound(true);
        }
        setStatusMessage('❌ Wrong! Try again');
        setAnsweredNotes([]);
      }
    }
  };

  
  return (
    <div className="interval_practice-container">
      <nav className="interval_practice-navbar">
        <div className="interval_practice-navbar-left">
          <div className="interval_practice-logo">🎧 Interval Practice</div>
          <button className="interval_practice-btn" onClick={handleReplay}>🔁 Replay</button>
          <button className="interval_practice-btn" onClick={handleCurrent}>🎯 Current</button>
        </div>

        <div className="interval_practice-stats">
          <span className="interval_practice-stat total">{rounds}</span> /
          <span className="interval_practice-stat current">{currentRound + 1}</span> /
          <span className="interval_practice-stat correct">{correctCount}</span> /
          <span className="interval_practice-stat wrong">{wrongCount}</span> /
          <span className="interval_practice-stat tries">{triesCount}</span>
        </div>

        <button className="interval_practice-btn interval_practice-start-btn" onClick={startGame}>
          {isPlaying ? 'Restart' : 'Start'}
        </button>
      </nav>

      {statusMessage && (
        <div className="interval_practice-floating-message">{statusMessage}</div>
      )}

      <div className="interval_practice-fill-space" />

      <div className="interval_practice-bottom">
        <div className="interval_practice-keyboard">
          <IntervalPracticeKeyboardView
            ref={keyboardRef}
            onKeyClick={handleAnswer}
            octaves={[...new Set([...octaves, 3, 4, 5])]}
            highlightNotes={highlightNote ? [highlightNote] : []}
            highlightColor="blue"
          />
        </div>
      </div>

      {showPopup && rankData && (
        <div className="interval_practice-popup-overlay">
          <div className="interval_practice-popup">
            <h2>🎉 Practice Complete!</h2>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Attempts:</strong> {triesCount}</p>
            {rounds >= 5 ? (
              <>
                <p><strong>Level:</strong> {rankData.level}</p>
                <p><strong>Rank:</strong> {rankData.score} / {rankData.max}</p>
                <ul style={{ lineHeight: '1.6', listStyleType: 'none', paddingLeft: 0 }}>
                  <li>✅ Right/Wrong: <strong>{rankData.rightScore}</strong> / 75</li>
                  <li>🔁 Tries: <strong>{rankData.tryScore}</strong> / 15</li>
                  <li>⚡ Speed: <strong>{rankData.speedScore}</strong> / 10</li>
                </ul>
                <p><strong>Avg Time per Answer:</strong> {rankData.avgTimePerAnswer}s</p>
              </>
            ) : (
              <p><strong>Rank:</strong> Not calculated (minimum 5 rounds required)</p>
            )}
            <div className="interval_practice-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/interval-practice')}>⚙️ Settings</button>
              <button onClick={() => navigate('/profile')}>Back to Profile</button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
