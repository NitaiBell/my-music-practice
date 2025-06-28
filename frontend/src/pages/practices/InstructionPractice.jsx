// src/pages/instructions/InstructionPractice.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './InstructionPractice.css';

const instructionData = {
  '/chord-type': {
    title: 'Chord Type Practice',
    route: '/chord-type',
    content: (
      <>
        <p>
          In this practice, you will hear a chord and must identify its type— 
          such as <strong>major</strong>, <strong>minor</strong>, <strong>diminished</strong>, 
          <strong>augmented</strong>, <strong>sus</strong>, or <strong>extended</strong> chords.
        </p>
        <p>In the <strong>settings</strong>, you can:</p>
        <ul>
          <li>Choose which chord types you want to practice</li>
          <li>Set the number of rounds for your session</li>
        </ul>
        <p>Listen closely to the chord quality and select the correct answer.</p>
      </>
    ),
  },
  '/degree-notice': {
    title: 'Degree Notice Training',
    route: '/degree-notice',
    content: (
      <>
        <p>
          You will be given either a <strong>scale degree</strong> (e.g., V) or a <strong>note/chord</strong> (e.g., Dm),
          and must correctly identify its match in the selected key.
        </p>
        <p>This helps reinforce the connection between notes and their functional roles within a scale.</p>
        <h4>In the settings, you can:</h4>
        <ul>
          <li>Choose the <strong>scales</strong> to practice</li>
          <li>Select specific <strong>degrees</strong></li>
          <li>Pick the <strong>question style</strong>: note to degree or degree to note</li>
          <li>Set the total <strong>number of rounds</strong></li>
        </ul>
      </>
    ),
  },
  '/difference': {
    title: 'Difference Practice',
    route: '/difference',
    content: (
      <>
        <p>
          In <strong>Difference Practice</strong>, you will hear <strong>two sequences</strong> of notes played one after the other.
        </p>
        <p>Each sequence is the same length and contains notes you selected in the settings.</p>
        <p>Only <strong>one note</strong> is different between the two sequences. Your task is to identify which note was changed.</p>
        <ul>
          <li>🎯 All other notes stay exactly the same</li>
          <li>🎼 The order and rhythm remain unchanged</li>
          <li>🧠 Listen closely and spot the difference!</li>
        </ul>
        <p>This trains your <strong>ear for detail</strong> and improves your ability to track melodic changes.</p>
      </>
    ),
  },
  '/harmony': {
    title: 'Harmony Training',
    route: '/harmony',
    content: (
      <>
        <p>In <strong>Ping Pong Harmony</strong>, you'll practice identifying chords by sound within a chosen key.</p>
        <p>
          You begin by selecting the key, specific chords you want to practice, and the number of rounds.
          For advanced users, there's also an option to include <strong>special chords</strong> and control how often they appear.
        </p>
        <p>A chord is played each round — your goal is to recognize and select it quickly and accurately.</p>
        <ul>
          <li>🎵 Chords follow realistic harmonic progressions</li>
          <li>🎯 You hear one chord per round</li>
          <li>🌟 Special chords appear more often if enabled</li>
          <li>📊 Your stats contribute to your final rank</li>
        </ul>
        <p>This training builds your ear for <strong>functional harmony</strong> and improves your chord recognition.</p>
      </>
    ),
  },
  '/interval-practice': {
    title: 'Interval Training',
    route: '/interval-practice',
    content: (
      <>
        <p>
          In <strong>Interval Practice</strong>, you'll hear two notes — one after the other — and must identify both by clicking them on the keyboard.
        </p>
        <p>Before starting, choose:</p>
        <ul>
          <li>🎯 Which intervals to practice (e.g. Major 3rd, Perfect 5th)</li>
          <li>🎼 Which notes the first note can be based on</li>
          <li>⬆️⬇️ Ascending, descending, or both directions</li>
          <li>🔁 Number of rounds</li>
        </ul>
        <p>
          Each round, the first note is briefly highlighted, then both are played. Identify them in the right order.
        </p>
        <p>Feedback and ranking are based on accuracy, tries, and speed.</p>
      </>
    ),
  },
  '/learn-piano': {
    title: 'Learn Piano',
    route: '/learn-piano',
    content: (
      <>
        <p>
          In <strong>Learn Piano</strong>, your goal is to play back short melodic sequences on a keyboard — 
          improving your ability to read, hear, and map notes to keys.
        </p>
        <p>
          Choose a <strong>scale</strong> or go <strong>freestyle</strong>, then select the number of rounds and sequence length.
        </p>
        <ul>
          <li>🎼 Scale mode limits notes to the selected scale</li>
          <li>🎲 Freestyle allows any notes from C3–B5</li>
          <li>🎹 Click keys in order to answer</li>
        </ul>
        <p>Correct sequences advance the round. Mistakes restart the round. Ranking is based on performance.</p>
      </>
    ),
  },
  '/learn-piano-chords': {
    title: 'Learn Piano Chords',
    route: '/learn-piano-chords',
    content: (
      <>
        <p>
          In <strong>Learn Piano Chords</strong>, the keyboard flashes the notes of a chord in blue.
          Your task is to identify the chord by clicking the correct button.
        </p>
        <p>You can practice using chords from a selected scale or use freestyle mode.</p>
        <ul>
          <li>🎯 First-try correct answers increase your score</li>
          <li>🔁 Replay the chord if needed</li>
          <li>🎹 Click the matching chord button</li>
        </ul>
        <p>Your final rank reflects accuracy, tries, and speed.</p>
      </>
    ),
  },
  '/real-melody': {
    title: 'Real Melody Training',
    route: '/real-melody',
content: (
  <>
    <p>
      In <strong>Ping Pong Melody</strong>, a melody note is played and your task is to reproduce it by clicking the correct key on the keyboard.
    </p>
    <p>This practice strengthens your <strong>melodic memory</strong>, pitch recognition, and ear–hand coordination.</p>
    <ul>
      <li>🎵 Each round plays a single note from your selected notes</li>
      <li>🎯 You must get it right to move to the next note</li>
      <li>🎹 Use the keyboard to answer (note buttons if enabled)</li>
    </ul>
    <p>Your final score is based on accuracy, number of tries, and response time.</p>

    <h4>In the settings, you can:</h4>
    <ul>
      <li>🎼 Choose a <strong>scale</strong> (e.g., C major, G minor)</li>
      <li>🔢 Select specific <strong>notes</strong> from that scale to include</li>
      <li>🔁 Set the total <strong>number of rounds</strong> for the session</li>
    </ul>
    <p>This customization allows you to target specific tonal areas and match your skill level.</p>
  </>
),
  },
  '/which-higher-note': {
    title: 'Which Higher Note',
    route: '/which-higher-note',
content: (
  <>
    <p>
      In <strong>Which Higher Note</strong>, you hear two notes played one after the other.
      Your goal is to identify which note is higher in pitch.
    </p>
    <p>This practice sharpens your <strong>relative pitch</strong> and helps develop accurate listening skills.</p>
    <ul>
      <li>🎧 Listen to both notes carefully</li>
      <li>🖱 Click "First" or "Second" to choose the higher note</li>
      <li>🎯 First-try correct answers boost your score</li>
    </ul>
    <p>Your final score is based on accuracy, efficiency, and response time.</p>

    <h4>In the settings, you can:</h4>
    <ul>
      <li>🎹 Choose the <strong>octaves</strong> you want to practice in (e.g., 3, 4, 5)</li>
      <li>🔁 Set the <strong>number of rounds</strong> for your session</li>
    </ul>
    <p>This allows you to tailor the exercise difficulty to your current listening level.</p>
  </>
),
  },
  '/harmonic': {
    title: 'Harmonic Dictation',
    route: '/harmonic',
content: (
  <>
    <p>
      In <strong>Harmonic Dictation</strong>, you hear a short sequence of chords and must identify it by clicking the matching chord buttons.
    </p>
    <p>This exercise trains your <strong>harmonic ear</strong>, memory of progressions, and ability to recognize functional chord movement in context.</p>
    <ul>
      <li>🎵 A chord sequence is played from your selected chords</li>
      <li>🎹 Click the correct chords in order to match what you heard</li>
      <li>🎯 First-try correct sequences earn a higher score</li>
    </ul>

    <h4>Settings allow you to tailor your training:</h4>
    <ul>
      <li>🎼 <strong>Choose a scale</strong> (e.g., C, G, F major)</li>
      <li>🔠 <strong>Select chords</strong> from that scale, including <em>extra chords</em> like modal mixtures or secondary dominants</li>
      <li>🧠 You must choose a group of chords that fit a <strong>valid harmonic progression</strong></li>
      <li>🔁 <strong>Set number of rounds</strong> — each round tests you on a new progression from the set</li>
    </ul>

    <p>
      Valid progressions are predefined sets of musically correct sequences, such as:
    </p>
    <ul>
      <li>I → V → I</li>
      <li>I → IV → V → I</li>
      <li>I → VI → IV → V</li>
      <li>IV → I → V → I</li>
      <li>...and many more</li>
    </ul>

    <p>
      These ensure that the game only uses progressions that sound natural in the selected key. Choose chords wisely to unlock richer and more varied exercises!
    </p>
    <p>Your final score reflects your accuracy, number of tries, and how efficiently you recognize the chord patterns.</p>
  </>
),
  },
  '/melodic-dictation': {
    title: 'Melodic Dictation',
    route: '/melodic-dictation',
content: (
  <>
    <p>
      In <strong>Melodic Dictation</strong>, a short melody is played and your task is to reproduce it by clicking the correct keys on the keyboard in the right order.
    </p>
    <p>This practice sharpens your <strong>melodic ear</strong>, pitch memory, and note sequence recognition across different octaves.</p>
    
    <ul>
      <li>🎵 Each round plays a custom melody based on your selected settings</li>
      <li>🎯 You must reproduce the entire sequence correctly to move to the next round</li>
      <li>🎹 Use the on-screen keyboard to answer; wrong input restarts the round</li>
    </ul>

    <h4>Settings allow full control of your training:</h4>
    <ul>
      <li>🎼 <strong>Select a scale</strong> (e.g., C, G, F major)</li>
      <li>📝 <strong>Choose notes</strong> from the scale and optionally add out-of-scale notes</li>
      <li>🎚 <strong>Difficulty Levels</strong>:
        <ul>
          <li>Normal: 1 octave</li>
          <li>Hard: 2 octaves</li>
          <li>Master: 3 octaves</li>
        </ul>
      </li>
      <li>🔢 <strong>Set Sequence Length</strong>: how many notes are played in each round</li>
      <li>🔁 <strong>Choose Number of Rounds</strong>: total rounds in the session</li>
    </ul>

    <p>
      The melodies are generated using your selected notes and difficulty range, providing a personalized challenge every time.
    </p>

    <p>Your final score is based on accuracy, number of tries, and how quickly you identify and reproduce the melodies.</p>
  </>
),
  },
  '/chords-for-melody': {
    title: 'Chords for Melody',
    route: '/chords-for-melody',
content: (
  <>
    <p>
      In <strong>Chords for Melody</strong>, your goal is to add the correct chords underneath a given melody.
      This trains your <strong>harmonic ear</strong> and understanding of chord–melody relationships.
    </p>

    <p>You’ll listen to a melody and choose chords that match it musically, placing them in the correct positions.</p>

    <ul>
      <li>🎵 A melody is played one bar at a time</li>
      <li>🎹 Choose from a list of chords and assign them to each section</li>
      <li>✅ The goal is to harmonize the melody with fitting chords</li>
    </ul>

    <h4>Settings let you control the challenge:</h4>
    <ul>
      <li>🎼 <strong>Select a melody</strong> from grouped options</li>
      <li>🔢 The number of available chords depends on the group and melody</li>
    </ul>

    <p>
      This practice helps you learn how to match chords to melodies, recognize harmonic function, and develop real-world arranging skills.
    </p>

    <p>Your performance is evaluated based on accuracy and musical fit across the entire melody.</p>
  </>
),
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
        {practice.content}
        {practice.route && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <a href={practice.route} className="instruction-start-button">
              Start Practice
            </a>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
