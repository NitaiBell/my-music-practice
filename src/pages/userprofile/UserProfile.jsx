import React, { useState } from 'react';
import './UserProfile.css';

const profileOptions = [
  { name: 'Mozart', file: 'mozart profile.png' },
  { name: 'Bunny Mozart', file: 'bunny mozart.png' },
];

const practiceLinks = [
  { name: 'Chord Type Practice', path: '/chord-type' },
  { name: 'Chords for Melody', path: '/chords-for-melody' },
  { name: 'Degree Notice Training', path: '/degree-notice' },
  { name: 'Difference Practice', path: '/difference' },
  { name: 'Harmony Training', path: '/harmony' },
  { name: 'Interval Training', path: '/interval-practice' },
  { name: 'Learn Piano', path: '/learn-piano' },
  { name: 'Learn Piano Chords', path: '/learn-piano-chords' },
  { name: 'Real Melody Training', path: '/real-melody' },
  { name: 'Which Higher Note', path: '/which-higher-note' },
  { name: 'Harmonic Dictation', path: '/harmonic' },
  { name: 'Melodic Dictation', path: '/melodic-dictation' },
];

export default function UserProfile({ username = 'Mozart' }) {
  const [selectedImage, setSelectedImage] = useState('/profiles/mozart profile.png');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectImage = (file) => {
    setSelectedImage(`/profiles/${file}`);
    setShowDropdown(false);
  };

  const scrollToSection = (id, offset = -280) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="user-profile-container">
      {/* Fixed Header Block */}
      <div className="user-profile-fixed-header">
        <div className="user-profile-navbar">
          <div className="navbar-logo">MyMusic</div>
          <div className="navbar-links">
            <a href="/">Home</a>
            <a href="/nitai-practices">Practices</a>
            <a href="/course/1">Courses</a>
            <a href="/articles">Articles</a>
          </div>
        </div>

        <div className="user-profile-banner"></div>

        <div className="user-profile-subnavbar">
          <button onClick={() => scrollToSection('practices')}>My Practices</button>
          <button onClick={() => scrollToSection('courses')}>My Courses</button>
          <button onClick={() => scrollToSection('articles')}>My Articles</button>
        </div>

        <div className="user-profile-image-wrapper">
          <img src={selectedImage} alt="User Avatar" className="user-profile-image" />
        </div>

        <div
          className="user-profile-plus-button"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          +
          {showDropdown && (
            <div className="user-profile-dropdown">
              {profileOptions.map(({ name, file }) => (
                <div
                  key={file}
                  className="user-profile-option"
                  onClick={() => handleSelectImage(file)}
                >
                  <img src={`/profiles/${file}`} alt={name} />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="user-profile-content">
        <h2 className="user-profile-welcome">Welcome {username}</h2>

        <section id="practices" className="user-profile-section">
          <h3>My Practices</h3>
          <div className="user-profile-cards">
            {practiceLinks.map((p) => (
              <a className="user-profile-card" key={p.path} href={p.path}>
                {p.name}
              </a>
            ))}
          </div>
        </section>

        <section id="courses" className="user-profile-section">
          <h3>My Courses</h3>
          <div className="user-profile-cards">
            <div className="user-profile-card">Introduction to Chords</div>
            <div className="user-profile-card">Ear Training 101</div>
            <div className="user-profile-card">Melody Imitation Mastery</div>
            <div className="user-profile-card">Sight Reading Techniques</div>
            <div className="user-profile-card">Advanced Harmony</div>
            <div className="user-profile-card">Piano Finger Independence</div>
            <div className="user-profile-card">Chord Progression Lab</div>
            <div className="user-profile-card">Minor Scale Melodies</div>
          </div>
        </section>

        <section id="articles" className="user-profile-section">
          <h3>My Articles</h3>
          <div className="user-profile-cards">
            <div className="user-profile-card">How to Hear a Key</div>
            <div className="user-profile-card">What Makes a Good Melody?</div>
            <div className="user-profile-card">Piano or Voice First?</div>
            <div className="user-profile-card">Building a Practice Routine</div>
            <div className="user-profile-card">The Art of Listening</div>
            <div className="user-profile-card">Breaking Down Jazz Harmony</div>
            <div className="user-profile-card">Writing Catchy Hooks</div>
            <div className="user-profile-card">When to Use Modal Mixture</div>
          </div>
        </section>
      </div>
    </div>
  );
}
