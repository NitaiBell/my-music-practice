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
      background: 'linear-gradient(to bottom right, #e6ffe6, #38b000)', // bright → dark
    },
    {
      number: 2,
      title: 'Degree Notice Training',
      description: 'Match scale degrees with notes in different keys.',
      logo: '/practices_logos/degree notice training.png',
      link: '/degree-notice',
      background: 'linear-gradient(to bottom right, #38b000, #d1fae5)', // dark → bright
    },
    {
      number: 3,
      title: 'Difference Practice',
      description: 'Spot the difference between two musical examples.',
      logo: '/practices_logos/spot the difference.png',
      link: '/difference',
      background: 'linear-gradient(to bottom right, #e6fff7,rgb(19, 197, 158))', // mint → deep green
    },
    {
      number: 4,
      title: 'Harmony Training',
      description: 'Practice functional harmony recognition in real time.',
      logo: '/practices_logos/ping pong harmony.png',
      link: '/harmony',
      background: 'linear-gradient(to bottom right, rgb(19, 197, 158), #ccfbf1)', // dark → pale green
    },
    {
      number: 5,
      title: 'Interval Training',
      description: 'Identify musical intervals between two notes.',
      logo: '/practices_logos/interval trainer.png',
      link: '/interval-practice',
      background: 'linear-gradient(to bottom right,rgb(156, 248, 182), #1f7d53)', // bright → deep green
    },
    {
      number: 6,
      title: 'Learn Piano',
      description: 'Play back note sequences shown on screen.',
      logo: '/practices_logos/piano notes.png',
      link: '/learn-piano',
      background: 'linear-gradient(to bottom right, #1f7d53, rgb(156, 248, 182))', // dark → bright
    },
    {
      number: 7,
      title: 'Learn Piano Chords',
      description: 'Identify chords visually and aurally on the keyboard.',
      logo: '/practices_logos/piano chords.png',
      link: '/learn-piano-chords',
      background: 'linear-gradient(to bottom right, #e6ffe6, #3f6212)', // bright → dark olive
    },
    {
      number: 8,
      title: 'Real Melody Training',
      description: 'Play back melodies using buttons or the keyboard.',
      logo: '/practices_logos/ping pong melody.png',
      link: '/real-melody',
      background: 'linear-gradient(to bottom right, #3f6212, #f0fff4)', // dark → bright
    },
    {
      number: 9,
      title: 'Which Higher Note',
      description: 'Listen to two notes and choose the higher one.',
      logo: '/practices_logos/which is higher.png',
      link: '/which-higher-note',
      background: 'linear-gradient(to bottom right, #e6ffe6, #2e7d32)', // bright → deep green
    },
    {
      number: 10,
      title: 'Harmonic Dictation',
      description: 'Write down chord progressions by ear.',
      logo: '/practices_logos/harmonic dictation.png',
      link: '/harmonic',
      background: 'linear-gradient(to bottom right, #2e7d32, #ecfdf5)', // dark → bright
    },
    {
      number: 11,
      title: 'Melodic Dictation',
      description: 'Transcribe melodies played by the system.',
      logo: '/practices_logos/melodic dictation.png',
      link: '/melodic-dictation',
      background: 'linear-gradient(to bottom right, #e6ffe6,rgb(123, 245, 239))', // bright → dark forest green
    },
    {
      number: 12,
      title: 'Chords for Melody',
      description: 'Listen to a melody and choose the matching chord that fits harmonically.',
      logo: '/practices_logos/chords for harmony.png',
      link: '/chords-for-melody',
      background: 'linear-gradient(to bottom right, rgb(123, 245, 239), #e6ffe6)', // dark → bright
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
  <div className="practice-button-group">
    <button onClick={() => navigate(section.link)}>Start Practice</button>
    <button onClick={() => navigate(`/instructions${section.link}`)}>
      Instructions
    </button>
  </div>
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
