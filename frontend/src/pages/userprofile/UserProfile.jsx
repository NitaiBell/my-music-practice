// src/pages/userprofile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courses from '../../data/courseList';
import { Link } from 'react-router-dom';

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
    background: 'linear-gradient(to bottom right, #e6ffe6, #38b000)',
  },
  {
    name: 'Degree Notice Training',
    path: '/degree-notice',
    logo: '/practices_logos/degree notice training.png',
    description: 'Match scale degrees with notes in different keys.',
    background: 'linear-gradient(to bottom right, #38b000, #d1fae5)',
  },
  {
    name: 'Difference Practice',
    path: '/difference',
    logo: '/practices_logos/spot the difference.png',
    description: 'Spot the difference between two musical examples.',
    background: 'linear-gradient(to bottom right, #e6fff7,rgb(19, 197, 158))',
  },
  {
    name: 'Harmony Training',
    path: '/harmony',
    logo: '/practices_logos/ping pong harmony.png',
    description: 'Practice functional harmony recognition in real time.',
    background: 'linear-gradient(to bottom right, rgb(19, 197, 158), #ccfbf1)',
  },
  {
    name: 'Interval Training',
    path: '/interval-practice',
    logo: '/practices_logos/interval trainer.png',
    description: 'Identify musical intervals between two notes.',
    background: 'linear-gradient(to bottom right, #e0ffe9, #1f7d53)',
  },
  {
    name: 'Learn Piano',
    path: '/learn-piano',
    logo: '/practices_logos/piano notes.png',
    description: 'Play back note sequences shown on screen.',
    background: 'linear-gradient(to bottom right, #1f7d53, #ebfbee)',
  },
  {
    name: 'Learn Piano Chords',
    path: '/learn-piano-chords',
    logo: '/practices_logos/piano chords.png',
    description: 'Identify chords visually and aurally on the keyboard.',
    background: 'linear-gradient(to bottom right, #e6ffe6, #3f6212)',
  },
  {
    name: 'Real Melody Training',
    path: '/real-melody',
    logo: '/practices_logos/ping pong melody.png',
    description: 'Play back melodies using buttons or the keyboard.',
    background: 'linear-gradient(to bottom right, #3f6212, #f0fff4)',
  },
  {
    name: 'Which Higher Note',
    path: '/which-higher-note',
    logo: '/practices_logos/which is higher.png',
    description: 'Listen to two notes and choose the higher one.',
    background: 'linear-gradient(to bottom right, #e6ffe6, #2e7d32)',
  },
  {
    name: 'Harmonic Dictation',
    path: '/harmonic',
    logo: '/practices_logos/harmonic dictation.png',
    description: 'Write down chord progressions by ear.',
    background: 'linear-gradient(to bottom right, #2e7d32, #ecfdf5)',
  },
  {
    name: 'Melodic Dictation',
    path: '/melodic-dictation',
    logo: '/practices_logos/melodic dictation.png',
    description: 'Transcribe melodies played by the system.',
    background: 'linear-gradient(to bottom right, #e6ffe6, #006400)',
  },
];

const chordsForMelodyPractice = {
  name: 'Chords for Melody',
  path: '/chords-for-melody',
  logo: '/practices_logos/chords for harmony.png',
  description: 'Choose the right chord to match a melody line.',
  background: 'linear-gradient(to bottom right, #dbeafe, #3b82f6)',
};

const mainPracticeLinks = practiceLinks.filter(p => p.name !== 'Chords for Melody');

export default function UserProfile() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  const user = currentUser;
  const username = user?.name || 'Guest';
  const gmail = user?.email || '';
  const [selectedImage, setSelectedImage] = useState(user?.image_url || '/profiles/mozart profile.png');
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [practiceStats, setPracticeStats] = useState({});

  useEffect(() => {
    if (!gmail) return;

    const fetchStats = async () => {
      const allStats = {};
      for (const practice of [...practiceLinks, chordsForMelodyPractice]) {
        try {
          const res = await fetch(`http://localhost:5000/api/practice/stats?gmail=${gmail}&practiceName=${encodeURIComponent(practice.name)}`);
          const data = await res.json();
          allStats[practice.name] = data;
        } catch (err) {
          console.error(`Failed to fetch stats for ${practice.name}`, err);
        }
      }
      setPracticeStats(allStats);
    };

    const fetchCourseProgress = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/course-progress/all?email=${gmail}`);
        const data = await res.json();
        setCurrentUser(prev => ({
          ...prev,
          course_progress: data,
        }));
      } catch (err) {
        console.error('Failed to fetch course progress:', err);
      }
    };

    fetchStats();
    fetchCourseProgress();
  }, [gmail, setCurrentUser]);

  const updateImageOnServer = async (newImageUrl) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/update-image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, imageUrl: newImageUrl }),
      });
      const updated = await res.json();
      localStorage.setItem('user', JSON.stringify(updated));
      setCurrentUser(updated);
    } catch (err) {
      console.error('Failed to update image:', err);
    }
  };

  const getCourseProgressText = (courseId, totalLessons) => {
    const completed = user?.course_progress?.[courseId]
      ? Object.values(user.course_progress[courseId]).filter(val => val === true).length
      : 0;
    const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    return `${completed}/${totalLessons} lessons — ${percent}% complete`;
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
                  <img src={uploadedImage || '/icons/upload-icon.png'} alt="Upload" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
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
        {!user?.email && (
          <p className="user-profile-guest-warning">
            To save your progress and view your practice logs, please <a href="/signin">sign in</a> or <a href="/signup">create an account</a>.
          </p>
        )}

        {/* Practices Section */}
        <section id="practices" className="user-profile-section">
          <h3>My Practices</h3>
          <div className="user-profile-practice-list">
            {mainPracticeLinks.map(p => (
              <div className="user-practice-item" key={p.path}>
                <div className="practice-logo-wrapper" style={{ background: p.background }}>
                  <img src={p.logo} alt={p.name} className="practice-logo-img" />
                </div>
                <div className="practice-info">
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                  <div className="practice-stats">
                    <span>🎯 Highest Score: {practiceStats[p.name]?.highestScore || 0} (Level {practiceStats[p.name]?.highestLevel || 0})</span>
                    <span>🕓 Last Score: {practiceStats[p.name]?.lastScore || 0} (Level {practiceStats[p.name]?.lastLevel || 0})</span>
                  </div>
                </div>
                <div className="practice-actions">
                  <a className="practice-play-btn" href={p.path}>Play</a>
                  <button className="practice-performance-btn" onClick={() => navigate(`/practice-log/${encodeURIComponent(p.name)}`)}>
                    Practice Log
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '40px' }}>Chords for Melody</h3>
          <div className="user-profile-practice-list">
            <div className="user-practice-item" key={chordsForMelodyPractice.path}>
              <div className="practice-logo-wrapper" style={{ background: chordsForMelodyPractice.background }}>
                <img src={chordsForMelodyPractice.logo} alt={chordsForMelodyPractice.name} className="practice-logo-img" />
              </div>
              <div className="practice-info">
                <h4>{chordsForMelodyPractice.name}</h4>
                <p>{chordsForMelodyPractice.description}</p>
                <div className="practice-stats">
                  <span>🎯 Highest Score: {practiceStats[chordsForMelodyPractice.name]?.highestScore || 0} (Level {practiceStats[chordsForMelodyPractice.name]?.highestLevel || 0})</span>
                  <span>🕓 Last Score: {practiceStats[chordsForMelodyPractice.name]?.lastScore || 0} (Level {practiceStats[chordsForMelodyPractice.name]?.lastLevel || 0})</span>
                </div>
              </div>
              <div className="practice-actions">
                <a className="practice-play-btn" href={chordsForMelodyPractice.path}>Play</a>
                <button className="practice-performance-btn" onClick={() => navigate(`/practice-log/${encodeURIComponent(chordsForMelodyPractice.name)}`)}>
                  Practice Log
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="courses" className="user-profile-section">
          <h3>My Courses</h3>
          <div className="user-profile-cards">
            {courses.map((course, i) => (
              <Link to={course.route} key={i} className="user-profile-card user-course-card-link">
                <div className="user-profile-card-title">{course.title}</div>
                <div className="user-profile-card-separator"></div>
                <p className="user-profile-card-description">{course.description}</p>
                <p className="user-profile-course-progress">
                  ✅ {getCourseProgressText(course.id, course.totalLessons)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Articles Section */}
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
