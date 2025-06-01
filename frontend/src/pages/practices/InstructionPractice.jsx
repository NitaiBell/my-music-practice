// src/pages/instructions/InstructionPractice.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './InstructionPractice.css';

const instructionData = {
    '/chord-type': {
      title: 'Chord Type Practice',
      content: 'In this practice, you will hear a chord and must identify its type, such as major, minor, diminished, augmented, sus, or extended chords. Listen closely to the chord quality and choose the correct answer.',
    },
    '/degree-notice': {
      title: 'Degree Notice Training',
      content: 'You will be given either a scale degree or a note, and must correctly identify its corresponding match in the selected key. This helps reinforce the connection between notes and their functional roles within a scale.',
    },
    '/difference': {
      title: 'Difference Practice',
      content: 'You will hear two musical examples—either melodic or harmonic—and must identify what is different between them. It could be a single note, rhythm, or chord. This sharpens your listening and memory skills.',
    },
    '/harmony': {
      title: 'Harmony Training',
      content: 'This exercise plays chord progressions in a key. You must identify the correct chord being played, based on its function in the scale. This trains your harmonic recognition and sense of tonal movement.',
    },
    '/interval-practice': {
      title: 'Interval Training',
      content: 'You will hear two notes and must identify the interval between them (e.g., major third, perfect fifth). Intervals may be ascending, descending, or randomized, helping you build a precise ear for distances between pitches.',
    },
    '/learn-piano': {
      title: 'Learn Piano',
      content: 'This practice shows a short sequence of notes. Your task is to play them back in the correct order using the on-screen keyboard. It improves melodic memory and hand-eye coordination.',
    },
    '/learn-piano-chords': {
      title: 'Learn Piano Chords',
      content: 'You’ll see or hear a chord, and you must identify or play it on the keyboard. This helps reinforce visual and auditory recognition of chord shapes and voicings.',
    },
    '/real-melody': {
      title: 'Real Melody Training',
      content: 'In this challenge, you hear a melody and must reproduce it using either note buttons or the full keyboard. The game trains your melodic ear and precision across different octaves.',
    },
    '/which-higher-note': {
      title: 'Which Higher Note',
      content: 'You will hear two notes. Your goal is to identify which one is higher in pitch. This simple exercise builds pitch comparison accuracy—essential for all musical ear training.',
    },
    '/harmonic': {
      title: 'Harmonic Dictation',
      content: 'You will hear a chord progression and must write down (or choose) the correct sequence of chords. This develops deep listening skills and awareness of harmonic structure.',
    },
    '/melodic-dictation': {
      title: 'Melodic Dictation',
      content: 'A melody will be played note by note. Your task is to transcribe the exact notes in order. This practice develops pitch memory, aural transcription, and interval awareness.',
    },
    '/chords-for-melody': {
      title: 'Chords for Melody',
      content: 'A melody is played, and you must choose the chord that harmonically fits with it. This develops your skill in matching chords to melodic content and understanding harmonic context.',
    },
  };
  

export default function InstructionPractice() {
  const { practiceKey } = useParams();
  const practicePath = '/' + practiceKey;
  const practice = instructionData[practicePath];

  if (!practice) {
    return (
      <div className="instruction-practice-container">
        <Navbar />
        <div className="instruction-practice-content">
          <h1>Instructions Not Found</h1>
          <p>The requested instructions do not exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="instruction-practice-container">
      <Navbar />
      <div className="instruction-practice-content">
        <h1>{practice.title}</h1>
        <p>{practice.content}</p>
      </div>
      <Footer />
    </div>
  );
}
