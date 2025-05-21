// pages/userprofile/UserProfile.jsx
import React, { useState } from 'react';
import './UserProfile.css';
import Navbar from '../../components/Navbar'; // from anywhere
import Footer from '../../components/Footer'; // ✅ shared footer


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

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.name || 'Guest';  const [selectedImage, setSelectedImage] = useState('/profiles/mozart profile.png');
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleSelectImage = (file) => {
    setSelectedImage(`/profiles/${file}`);
    setShowDropdown(false);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setSelectedImage(reader.result);
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
      {/* Fixed Header Block */}
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
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                  />
                </label>
              </div>

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
      <Footer />  {/* ✅ Added footer here */}

    </div>
  );
}
