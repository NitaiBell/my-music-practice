import React, { useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './PracticesShowcase.css';
import { useNavigate } from 'react-router-dom';

export default function PracticesShowcase() {
  const navigate = useNavigate();
  const sectionRefs = useRef([]);

  const sections = [
    {
      number: 1,
      title: 'Ping Pong Melody',
      description: 'Test your ear using scale notes and chords in both button and keyboard views. A full melody workout.',
      logo: '/practices_logos/ping pong melody.png',
      link: '/real-melody',
      background: 'linear-gradient(to bottom right, #bbf7d0, #34d399)', // green mint to emerald
    },
    {
      number: 2,
      title: 'Harmony Training',
      description: 'Practice identifying harmonic progressions and functional chord roles within scales.',
      logo: '/practices_logos/ping pong harmony.png',
      link: '/harmony',
      background: 'linear-gradient(to bottom right, #c7f9cc, #38b000)', // fresh green
    },
    {
      number: 3,
      title: 'Which Higher Note',
      description: 'Listen to two notes and choose the higher one. Simple and fast ear-training drill.',
      logo: '/practices_logos/which is higher.png',
      link: '/which-higher-note',
      background: 'linear-gradient(to bottom right, #ffe0e0, #ff6b6b)', // soft red to bold red
    },
    {
      number: 4,
      title: 'Learn Piano',
      description: 'Play back a displayed note sequence on the piano keyboard. Great for visual and muscle memory.',
      logo: '/practices_logos/piano notes.png',
      link: '/learn-piano',
      background: 'linear-gradient(to bottom right, #e0f7fa, #80deea)', // cyan light
    },
    {
      number: 5,
      title: 'Learn Piano Chords',
      description: 'Learn and identify chords visually on the keyboard and by sound.',
      logo: '/practices_logos/piano chords.png',
      link: '/learn-piano-chords',
      background: 'linear-gradient(to bottom right, #f3e8ff, #c084fc)', // light to bright purple
    },
    {
      number: 6,
      title: 'Degree Notice Training',
      description: 'Test your ability to identify scale degrees or their corresponding notes in different keys.',
      logo: '/practices_logos/degree notice training.png',
      link: '/degree-notice',
      background: 'linear-gradient(to bottom right, #ede9fe, #a78bfa)', // soft violet
    },
    {
      number: 7,
      title: 'Chord Type Practice',
      description: 'Identify chord types (maj7, dim, sus, etc.) by ear. Choose the right label for each sound.',
      logo: '/practices_logos/chord type practice.png',
      link: '/chord-type',
      background: 'linear-gradient(to bottom right, #fff7d6, #facc15)', // soft gold
    },
    {
      number: 8,
      title: 'Difference Practice',
      description: 'Listen to two musical examples and identify what changed between them.',
      logo: '/practices_logos/spot the difference.png',
      link: '/difference',
      background: 'linear-gradient(to bottom right, #fef9c3, #fde047)', // pastel to bright yellow
    },
    {
      number: 9,
      title: 'Interval Training',
      description: 'Hear two notes and determine the musical interval between them.',
      logo: '/practices_logos/interval trainer.png',
      link: '/interval-practice',
      background: 'linear-gradient(to bottom right, #d0f0fd, #38bdf8)', // sky blue gradient
    },
    {
      number: 10,
      title: 'Melodic Dictation',
      description: 'Listen and write the melody you hear. A challenging ear training task.',
      logo: '/practices_logos/melodic dictation.png',
      link: '/melodic-dictation',
      background: 'linear-gradient(to bottom right, #fce7f3, #f472b6)', // light pink to magenta
    },
    {
      number: 11,
      title: 'Harmonic Dictation',
      description: 'Write down the harmonic progression you hear using your ear and theory knowledge.',
      logo: '/practices_logos/harmonic dictation.png',
      link: '/harmonic',
      background: 'linear-gradient(to bottom right, #e0f2f1, #26c6da)', // light cyan-teal
    },
    {
      number: 12,
      title: 'Chords for Melody',
      description: 'Listen to a melody and choose the matching chord that fits harmonically.',
      logo: '/practices_logos/chords for harmony.png',
      link: '/chords-for-melody',
      background: 'linear-gradient(to bottom right, #dbeafe, #3b82f6)', // soft to strong blue
    },
  ];
  
  

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="practice-showcase-wrapper">
      <div className="practice-fixed-navbar">
        <Navbar />
        <div className="practice-sub-navbar">
          {sections.map((section, index) => (
            <button
              key={section.number}
              className="practice-sub-button"
              onClick={() => scrollToSection(index)}
              title={section.title}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      <div className="practice-scroll-container">
        <div className="practice-navbar-spacer" />

        {sections.map((section, index) => (
          <div
            className="practice-section"
            key={section.number}
            ref={(el) => (sectionRefs.current[index] = el)}
            style={{
              background: section.background,
              borderBottom: '1px solid black',
            }}
          >
            <div className="practice-count">
              {section.number} / {sections.length}
            </div>
            <div className="practice-content">
              <div
                className="practice-logo"
                onClick={() => navigate(section.link)}
                title="Go to Practice"
              >
                <img src={section.logo} alt="Practice Logo" />
              </div>
              <div className="practice-description">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                <button onClick={() => navigate(section.link)}>Start Practice</button>
              </div>
            </div>
          </div>
        ))}

        <div className="practice-footer-wrapper">
          <Footer />
        </div>
      </div>
    </div>
  );
}
