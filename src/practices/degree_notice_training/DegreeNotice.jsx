import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DegreeNotice.css';

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

const correctSound = new Audio('/wrong_right/correct.mp3');
const wrongSound = new Audio('/wrong_right/wrong.mp3');
const backgroundMusic = new Audio('/effects/background_music.mp3');
const pageTurnSound = new Audio('/effects/page_turn.mp3');

const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
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

  const [questionPool, setQuestionPool] = useState([]);
  const [modeSequence, setModeSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [triesCount, setTriesCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [question, setQuestion] = useState({});
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [flashCorrect, setFlashCorrect] = useState(false);
  const [flashWrong, setFlashWrong] = useState(false);
  const [wasWrongThisRound, setWasWrongThisRound] = useState(false);
  const [roundFlash, setRoundFlash] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    backgroundMusic.volume = 0.15;
    backgroundMusic.loop = true;
    if (!musicMuted) {
      backgroundMusic.play().catch(() => {});
    }
    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    };
  }, [musicMuted]);

  const generateQuestion = (scale, degree, mode) => {
    const degreeNum = degreeLabels.indexOf(degree);
    const noteAnswer = fullChordMap[scale][degreeNum];
    const correctAnswer = mode === 'scaleToDegree' ? degreeLabels[degreeNum] : noteAnswer;
    const questionPrompt = mode === 'scaleToDegree' ? displayNote(noteAnswer) : degree;

    const options = new Set([correctAnswer]);
    while (options.size < 4) {
      const randIdx = Math.floor(Math.random() * 7);
      const distractor = mode === 'scaleToDegree' ? degreeLabels[randIdx] : fullChordMap[scale][randIdx];
      options.add(distractor);
    }

    return {
      scale,
      degree,
      mode,
      correctAnswer,
      options: Array.from(options).sort(() => 0.5 - Math.random()),
      questionPrompt
    };
  };

  const startRound = (combo, mode) => {
    setFlashCorrect(false);
    setFlashWrong(false);
    setDisabledButtons([]);
    setWasWrongThisRound(false);
    setRoundFlash(true);
    setTimeout(() => setRoundFlash(false), 400);
    setFeedbackMessage('🎵 New round started!');

    pageTurnSound.currentTime = 0;
    pageTurnSound.play();

    const { scale, degree } = combo;
    setQuestion(generateQuestion(scale, degree, mode));
  };

  const initGame = () => {
    const comboSet = new Set();
    selectedScales.forEach(scale => {
      selectedDegrees.forEach(degree => {
        comboSet.add(`${scale}-${degree}`);
      });
    });

    const uniqueCombos = Array.from(comboSet).map(str => {
      const [scale, degree] = str.split('-');
      return { scale, degree };
    });

    let finalCombos = [];
    while (finalCombos.length < rounds) {
      const batch = shuffle(uniqueCombos);
      finalCombos.push(...batch);
    }
    finalCombos = finalCombos.slice(0, rounds);

    const modes = finalCombos.map(() => {
      if (questionStyles.scaleToDegree && questionStyles.scaleToNote) {
        return Math.random() < 0.5 ? 'scaleToDegree' : 'scaleToNote';
      } else {
        return questionStyles.scaleToDegree ? 'scaleToDegree' : 'scaleToNote';
      }
    });

    setQuestionPool(finalCombos);
    setModeSequence(modes);
    startRound(finalCombos[0], modes[0]);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleAnswer = (answer) => {
    setTriesCount(prev => prev + 1);

    if (answer === question.correctAnswer) {
      correctSound.currentTime = 0;
      correctSound.play();
      setFlashCorrect(true);

      if (!wasWrongThisRound) {
        setCorrectCount(prev => prev + 1);
        const encouragement = ['Nice!', 'Well done!', 'Great job!', '🎯 You nailed it!'];
        setFeedbackMessage(encouragement[Math.floor(Math.random() * encouragement.length)]);
      } else {
        setWrongCount(prev => prev + 1);
        setFeedbackMessage('Correct... after a few tries!');
      }

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      setTimeout(() => {
        if (nextIndex === rounds) {
          setShowPopup(true);
        } else {
          setFeedbackMessage('🎵 Next round!');
          startRound(questionPool[nextIndex], modeSequence[nextIndex]);
        }
      }, 600);
    } else {
      wrongSound.currentTime = 0;
      wrongSound.play();
      setWasWrongThisRound(true);
      setFlashWrong(true);
      setDisabledButtons(prev => [...prev, answer]);
      setFeedbackMessage('❌ Try again!');
      setTimeout(() => setFlashWrong(false), 400);
    }
  };

  return (
    <div className="degree-notice-container">
      <nav className="degree-notice-navbar">
        <div className="degree-notice-logo">Degree Notice</div>
        <button className="degree-notice-restart-btn" onClick={initGame}>🔁 Restart</button>
        <button
          className="degree-notice-mute-btn"
          onClick={() => {
            setMusicMuted(prev => !prev);
            if (!musicMuted) backgroundMusic.pause();
            else backgroundMusic.play().catch(() => {});
          }}
        >
          {musicMuted ? '🔇' : '🎙️'}
        </button>
        <div className="degree-notice-stats">
          <span className="degree-notice-stat current">Current: {currentIndex + 1}</span>
          <span className="degree-notice-stat correct">✔ {correctCount}</span>
          <span className="degree-notice-stat wrong">✖ {wrongCount}</span>
          <span className="degree-notice-stat tries">🔁 {triesCount}</span>
          <span className="degree-notice-stat total">Total: {rounds}</span>
        </div>
      </nav>

      {feedbackMessage && <div className="degree-notice-feedback-message">{feedbackMessage}</div>}

      <div className="degree-notice-question-area">
        <div className={`degree-notice-question-center ${roundFlash ? 'round-flash' : ''}`}>
          <div className="degree-notice-box-label">{displayNote(question.scale)}</div>
          <div className="degree-notice-divider" />
          <div className="degree-notice-box-question">{question.questionPrompt}</div>
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
