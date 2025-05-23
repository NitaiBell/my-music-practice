// src/pages/userprofile/UserProfile.jsx
import React, { useState } from 'react';
import './UserProfile.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const profileOptions = [
  { name: 'Mozart', file: 'mozart profile.png' },
  { name: 'Bunny Mozart', file: 'bunny mozart.png' },
  { name: 'Bear Mozart', file: 'bear mozart.png' },
  { name: 'Cat Mozart', file: 'cat mozart.png' },
  { name: 'Cool Mozart', file: 'cool mozart.png' },
  { name: 'Cowboy Mozart', file: 'cowboy mozart.png' },
  { name: 'Elephant Mozart', file: 'elephant mozart.png' },
  { name: 'Freedom Mozart', file: 'freedom mozart.png' },
  { name: 'Koala Mozart', file: 'kuala mozart.png' },
  { name: 'Monkey Mozart', file: 'monkey mozart.png' },
  { name: 'Penguin Mozart', file: 'penguin mozart.png' },
  { name: 'Pig Mozart', file: 'pig mozart.png' },
  { name: 'Pirate Mozart', file: 'pirate mozart.png' },
  { name: 'Turtle Mozart', file: 'turtle mozart.png' },
];

const practiceLinks = [
  {
    name: 'Chord Type Practice',
    path: '/chord-type',
    logo: '/practices_logos/chord type practice.png',
    description: 'Identify chord types like maj7, dim, or sus by ear.',
    background: 'linear-gradient(to bottom right, #fff7d6, #facc15)', // soft gold
  },
  {
    name: 'Chords for Melody',
    path: '/chords-for-melody',
    logo: '/practices_logos/chords for harmony.png',
    description: 'Choose the right chord to match a melody line.',
    background: 'linear-gradient(to bottom right, #dbeafe, #3b82f6)', // soft to strong blue
  },
  {
    name: 'Degree Notice Training',
    path: '/degree-notice',
    logo: '/practices_logos/degree notice training.png',
    description: 'Match scale degrees with notes in different keys.',
    background: 'linear-gradient(to bottom right, #ede9fe, #a78bfa)', // soft violet
  },
  {
    name: 'Difference Practice',
    path: '/difference',
    logo: '/practices_logos/spot the difference.png',
    description: 'Spot the difference between two musical examples.',
    background: 'linear-gradient(to bottom right, #fef9c3, #fde047)', // pastel to bright yellow
  },
  {
    name: 'Harmony Training',
    path: '/harmony',
    logo: '/practices_logos/ping pong harmony.png',
    description: 'Practice functional harmony recognition in real time.',
    background: 'linear-gradient(to bottom right, #c7f9cc, #38b000)', // fresh green
  },
  {
    name: 'Interval Training',
    path: '/interval-practice',
    logo: '/practices_logos/interval trainer.png',
    description: 'Identify musical intervals between two notes.',
    background: 'linear-gradient(to bottom right, #d0f0fd, #38bdf8)', // sky blue gradient
  },
  {
    name: 'Learn Piano',
    path: '/learn-piano',
    logo: '/practices_logos/piano notes.png',
    description: 'Play back note sequences shown on screen.',
    background: 'linear-gradient(to bottom right, #e0f7fa, #80deea)', // cyan light
  },
  {
    name: 'Learn Piano Chords',
    path: '/learn-piano-chords',
    logo: '/practices_logos/piano chords.png',
    description: 'Identify chords visually and aurally on the keyboard.',
    background: 'linear-gradient(to bottom right, #f3e8ff, #c084fc)', // light to bright purple
  },
  {
    name: 'Real Melody Training',
    path: '/real-melody',
    logo: '/practices_logos/ping pong melody.png',
    description: 'Play back melodies using buttons or the keyboard.',
    background: 'linear-gradient(to bottom right, #bbf7d0, #34d399)', // green mint to emerald
  },
  {
    name: 'Which Higher Note',
    path: '/which-higher-note',
    logo: '/practices_logos/which is higher.png',
    description: 'Listen to two notes and choose the higher one.',
    background: 'linear-gradient(to bottom right, #ffe0e0, #ff6b6b)', // soft red to bold red
  },
  {
    name: 'Harmonic Dictation',
    path: '/harmonic',
    logo: '/practices_logos/harmonic dictation.png',
    description: 'Write down chord progressions by ear.',
    background: 'linear-gradient(to bottom right, #e0f2f1, #26c6da)', // light cyan-teal
  },
  {
    name: 'Melodic Dictation',
    path: '/melodic-dictation',
    logo: '/practices_logos/melodic dictation.png',
    description: 'Transcribe melodies played by the system.',
    background: 'linear-gradient(to bottom right, #fce7f3, #f472b6)', // light pink to magenta
  },
];

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.name || 'Guest';
  const [selectedImage, setSelectedImage] = useState(user?.image_url || '/profiles/mozart profile.png');
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const updateImageOnServer = async (newImageUrl) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/update-image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, imageUrl: newImageUrl }),
      });
      const updated = await res.json();
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to update image:', err);
    }
  };

  const handleSelectImage = (file) => {
    const url = `/profiles/${file}`;
    setSelectedImage(url);
    updateImageOnServer(url);
    setShowDropdown(false);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setUploadedImage(base64);
        setSelectedImage(base64);
        updateImageOnServer(base64);
        setShowDropdown(false);
      };
      reader.readAsDataURL(file);
    }
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
      <div className="user-profile-fixed-header">
        <Navbar />
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
              <div className="user-profile-option upload-option">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <img
                    src={uploadedImage || '/icons/upload-icon.png'}
                    alt="Upload"
                    style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                  />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
                </label>
              </div>
              {profileOptions.map(({ name, file }) => (
                <div key={file} className="user-profile-option" onClick={() => handleSelectImage(file)}>
                  <img src={`/profiles/${file}`} alt={name} />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="user-profile-content">
        <h2 className="user-profile-welcome">Welcome {username}</h2>

        <section id="practices" className="user-profile-section">
          <h3>My Practices</h3>
          <div className="user-profile-practice-list">
            {practiceLinks.map((p) => (
              <div className="user-practice-item" key={p.path}>
<div className="practice-logo-wrapper" style={{ background: p.background }}>
  <img src={p.logo} alt={p.name} className="practice-logo-img" />
</div>
                <div className="practice-info">
  <h4>{p.name}</h4>
  <p>{p.description}</p>
  <div className="practice-stats">
  <span>🎯 Highest Score: 98 (Level 2)</span>
  <span>🕓 Last Score: 84 (Level 1)</span>
</div>
</div>
                <div className="practice-actions">
                  <a className="practice-play-btn" href={p.path}>Play</a>
                  <button className="practice-performance-btn">Practice Log</button>
                </div>
              </div>
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

      <Footer />
    </div>
  );
}
