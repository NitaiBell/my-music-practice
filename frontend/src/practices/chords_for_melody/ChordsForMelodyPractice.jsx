import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { melodies } from './melodies';
import './ChordsForMelodyPractice.css';
import ChordsForMelodyKeyboardView from './ChordsForMelodyKeyboardView';
import './ChordsForMelodyKeyboardView.css';

const chordNoteMap = {
  C: ['C3', 'E3', 'G3'],
  Dm: ['D3', 'F3', 'A3'],
  Em: ['E3', 'G3', 'B3'],
  F: ['F3', 'A3', 'C4'],
  G: ['G3', 'B3', 'D4'],
  Am: ['A3', 'C4', 'E4'],
  Bdim: ['B3', 'D4', 'F4'],
  D: ['D3', 'F#3', 'A3'],
  E: ['E3', 'G#3', 'B3'],
};

const ChordsForMelodyPractice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedMelodyName = state?.selectedMelody;
  const keyboardRef = useRef();
  const [selectedChord, setSelectedChord] = useState(null);

  const melodyData = melodies[selectedMelodyName] || {};
  const {
    name = '',
    notes = [],
    tempo = 90,
    timeSignature = [4, 4],
    chords = ['C', 'F', 'G'],
    suggestedChords = [],
  } = melodyData;

  const beatsPerBar = timeSignature?.[0] || 4;
  const beatDurationMs = 60000 / tempo;
  const BAR_DURATION = beatsPerBar * beatDurationMs;

  const totalDuration = notes.reduce(
    (sum, note) => sum + note.duration * beatDurationMs,
    0
  );
  const totalBars = Math.ceil(totalDuration / BAR_DURATION);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [slots, setSlots] = useState(() =>
    Array.from({ length: totalBars }, () => ({
      parts: [
        {
          chord: '',
          duration: BAR_DURATION,
        },
      ],
    }))
  );
  const [showSuggested, setShowSuggested] = useState(false);

  const intervalRef = useRef(null);
  const melodyTimeoutsRef = useRef([]);
  const chordTimeoutsRef = useRef([]);

  useEffect(() => {
    if (isPlaying) {
      startMelodyPlayback(currentTime);
    } else {
      stopMelodyPlayback();
    }
    return () => stopMelodyPlayback();
  }, [isPlaying]);

  const normalizeNoteName = (note) => note.replace('#', 's');

  const playNote = (noteName) => {
    const normalized = normalizeNoteName(noteName);
    const audio = new Audio(`/clean_cut_notes/${normalized}.wav`);
    audio.volume = 1.0;
    audio.play().catch(console.error);
  };

  const playChord = (chordName) => {
    const notes = chordNoteMap[chordName];
    if (!notes) return;
    notes.forEach((note) => {
      const normalized = normalizeNoteName(note);
      const audio = new Audio(`/clean_cut_notes/${normalized}.wav`);
      audio.volume = 0.7;
      audio.play().catch(console.error);
    });
    keyboardRef.current?.setFlashRight(notes);
  };

  const startMelodyPlayback = (startTime = 0) => {
    let elapsed = 0;
    melodyTimeoutsRef.current = [];
    chordTimeoutsRef.current = [];

    notes.forEach((noteObj) => {
      const msDuration = noteObj.duration * beatDurationMs;
      if (elapsed + msDuration > startTime) {
        const delay = Math.max(0, elapsed - startTime);
        const timeout = setTimeout(() => playNote(noteObj.note || noteObj.harmonynote), delay);
        melodyTimeoutsRef.current.push(timeout);
      }
      elapsed += msDuration;
    });

    let chordTime = 0;
    slots.forEach((slot) => {
      slot.parts.forEach((part) => {
        if (chordTime + part.duration > startTime) {
          const delay = Math.max(0, chordTime - startTime);
          const timeout = setTimeout(() => {
            if (part.chord) playChord(part.chord);
          }, delay);
          chordTimeoutsRef.current.push(timeout);
        }
        chordTime += part.duration;
      });
    });

    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 50;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });
    }, 50);
  };

  const stopMelodyPlayback = () => {
    melodyTimeoutsRef.current.forEach(clearTimeout);
    chordTimeoutsRef.current.forEach(clearTimeout);
    clearInterval(intervalRef.current);
  };

  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleDrop = (slotIndex, partIndex, chord) => {
    const updatedSlots = [...slots];
    updatedSlots[slotIndex].parts[partIndex].chord = chord;
    setSlots(updatedSlots);
    setSelectedChord(null);
  };

  const handleDragStart = (e, chord) => e.dataTransfer.setData('chord', chord);
  const handleDragOver = (e) => e.preventDefault();
  const handleSlotDrop = (e, slotIndex, partIndex) => {
    e.preventDefault();
    const chord = e.dataTransfer.getData('chord');
    handleDrop(slotIndex, partIndex, chord);
  };

  const handleCutSlot = (slotIndex) => {
    const updatedSlots = [...slots];
    const slot = updatedSlots[slotIndex];
    if (slot.parts.length === 1) {
      slot.parts = [
        { chord: '', duration: BAR_DURATION / 2 },
        { chord: '', duration: BAR_DURATION / 2 },
      ];
      setSlots(updatedSlots);
    }
  };

  const handleMergeSlot = (slotIndex) => {
    const updatedSlots = [...slots];
    const slot = updatedSlots[slotIndex];
    if (slot.parts.length === 2) {
      slot.parts = [{ chord: '', duration: BAR_DURATION }];
      setSlots(updatedSlots);
    }
  };

  const getActiveSlot = () => {
    let elapsed = 0;
    for (let i = 0; i < slots.length; i++) {
      for (let j = 0; j < slots[i].parts.length; j++) {
        const part = slots[i].parts[j];
        if (currentTime >= elapsed && currentTime < elapsed + part.duration) {
          return { slotIndex: i, partIndex: j };
        }
        elapsed += part.duration;
      }
    }
    return null;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    stopMelodyPlayback();
    setCurrentTime(percentage * totalDuration);
  };

  if (!selectedMelodyName) {
    return (
      <div className="chords_for_melody_practice_container">
        <h2>No melody selected. Please go back to settings.</h2>
        <button onClick={() => navigate('/chords-for-melody/settings')}>
          Back to Settings
        </button>
      </div>
    );
  }

  const activeSlot = getActiveSlot();

  return (
    <div className="chords_for_melody_practice_container">
      <div className="chords_for_melody_practice_controls">
        <div className="chords_for_melody_practice_info">
          <strong>{name}</strong> | Tempo: {tempo} BPM | Time: {beatsPerBar}/4
        </div>
        <button onClick={handlePlayPause}>{isPlaying ? '⏸️ Pause' : '▶️ Play'}</button>
        <button onClick={() => setShowSuggested((s) => !s)}>🎯 Suggested</button>
      </div>

      {showSuggested && (
        <div className="chords_for_melody_practice_suggested">
          Suggested: {suggestedChords.join(' | ')}
        </div>
      )}

      <div className="chords_for_melody_practice_progress_bar" onClick={handleProgressClick}>
        <div className="chords_for_melody_practice_progress_fill" style={{ width: `${(currentTime / totalDuration) * 100}%` }}>
          <div className="chords_for_melody_practice_progress_dot"></div>
        </div>
      </div>

      <div className="chords_for_melody_practice_slots">
        {slots.map((slot, slotIndex) => (
          <div key={slotIndex} className="chords_for_melody_practice_slot_group">
            {slot.parts.map((part, partIndex) => {
              const isActive = activeSlot?.slotIndex === slotIndex && activeSlot?.partIndex === partIndex;
              return (
                <div
                  key={partIndex}
                  className={`chords_for_melody_practice_slot ${part.duration === BAR_DURATION / 2 ? 'half' : ''} ${isActive ? 'active' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleSlotDrop(e, slotIndex, partIndex)}
                  onClick={() => {
                    if (selectedChord) handleDrop(slotIndex, partIndex, selectedChord);
                  }}
                >
                  {part.chord || ''}
                </div>
              );
            })}
            {slot.parts.length === 1 ? (
              <button onClick={() => handleCutSlot(slotIndex)}>✂️</button>
            ) : (
              <button onClick={() => handleMergeSlot(slotIndex)}>🔗</button>
            )}
          </div>
        ))}
      </div>

      <div className="chords_for_melody_practice_chord_line">
      {chords.map((chord, idx) => (
  <div
    key={idx}
    className={`chords_for_melody_practice_chord ${selectedChord === chord ? 'selected' : ''}`}
    draggable
    onClick={() => {
      setSelectedChord(chord);
      playChord(chord); // 🔊 Play chord when clicked
    }}
    onDragStart={(e) => handleDragStart(e, chord)}
  >
    {chord}
  </div>
))}
      </div>

      <div className="chords_for_melody_practice_bottom">
        <ChordsForMelodyKeyboardView ref={keyboardRef} />
      </div>
    </div>
  );
};

export default ChordsForMelodyPractice;
