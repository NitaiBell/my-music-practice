import React from "react";
import "./PlayNote.css";

const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

const chords = [
  { name: "C", notes: ["C3", "E3", "G3", "C4", "E4", "G4"] },
  { name: "Dm", notes: ["D3", "F3", "A3", "D4", "F4", "A4"] },
  { name: "Em", notes: ["E3", "G3", "B3", "E4", "G4", "B4"] },
  { name: "F", notes: ["F3", "A3", "C4", "F4", "A4", "C5"] },
  { name: "G", notes: ["G2", "B3", "D4", "G4", "B4", "D5"] },
  { name: "Am", notes: ["A3", "C3", "E4", "A4", "C5", "E4"] },
  { name: "Bm", notes: ["B3", "D4", "F4", "B4", "D5", "F5"] },
];

const PlayNote = () => {
  const playNote = async (note, duration = 2000, ctx = null) => {
    const audioContext = ctx || new (window.AudioContext || window.webkitAudioContext)();

    const response = await fetch(`/clean_cut_notes/${note}.wav`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = audioContext.createGain();
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;
    const fadeStart = now + duration / 1000 - 0.5;

    gainNode.gain.setValueAtTime(1, now);
    gainNode.gain.linearRampToValueAtTime(0, fadeStart + 0.5);

    source.start(now);
    source.stop(now + duration / 1000);
  };

  const playChord = async (chordNotes) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await Promise.all(chordNotes.map((note) => playNote(note, 2000, audioContext)));
  };

  return (
    <div className="playnote-container">
      <h2 className="playnote-title">🎹 Click a note to play</h2>

      <div className="note-buttons">
        {notes.map((note) => (
          <button
            key={note}
            className="note-button"
            onClick={() => playNote(note)}
          >
            {note}
          </button>
        ))}
      </div>

      <h2 className="playnote-title" style={{ marginTop: "3rem" }}>
        🎶 Click a chord to play
      </h2>

      <div className="note-buttons">
        {chords.map((chord) => (
          <button
            key={chord.name}
            className="note-button"
            onClick={() => playChord(chord.notes)}
          >
            {chord.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayNote;
