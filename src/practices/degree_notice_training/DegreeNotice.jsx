import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DegreeNotice.css';

const fullNoteMap = {
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  D: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  A: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  E: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  B: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  Bb: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  Eb: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  Ab: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  Db: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  Gb: ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F']
};

const fullChordMap = {
  C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
  G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
  D: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
  A: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
  E: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
  B: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
  F: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
  Bb: ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'],
  Eb: ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'Ddim'],
  Ab: ['Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm', 'Gdim'],
  Db: ['Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm', 'Cdim'],
  Gb: ['Gb', 'Abm', 'Bbm', 'Cb', 'Db', 'Ebm', 'Fdim']
};

const degreeLabels = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

const displayNote = (note) => {
  const map = {
    'C#': 'C♯', 'D#': 'D♯', 'F#': 'F♯', 'G#': 'G♯', 'A#': 'A♯',
    'Db': 'D♭', 'Eb': 'E♭', 'Gb': 'G♭', 'Ab': 'A♭', 'Bb': 'B♭',
    'Cb': 'C♭'
  };
  return map[note] || note;
};

export default function DegreeNotice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    selectedScales = [],
    selectedDegrees = [],
    questionStyles = {},
    rounds = 10,
  } = state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [question, setQuestion] = useState({});
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [flashCorrect, setFlashCorrect] = useState(false);
  const [flashWrong, setFlashWrong] = useState(false);

  const generateQuestion = () => {
    const scale = selectedScales[Math.floor(Math.random() * selectedScales.length)];
    const degreeIdx = Math.floor(Math.random() * selectedDegrees.length);
    const degree = selectedDegrees[degreeIdx];
    const degreeNum = degreeLabels.indexOf(degree);

    const isDegreeQuestion = questionStyles.scaleToDegree && questionStyles.scaleToNote
      ? Math.random() < 0.5
      : questionStyles.scaleToDegree;

    const noteAnswer = fullChordMap[scale][degreeNum];
    const degreeAnswer = degreeLabels[degreeNum];

    const correctAnswer = isDegreeQuestion ? degreeAnswer : noteAnswer;
    const questionPrompt = isDegreeQuestion ? displayNote(noteAnswer) : degree;

    const options = new Set([correctAnswer]);
    while (options.size < 4) {
      const randIdx = Math.floor(Math.random() * 7);
      const choice = isDegreeQuestion ? degreeLabels[randIdx] : fullChordMap[scale][randIdx];
      options.add(choice);
    }

    return {
      scale,
      degree,
      mode: isDegreeQuestion ? 'scaleToDegree' : 'scaleToNote',
      correctAnswer,
      options: Array.from(options).sort(() => 0.5 - Math.random()),
      questionPrompt
    };
  };

  const startRound = () => {
    setFlashCorrect(false);
    setFlashWrong(false);
    setDisabledButtons([]);
    setQuestion(generateQuestion());
  };

  const handleAnswer = (answer) => {
    setTriesCount(prev => prev + 1);
    if (answer === question.correctAnswer) {
      setCorrectCount(prev => prev + 1);
      setFlashCorrect(true);
      setTimeout(() => {
        if (currentIndex + 1 === rounds) {
          setShowPopup(true);
        } else {
          setCurrentIndex(i => i + 1);
          startRound();
        }
      }, 600);
    } else {
      setFlashWrong(true);
      setWrongCount(prev => prev + 1);
      setDisabledButtons(prev => [...prev, answer]);
      setTimeout(() => setFlashWrong(false), 400);
    }
  };

  useEffect(() => {
    startRound();
  }, []);

  return (
    <div className="degree-notice-container">
      <nav className="degree-notice-navbar">
        <div className="degree-notice-logo">Degree Notice</div>
        <div className="degree-notice-stats">
          <span>Total: {rounds}</span>
          <span>Current: {currentIndex + 1}</span>
          <span>✔ {correctCount}</span>
          <span>✖ {wrongCount}</span>
          <span>🔁 {triesCount}</span>
        </div>
      </nav>

      <div className="degree-notice-question-area">
        <div className="degree-notice-scale-label">
          {displayNote(question.scale)}
        </div>
        <div className="degree-notice-question-box">
          {question.questionPrompt}
        </div>

        <div className="degree-notice-options">
          {question.options?.map((opt) => (
            <button
              key={opt}
              className={`degree-notice-option-btn ${
                flashCorrect && opt === question.correctAnswer ? 'btn-flash-correct' : ''
              } ${
                flashWrong && disabledButtons.includes(opt) ? 'btn-flash-wrong' : ''
              }`}
              disabled={disabledButtons.includes(opt)}
              onClick={() => handleAnswer(opt)}
            >
              {question.mode === 'scaleToNote' ? displayNote(opt) : opt}
            </button>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className="degree-notice-popup-overlay">
          <div className="degree-notice-popup">
            <h2>🎉 Practice Complete!</h2>
            <p><strong>Rounds:</strong> {rounds}</p>
            <p><strong>Correct:</strong> {correctCount}</p>
            <p><strong>Wrong:</strong> {wrongCount}</p>
            <p><strong>Total Attempts:</strong> {triesCount}</p>
            <div className="degree-notice-popup-buttons">
              <button onClick={() => window.location.reload()}>🔁 Restart</button>
              <button onClick={() => navigate('/degree-notice')}>⚙️ Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
