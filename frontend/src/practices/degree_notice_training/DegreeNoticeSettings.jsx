import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './DegreeNoticeSettings.css';

const allScales = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];
const allDegrees = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

const displayNote = (note) => {
  const map = {
    'C#': 'C♯', 'D#': 'D♯', 'F#': 'F♯', 'G#': 'G♯', 'A#': 'A♯',
    'Db': 'D♭', 'Eb': 'E♭', 'Gb': 'G♭', 'Ab': 'A♭', 'Bb': 'B♭',
    'Cb': 'C♭',
  };
  return map[note] || note;
};

const scaleDegreeNoteMap = {
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
  Gb: ['Gb', 'Abm', 'Bbm', 'Cb', 'Db', 'Ebm', 'Fdim'],
};

const degreeIndex = {
  I: 0,
  II: 1,
  III: 2,
  IV: 3,
  V: 4,
  VI: 5,
  VII: 6,
};

const whooshSound = new Audio('/effects/swing-whoosh.mp3');
whooshSound.volume = 0.5;

export default function DegreeNoticeSettings() {
  const navigate = useNavigate();
  const [selectedScales, setSelectedScales] = useState(['C']);
  const [selectedDegrees, setSelectedDegrees] = useState(['II', 'III', 'IV', 'V', 'VI', 'VII']);
  const [rounds, setRounds] = useState(10);
  const [scaleToDegree, setScaleToDegree] = useState(true);
  const [scaleToNote, setScaleToNote] = useState(false);

  const toggleScale = (scale) => {
    setSelectedScales((prev) => {
      const isAdding = !prev.includes(scale);
      const updated = isAdding ? [...prev, scale] : prev.filter((s) => s !== scale);
      if (isAdding) {
        whooshSound.currentTime = 0;
        whooshSound.play();
      }
      return updated;
    });
  };

  const toggleDegree = (degree) => {
    setSelectedDegrees((prev) => {
      const isAdding = !prev.includes(degree);
      const updated = isAdding ? [...prev, degree] : prev.filter((d) => d !== degree);
      if (isAdding) {
        whooshSound.currentTime = 0;
        whooshSound.play();
      }
      return updated;
    });
  };

  const toggleMode = (mode) => {
    if (mode === 'scaleToDegree') {
      if (scaleToDegree && !scaleToNote) return;
      setScaleToDegree(!scaleToDegree);
    } else {
      if (scaleToNote && !scaleToDegree) return;
      setScaleToNote(!scaleToNote);
    }
    whooshSound.currentTime = 0;
    whooshSound.play();
  };

  const level = Math.min(12, Math.max(1, selectedScales.length));

  const startPractice = () => {
    navigate('/degree-notice/play', {
      state: {
        selectedScales,
        selectedDegrees,
        questionStyles: {
          scaleToDegree,
          scaleToNote,
        },
        rounds,
      },
    });
  };

  return (
    <div className="degree_notice_settings-container">
      <div className="degree_notice_settings-navbar">
        <div className="degree_notice_settings-dropdown">
          <button className="degree_notice_settings-dropbtn">🎼 Scales</button>
          <div className="degree_notice_settings-dropdown-content">
            {allScales.map((scale) => (
              <label key={scale}>
                <input
                  type="checkbox"
                  checked={selectedScales.includes(scale)}
                  onChange={() => toggleScale(scale)}
                />{' '}
                {displayNote(scale)} Major
              </label>
            ))}
          </div>
        </div>

        <div className="degree_notice_settings-dropdown">
          <button className="degree_notice_settings-dropbtn">🎯 Degrees</button>
          <div className="degree_notice_settings-dropdown-content">
            {allDegrees.map((deg) => (
              <label key={deg}>
                <input
                  type="checkbox"
                  checked={selectedDegrees.includes(deg)}
                  onChange={() => toggleDegree(deg)}
                />{' '}
                {deg}
              </label>
            ))}
          </div>
        </div>

        <div className="degree_notice_settings-dropdown">
          <button className="degree_notice_settings-dropbtn">❓ Mode</button>
          <div className="degree_notice_settings-dropdown-content">
            <label>
              <input
                type="checkbox"
                checked={scaleToDegree}
                onChange={() => toggleMode('scaleToDegree')}
              />{' '}
              Scale → Degree
            </label>
            <label>
              <input
                type="checkbox"
                checked={scaleToNote}
                onChange={() => toggleMode('scaleToNote')}
              />{' '}
              Scale → Roman Numeral
            </label>
          </div>
        </div>

        <Link to="/instructions/degree-notice" className="degree_notice_settings-instruction-link">
          📘 Instructions
        </Link>

        <div className="degree_notice_settings-rounds-group">
          <label className="degree_notice_settings-rounds-label">Rounds:</label>
          <input
            type="number"
            min="1"
            max="40"
            value={rounds}
            onChange={(e) => setRounds(Math.min(40, Number(e.target.value)))}
            className="degree_notice_settings-rounds-input"
          />
        </div>

        <button
          className="degree_notice_settings-start-btn"
          onClick={startPractice}
          disabled={
            selectedScales.length === 0 ||
            selectedDegrees.length === 0 ||
            (!scaleToDegree && !scaleToNote)
          }
        >
          Start Practice
        </button>
      </div>

      <div className="degree_notice_settings-instructions">
        <p>✅ Select one or more <strong>scales</strong> from the dropdown.</p>
        <p>✅ Choose the <strong>degrees</strong> you want to be tested on.</p>
        <p>✅ Pick your preferred <strong>mode</strong>: identify the degree (I, IV, V) or the actual chord (C, Dm, etc.).</p>
        <p>🎵 Click <strong>Start Practice</strong> when you're ready!</p>
      </div>

      <div className="degree_notice_settings-bottom-section">
        <div className="degree_notice_settings-summary">
          <p>
            <strong>{rounds}</strong> rounds | Scales:{' '}
            <strong>{selectedScales.map(displayNote).join(', ')}</strong>
          </p>
          <p>
            Degrees: <strong>{selectedDegrees.join(', ')}</strong>
          </p>
          <p>
            Mode:{' '}
            <strong>
              {scaleToDegree ? 'Scale → Degree' : ''}
              {scaleToDegree && scaleToNote ? ' & ' : ''}
              {scaleToNote ? 'Scale → Roman Numeral' : ''}
            </strong>
          </p>
          <p>
            Level: <strong>{level}</strong> (based on selected scales)
          </p>
        </div>

        <div className="degree_notice_settings-grid">
          {selectedScales.map((scale) => (
            <div key={scale} className="degree_notice_settings-scale-box">
              <strong>{displayNote(scale)} Major</strong>:&nbsp;
              {selectedDegrees.map((deg, i) => {
                const note = scaleDegreeNoteMap[scale]?.[degreeIndex[deg]];
                return (
                  <span key={i} style={{ marginRight: '8px', display: 'inline-block' }}>
                    <span className="degree_notice_settings-degree-badge">{deg}</span>
                    (<span>{note ? displayNote(note) : '?'}</span>)
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
