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
  F: ['F3', 'A3', 'C4'], // Adjusted C3 to C4 for consistency
  G: ['G3', 'B3', 'D4'], // Adjusted D3 to D4 for consistency
  Am: ['A3', 'C4', 'E4'], // Adjusted C3, E3 to C4, E4 for consistency
  Bdim: ['B3', 'D4', 'F4'], // Adjusted D3, F3 to D4, F4 for consistency
  D: ['D3', 'F#3', 'A3'], // Added for playfulMelody
  E: ['E3', 'G#3', 'B3'], // Added for sadInThree
};

const ChordsForMelodyPractice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedMelodyName = state?.selectedMelody;
  const keyboardRef = useRef();

  const melodyData = melodies[selectedMelodyName] || {};
  const { notes = [], tempo = 90, timeSignature = [4, 4], chords = ['C', 'F', 'G'] } = melodyData;

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
      parts: [{ chord: '', duration: BAR_DURATION }],
    }))
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
    audio.volume = 1.0;
    audio.play().catch((error) => console.error(`Error playing note ${normalized}:`, error));
  };

  const playChord = (chordName) => {
    const notes = chordNoteMap[chordName];
    if (!notes) return;
    notes.forEach((note) => {
      const normalized = normalizeNoteName(note);
      const audio = new Audio(`/clean_cut_notes/${normalized}.wav`);
      audio.volume = 0.7;
      audio.play().catch((error) => console.error(`Error playing chord note ${normalized}:`, error));
    });
    keyboardRef.current?.setFlashRight(notes);
  };

  const startMelodyPlayback = () => {
    let elapsed = 0;
    melodyTimeoutsRef.current = [];
    chordTimeoutsRef.current = [];

    notes.forEach((noteObj) => {
      const msDuration = noteObj.duration * beatDurationMs;
      const timeout = setTimeout(() => {
        playNote(noteObj.note || noteObj.harmonynote);
      }, elapsed);
      melodyTimeoutsRef.current.push(timeout);
      elapsed += msDuration;
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
      <div className="chords_for_melody_practice_containerغه:1px solid #000; padding:10px;">
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
        <button
          className="chords_for_melody_practice_play_pause"
          onClick={handlePlayPause}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <div className="chords_for_melody_practice_tempo">
          Tempo: {tempo} BPM | Time Signature: {beatsPerBar}/4
        </div>
      </div>

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

      <div className="chords_for_melody_practice_slots">
        {slots.map((slot, slotIndex) => (
          <div key={slotIndex} className="chords_for_melody_practice_slot_group">
            {slot.parts.map((part, partIndex) => {
              const isActive =
                activeSlot?.slotIndex === slotIndex &&
                activeSlot?.partIndex === partIndex;
              return (
                <div
                  key={partIndex}
                  className={`chords_for_melody_practice_slot ${
                    part.duration === BAR_DURATION / 2 ? 'half' : ''
                  } ${isActive ? 'active' : ''}`}
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

      <div className="chords_for_melody_practice_chord_line">
        {chords.map((chord, idx) => (
          <div
            key={idx}
            className="chords_for_melody_practice_chord"
            draggable
            onClick={() => playChord(chord)}
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