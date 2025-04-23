import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './IntervalPractice.css';
import IntervalPracticeKeyboardView from "./IntervalPracticeKeyboardView";

export default function IntervalPractice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const keyboardRef = useRef();

  const {
    selectedIntervals = [],
    baseNotes = [],
    rounds = 10,
    octaves = [3, 4],
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
    const min = noteToMidi(`${baseNotes[0] || 'C'}${Math.min(...octaves)}`);
    const max = noteToMidi(`${baseNotes[baseNotes.length - 1] || 'B'}${Math.max(...octaves)}`);
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
    const newPair = generateIntervalPair();
    setIntervalPair(newPair);
    setHighlightNote(newPair[0]);
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
      setTriesCount((t) => t + 1);
      const correct = intervalPair.every((n) => updatedAnswers.includes(n));

      if (correct) {
        keyboardRef.current.setFlashRight(intervalPair);
        if (!hasFailedThisRound) setCorrectCount((c) => c + 1);
        setStatusMessage('✅ Correct!');

        if (currentRound + 1 >= rounds) {
          setShowPopup(true);
          setIsPlaying(false);
          setHighlightNote('');
        } else {
          const newPair = generateIntervalPair();
          setTimeout(() => {
            setIntervalPair(newPair);
            setHighlightNote(newPair[0]);
            setAnsweredNotes([]);
            setCurrentRound((r) => r + 1);
            setHasFailedThisRound(false);
            setStatusMessage('');
            playInterval(newPair);
          }, 900);
        }
      } else {
        keyboardRef.current.setFlashWrong(updatedAnswers);
        setWrongCount((w) => w + 1);
        setStatusMessage('❌ Wrong! Try again');
        setHasFailedThisRound(true);
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

      {showPopup && (
        <div className="interval_practice-popup-overlay">
          <div className="interval_practice-popup">
            <h2>🎉 Practice Complete!</h2>
            <p><strong>Rounds:</strong> {rounds}</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Attempts:</strong> {triesCount}</p>
            <div className="interval_practice-popup-buttons">
              <button onClick={startGame}>🔁 Restart</button>
              <button onClick={() => navigate('/interval-practice')}>⚙️ Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
