import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MelodicDictationKeyboard from './MelodicDictationKeyboard';
import './MelodicDictationSettings.css';

const normalizeNote = (note) => {
  const enharmonics = {
    Db: 'Cs', Eb: 'Ds', Gb: 'Fs', Ab: 'Gs', Bb: 'As',
    'C#': 'Cs', 'D#': 'Ds', 'F#': 'Fs', 'G#': 'Gs', 'A#': 'As',
  };
  return enharmonics[note] || note;
};

const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

const displayNote = (note, key) => {
  const preferFlat = flatKeys.includes(key);
  const displayMapSharps = {
    Cs: 'C♯', Ds: 'D♯', Fs: 'F♯', Gs: 'G♯', As: 'A♯',
  };
  const displayMapFlats = {
    Cs: 'D♭', Ds: 'E♭', Fs: 'G♭', Gs: 'A♭', As: 'B♭',
  };
  const naturalNames = {
    C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B',
  };
  return naturalNames[note] || (preferFlat ? displayMapFlats[note] : displayMapSharps[note]) || note;
};

const notesByScale = {
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  D: ['D', 'E', 'Fs', 'G', 'A', 'B', 'Cs'],
  E: ['E', 'Fs', 'Gs', 'A', 'B', 'Cs', 'Ds'],
  F: ['F', 'G', 'A', 'As', 'C', 'D', 'E'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'Fs'],
  A: ['A', 'B', 'Cs', 'D', 'E', 'Fs', 'Gs'],
  B: ['B', 'Cs', 'Ds', 'E', 'Fs', 'Gs', 'As'],
};

const fullChromaticNotes = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];
const DEFAULT_DEGREES = [0, 1, 2, 3, 4, 5, 6];

export default function MelodicDictationSettings() {
  const [selectedScale, setSelectedScale] = useState('C');
  const [difficulty, setDifficulty] = useState('normal');
  const [selectedNotes, setSelectedNotes] = useState(getScaleDegrees('C', DEFAULT_DEGREES));
  const [outScaleNotes, setOutScaleNotes] = useState([]);
  const [rounds, setRounds] = useState(8);
  const [sequenceLength, setSequenceLength] = useState(4);
  const keyboardRef = useRef();
  const navigate = useNavigate();
  const tonic = selectedScale;

  function getScaleDegrees(scale, degreeIndices) {
    return degreeIndices.map((i) => notesByScale[scale][i]);
  }

  function getSelectedDegreeIndices(scale, selected) {
    return notesByScale[scale]
      .map((note, i) => (selected.includes(note) ? i : null))
      .filter((i) => i !== null);
  }

  const playNote3 = (note) => {
    const normalized = normalizeNote(note);
    keyboardRef.current?.playNote(`${normalized}3`);
  };

  const handleScaleChange = (newScale) => {
    const currentDegreeIndices = getSelectedDegreeIndices(selectedScale, selectedNotes);
    const newNotes = getScaleDegrees(newScale, currentDegreeIndices);
    setSelectedScale(newScale);
    setSelectedNotes(newNotes);
  };

  const toggleNote = (note) => {
    if (note === tonic) return;
    if (selectedNotes.includes(note)) {
      setSelectedNotes((prev) => prev.filter((n) => n !== note));
    } else {
      setSelectedNotes((prev) => [...prev, note]);
    }
    playNote3(note);
  };

  const toggleOutNote = (note) => {
    if (outScaleNotes.includes(note)) {
      setOutScaleNotes((prev) => prev.filter((n) => n !== note));
    } else {
      setOutScaleNotes((prev) => [...prev, note]);
    }
    playNote3(note);
  };

  const getOctavesByDifficulty = () => {
    if (difficulty === 'normal') return [4];
    if (difficulty === 'hard') return [3, 4];
    return [3, 4, 5];
  };

  const startPractice = () => {
    navigate('/melodic-dictation/play', {
      state: {
        selectedScale,
        selectedNotes: [...selectedNotes, ...outScaleNotes],
        rounds,
        sequenceLength,
        octaves: getOctavesByDifficulty(),
        difficulty,
      },
    });
  };

  const outNotesForScale = fullChromaticNotes.filter(n => !notesByScale[selectedScale].includes(n)).slice(0, 5);

  return (
    <div className="melodic_dictation_settings-container">
      <div className="melodic_dictation_settings-content-wrapper">
        <nav className="melodic_dictation_settings-navbar">
          <div className="melodic_dictation_settings-scale-note-wrapper">
            <div className="melodic_dictation_settings-dropdown">
              <button className="melodic_dictation_settings-dropbtn">🎼 Scale</button>
              <div className="melodic_dictation_settings-dropdown-content">
                {Object.keys(notesByScale).map((scale) => (
                  <label key={scale}>
                    <input
                      type="radio"
                      name="scale"
                      checked={selectedScale === scale}
                      onChange={() => handleScaleChange(scale)}
                    />
                    {scale} Major
                  </label>
                ))}
              </div>
            </div>

            <div className="melodic_dictation_settings-dropdown">
              <button className="melodic_dictation_settings-dropbtn">🎵 Notes</button>
              <div className="melodic_dictation_settings-dropdown-content">
                {notesByScale[selectedScale].map((note) => (
                  <label key={note}>
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note)}
                      disabled={note === tonic}
                      onChange={() => toggleNote(note)}
                    />
                    {displayNote(note, selectedScale)}
                  </label>
                ))}
              </div>
            </div>

            <div className="melodic_dictation_settings-dropdown">
              <button className="melodic_dictation_settings-dropbtn">🧩 Out-of-Scale</button>
              <div className="melodic_dictation_settings-dropdown-content">
                {outNotesForScale.map((note) => (
                  <label key={note}>
                    <input
                      type="checkbox"
                      checked={outScaleNotes.includes(note)}
                      onChange={() => toggleOutNote(note)}
                    />
                    {displayNote(note, selectedScale)}
                  </label>
                ))}
              </div>
            </div>

            <div className="melodic_dictation_settings-dropdown">
              <button className="melodic_dictation_settings-dropbtn">
              🪜 Difficulty: {difficulty === 'normal' ? 'Normal' : difficulty === 'hard' ? 'Hard' : 'Master'}
              </button>
              <div className="melodic_dictation_settings-dropdown-content">
                <label>
                  <input
                    type="radio"
                    name="difficulty"
                    value="normal"
                    checked={difficulty === 'normal'}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                  Normal (1 Octave)
                </label>
                <label>
                  <input
                    type="radio"
                    name="difficulty"
                    value="hard"
                    checked={difficulty === 'hard'}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                  Hard (2 Octaves)
                </label>
                <label>
                  <input
                    type="radio"
                    name="difficulty"
                    value="master"
                    checked={difficulty === 'master'}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                  Master (3 Octaves)
                </label>
              </div>
            </div>
          </div>

          <div className="melodic_dictation_settings-controls">
            <div className="melodic_dictation_settings-rounds-group">
              <label htmlFor="sequence-input" className="melodic_dictation_settings-rounds-label">Sequence Length:</label>
              <input
                id="sequence-input"
                type="number"
                min="1"
                max="10"
                value={sequenceLength}
                onChange={(e) => setSequenceLength(Number(e.target.value))}
                className="melodic_dictation_settings-rounds-input"
              />
            </div>

            <div className="melodic_dictation_settings-rounds-group">
              <label htmlFor="rounds-input" className="melodic_dictation_settings-rounds-label">Rounds:</label>
              <input
                id="rounds-input"
                type="number"
                min="1"
                max="50"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="melodic_dictation_settings-rounds-input"
              />
            </div>

            <button className="melodic_dictation_settings-start-btn" onClick={startPractice}>
              Start Practice
            </button>
          </div>
        </nav>

        <div className="melodic_dictation_settings-floating-setup-message">
          🎯 Set your scale, notes, rounds, and sequence — then click “Start Practice”!
        </div>

        <div className="melodic_dictation_settings-summary">
          <p><strong>{rounds}</strong> rounds | Scale: <strong>{selectedScale}</strong></p>
          <p>Notes: <strong>{[...selectedNotes, ...outScaleNotes].map(n => displayNote(n, selectedScale)).join(', ')}</strong></p>
          <p>Sequence Length: <strong>{sequenceLength}</strong></p>
          <p>Octaves: <strong>{getOctavesByDifficulty().join(', ')}</strong> ({difficulty})</p>
        </div>
      </div>

      <div className="melodic_dictation_settings-keyboard-wrapper">
        <MelodicDictationKeyboard
          ref={keyboardRef}
          highlightNotes={[...selectedNotes, ...outScaleNotes]}
          octaves={[3, 4, 5]}
        />
      </div>
    </div>
  );
}
