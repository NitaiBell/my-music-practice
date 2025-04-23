import React, { useRef, useState } from 'react';
import { PitchDetector } from 'pitchy'; // ✅ Correct for v4
import './SingNote.css';

export default function NoteRecognizer() {
  const [note, setNote] = useState('');
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const detectorRef = useRef(null);
  const bufferLength = 2048;
  const buffer = new Float32Array(bufferLength);

  const noteNames = [
    'C', 'C#', 'D', 'D#', 'E', 'F',
    'F#', 'G', 'G#', 'A', 'A#', 'B'
  ];

  const getNoteName = (frequency) => {
    const A4 = 440;
    const semitone = 12 * Math.log2(frequency / A4);
    const midi = Math.round(semitone + 69);
    const name = noteNames[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${name}${octave}`;
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = bufferLength;
      source.connect(analyserRef.current);

      // Create the pitch detector
      detectorRef.current = PitchDetector.forFloat32Array(bufferLength);

      listen();
    } catch (err) {
      console.error('Microphone access error:', err);
      setNote('🎤 Microphone access denied');
    }
  };

  const listen = () => {
    const loop = () => {
      analyserRef.current.getFloatTimeDomainData(buffer);
      const [pitch, clarity] = detectorRef.current.findPitch(buffer, 44100);
      if (clarity > 0.9 && pitch) {
        setNote(getNoteName(pitch));
      }
      requestAnimationFrame(loop);
    };
    loop();
  };

  return (
    <div className="singnote-container">
      <h1 className="singnote-title">🎤 Sing a Note</h1>
      <button className="singnote-button" onClick={startMic}>
        Start Listening
      </button>
      {note && <h2 className="singnote-note">Detected Note: {note}</h2>}
    </div>
  );
}
