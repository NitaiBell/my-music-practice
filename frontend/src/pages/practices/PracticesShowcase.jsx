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
      title: 'Chord Type Practice',
      description: 'Identify chord types like maj7, dim, or sus by ear.',
      logo: '/practices_logos/chord type practice.png',
      link: '/chord-type',
      background: 'linear-gradient(to bottom right, #fffbe6, #facc15)', // pale yellow to gold
    },
    {
      number: 2,
      title: 'Degree Notice Training',
      description: 'Match scale degrees with notes in different keys.',
      logo: '/practices_logos/degree notice training.png',
      link: '/degree-notice',
      background: 'linear-gradient(to bottom right, #f3e8ff, #a855f7)', // lavender to vibrant purple
    },
    {
      number: 3,
      title: 'Difference Practice',
      description: 'Spot the difference between two musical examples.',
      logo: '/practices_logos/spot the difference.png',
      link: '/difference',
      background: 'linear-gradient(to bottom right, #ffe4e6, #f472b6)', // pale pink to rose
    },
    {
      number: 4,
      title: 'Harmony Training',
      description: 'Practice functional harmony recognition in real time.',
      logo: '/practices_logos/ping pong harmony.png',
      link: '/harmony',
      background: 'linear-gradient(to bottom right, #e8f5e9, #43a047)', // light mint to green
    },
    {
      number: 5,
      title: 'Interval Training',
      description: 'Identify musical intervals between two notes.',
      logo: '/practices_logos/interval trainer.png',
      link: '/interval-practice',
      background: 'linear-gradient(to bottom right, #e0f7fa, #0288d1)', // cyan to ocean blue
    },
    {
      number: 6,
      title: 'Learn Piano',
      description: 'Play back note sequences shown on screen.',
      logo: '/practices_logos/piano notes.png',
      link: '/learn-piano',
      background: 'linear-gradient(to bottom right, #fef3c7, #fb923c)', // warm yellow to orange
    },
    {
      number: 7,
      title: 'Learn Piano Chords',
      description: 'Identify chords visually and aurally on the keyboard.',
      logo: '/practices_logos/piano chords.png',
      link: '/learn-piano-chords',
      background: 'linear-gradient(to bottom right, #e0f2f1, #26c6da)', // turquoise gradient
    },
    {
      number: 8,
      title: 'Real Melody Training',
      description: 'Play back melodies using buttons or the keyboard.',
      logo: '/practices_logos/ping pong melody.png',
      link: '/real-melody',
      background: 'linear-gradient(to bottom right, #fce7f3, #f43f5e)', // soft pink to coral red
    },
    {
      number: 9,
      title: 'Which Higher Note',
      description: 'Listen to two notes and choose the higher one.',
      logo: '/practices_logos/which is higher.png',
      link: '/which-higher-note',
      background: 'linear-gradient(to bottom right, #f1f5f9, #64748b)', // light gray to slate
    },
    {
      number: 10,
      title: 'Harmonic Dictation',
      description: 'Write down chord progressions by ear.',
      logo: '/practices_logos/harmonic dictation.png',
      link: '/harmonic',
      background: 'linear-gradient(to bottom right, #fffaf0, #eab308)', // ivory to rich gold
    },
    {
      number: 11,
      title: 'Melodic Dictation',
      description: 'Transcribe melodies played by the system.',
      logo: '/practices_logos/melodic dictation.png',
      link: '/melodic-dictation',
      background: 'linear-gradient(to bottom right, #fdf4ff, #d946ef)', // pastel violet to fuchsia
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
