import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { melodies } from './melodies';
import './ChordsForMelodyPractice.css';

const availableChords = ["C", "Dm", "Em", "F", "G", "Am", "Bdim"];
const BAR_DURATION = 2000; // Each bar is 2000ms

// 🔥 Chord mappings: 1-3-5 notes
const chordNoteMap = {
  C: ['C3', 'E3', 'G3'],
  Dm: ['D3', 'F3', 'A3'],
  Em: ['E3', 'G3', 'B3'],
  F: ['F3', 'A3', 'C4'],
  G: ['G3', 'B3', 'D4'],
  Am: ['A3', 'C4', 'E4'],
  Bdim: ['B3', 'D4', 'F4'],
};

const ChordsForMelodyPractice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedMelodyName = state?.selectedMelody;

  const melody = melodies[selectedMelodyName] || [];
  const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
  const totalBars = Math.ceil(totalDuration / BAR_DURATION);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [slots, setSlots] = useState(() =>
    Array.from({ length: totalBars }, () => ({ parts: [{ chord: '', duration: BAR_DURATION }] }))
  );
  const intervalRef = useRef(null);
  const melodyTimeoutsRef = useRef([]);
  const chordTimeoutsRef = useRef([]);

  useEffect(() => {
    if (isPlaying) {
      startMelodyPlayback();
    } else {
      stopMelodyPlayback();
    }
    return () => stopMelodyPlayback();
  }, [isPlaying]);

  const normalizeNoteName = (note) => note.replace('#', 's');

  const playNote = (noteName) => {
    const normalized = normalizeNoteName(noteName);
    const audio = new Audio(`/clean_cut_notes/${normalized}.wav`);
    audio.volume = 1.0; // Melody full volume
    audio.play();
  };

  const playChord = (chordName) => {
    if (!chordName) return;
    const notes = chordNoteMap[chordName];
    if (!notes) return;
    notes.forEach((note) => {
      const normalized = normalizeNoteName(note);
      const audio = new Audio(`/clean_cut_notes/${normalized}.wav`);
      audio.volume = 0.7; // Chord softer
      audio.play();
    });
  };

  const startMelodyPlayback = () => {
    let elapsed = 0;
    melodyTimeoutsRef.current = [];
    chordTimeoutsRef.current = [];

    melody.forEach((noteObj) => {
      const timeout = setTimeout(() => {
        playNote(noteObj.note);
      }, elapsed);
      melodyTimeoutsRef.current.push(timeout);
      elapsed += noteObj.duration;
    });

    let chordTime = 0;
    slots.forEach((slot) => {
      slot.parts.forEach((part) => {
        const timeout = setTimeout(() => {
          if (part.chord) {
            playChord(part.chord);
          }
        }, chordTime);
        chordTimeoutsRef.current.push(timeout);
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
    melodyTimeoutsRef.current = [];
    chordTimeoutsRef.current = [];
    clearInterval(intervalRef.current);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleDrop = (slotIndex, partIndex, chord) => {
    const updatedSlots = [...slots];
    updatedSlots[slotIndex].parts[partIndex].chord = chord;
    setSlots(updatedSlots);
  };

  const handleDragStart = (e, chord) => {
    e.dataTransfer.setData('chord', chord);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSlotDrop = (e, slotIndex, partIndex) => {
    e.preventDefault();
    const chord = e.dataTransfer.getData('chord');
    handleDrop(slotIndex, partIndex, chord);
  };

  const handleCutSlot = (slotIndex) => {
    const updatedSlots = [...slots];
    const slot = updatedSlots[slotIndex];
    if (slot.parts.length === 1 && slot.parts[0].duration === BAR_DURATION) {
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
    if (
      slot.parts.length === 2 &&
      slot.parts[0].duration === BAR_DURATION / 2 &&
      slot.parts[1].duration === BAR_DURATION / 2
    ) {
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
    setCurrentTime(percentage * totalDuration);
  };

  if (!selectedMelodyName) {
    return (
      <div className="chords_for_melody_practice_container">
        <h2>No melody selected. Please go back to settings.</h2>
        <button onClick={() => navigate('/chords-for-melody/settings')}>Back to Settings</button>
      </div>
    );
  }

  const activeSlot = getActiveSlot();

  return (
    <div className="chords_for_melody_practice_container">
      <div className="chords_for_melody_practice_controls">
        <button
          className="chords_for_melody_practice_play_pause"
          onClick={handlePlayPause}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="chords_for_melody_practice_progress_bar"
        onClick={handleProgressClick}
      >
        <div
          className="chords_for_melody_practice_progress_fill"
          style={{ width: `${(currentTime / totalDuration) * 100}%` }}
        >
          <div className="chords_for_melody_practice_progress_dot"></div>
        </div>
      </div>

      {/* Slots */}
      <div className="chords_for_melody_practice_slots">
        {slots.map((slot, slotIndex) => (
          <div key={slotIndex} className="chords_for_melody_practice_slot_group">
            {slot.parts.map((part, partIndex) => {
              const isActive =
                activeSlot?.slotIndex === slotIndex && activeSlot?.partIndex === partIndex;
              return (
                <div
                  key={partIndex}
                  className={`chords_for_melody_practice_slot ${part.duration === 1000 ? 'half' : ''} ${
                    isActive ? 'active' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleSlotDrop(e, slotIndex, partIndex)}
                >
                  {part.chord || ''}
                </div>
              );
            })}
            {slot.parts.length === 1 ? (
              <button
                className="chords_for_melody_practice_cut_button"
                onClick={() => handleCutSlot(slotIndex)}
              >
                ✂️
              </button>
            ) : (
              <button
                className="chords_for_melody_practice_merge_button"
                onClick={() => handleMergeSlot(slotIndex)}
              >
                🔗
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Chords */}
      <div className="chords_for_melody_practice_chord_line">
        {availableChords.map((chord, idx) => (
          <div
            key={idx}
            className="chords_for_melody_practice_chord"
            draggable
            onDragStart={(e) => handleDragStart(e, chord)}
          >
            {chord}
          </div>
        ))}
      </div>

      <div className="chords_for_melody_practice_keyboard_placeholder">
        <p>Keyboard coming soon...</p>
      </div>
    </div>
  );
};

export default ChordsForMelodyPractice;
