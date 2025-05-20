// src/pages/practices/PracticesShowcase.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer'; // ✅ Add this

import './PracticesShowcase.css';
import { useNavigate } from 'react-router-dom';

export default function PracticesShowcase() {
  const navigate = useNavigate();

  const sections = [
    {
      number: 1,
      title: 'Ping Pong Melody – Notes',
      description: 'Train your ear to recognize scale notes by sound and position. Answer using buttons.',
      logo: '/practices_logos/ping pong melody.png',
      link: '/real-melody',
      background: 'linear-gradient(to bottom right, #bbf7d0, #34d399)', // mint to emerald
    },
    {
      number: 2,
      title: 'Ping Pong Melody – Keyboard',
      description: 'Use the on-screen piano keyboard to identify played scale notes. Great for finger practice.',
      logo: '/practices_logos/ping pong melody.png',
      link: '/real-melody',
      background: 'linear-gradient(to bottom right, #bbf7d0,rgb(13, 199, 131))', // mint to emerald
    },
    {
      number: 3,
      title: 'Ping Pong Melody – Chords',
      description: 'Listen to chords instead of single notes and match the correct chord using the keyboard or buttons.',
      logo: '/practices_logos/ping pong melody.png',
      link: '/real-melody',
      background: 'linear-gradient(to bottom right, #bbf7d0,rgb(114, 241, 194))', // mint to emerald
    },
    {
      number: 4,
      title: 'Ping Pong Melody – Full Challenge',
      description: 'Mix of notes and chords, alternating views and input types. A complete test of melody and harmony.',
      logo: '/practices_logos/ping pong melody.png',
      link: '/real-melody',
      background: 'linear-gradient(to bottom right, #bbf7d0,rgb(0, 255, 81))', // mint to emerald
    },
  ];
  

  return (
    <div className="practice-showcase-wrapper">
      <Navbar />
      <div className="practice-scroll-container">
  {sections.map((section) => (
    <div
      className="practice-section"
      key={section.number}
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

  <div className="practice-footer-wrapper"> {/* ✅ Add wrapper for spacing if needed */}
    <Footer />
  </div>
</div>
    </div>
  );
}
