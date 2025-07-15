// src/pages/courses/functional-harmony/FunctionalHarmonyCoursePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import './FunctionalHarmonyCoursePage.css';

const lessons = [
  {
    title: 'Lesson 1: What is V?',
    description: 'Learn how G is the V chord in the C major scale and hear how it resolves to C.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C'],
      selectedDegrees: ['V'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: true,
      },
      rounds: 8,
    },
  },
  {
    title: 'Lesson 2: Secondary Chords in G',
    description: 'Practice identifying chords like Am as the ii in G major.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['G'],
      selectedDegrees: ['ii', 'V'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: true,
      },
      rounds: 10,
    },
  },
  {
    title: 'Lesson 3: Full Functional Set',
    description: 'Train your ear and mind to recognize I, ii, IV, and V chords across multiple keys.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C', 'G', 'D'],
      selectedDegrees: ['I', 'ii', 'IV', 'V'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: true,
      },
      rounds: 12,
    },
  },
  {
    title: 'Lesson 4: Minor Keys and Their Degrees',
    description: 'Explore degrees like i, iv, and V in minor scales like A minor and E minor.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['Am', 'Em'],
      selectedDegrees: ['i', 'iv', 'V'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: true,
      },
      rounds: 10,
    },
  },
  {
    title: 'Lesson 5: Mixed Degrees in Major Scales',
    description: 'Recognize chords like iii and vi alongside I and V in various major keys.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C', 'D', 'F'],
      selectedDegrees: ['I', 'iii', 'vi', 'V'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: true,
      },
      rounds: 14,
    },
  },
  {
    title: 'Lesson 6: Degree to Note Challenge',
    description: 'Sharpen your accuracy converting Roman numerals to note names across scales.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C', 'G', 'A'],
      selectedDegrees: ['I', 'ii', 'iii', 'IV', 'V', 'vi'],
      questionStyles: {
        scaleToDegree: false,
        scaleToNote: true,
      },
      rounds: 16,
    },
  },
];

export default function FunctionalHarmonyCoursePage() {
  const [checkedLessons, setCheckedLessons] = useState(() => {
    const stored = localStorage.getItem('functional_harmony_checked');
    return stored ? JSON.parse(stored) : Array(lessons.length).fill(false);
  });

  const toggleLessonCheck = (index) => {
    const updated = [...checkedLessons];
    updated[index] = !updated[index];
    setCheckedLessons(updated);
    localStorage.setItem('functional_harmony_checked', JSON.stringify(updated));
  };

  const markLessonComplete = (index) => {
    const updated = [...checkedLessons];
    updated[index] = true;
    setCheckedLessons(updated);
    localStorage.setItem('functional_harmony_checked', JSON.stringify(updated));
  };

  return (
    <div className="functional_harmony-wrapper">
      <div className="functional_harmony-fixed-navbar">
        <Navbar />
      </div>

      <div className="functional_harmony-scroll-container">
        <div style={{ height: '60px' }} />
        <div className="functional_harmony-inner-wrapper">
          <div className="functional_harmony-page">
            <h1 className="functional_harmony-title">🎼 Functional Harmony Basics</h1>
            <p className="functional_harmony-description">
              This course will help you understand how chords relate to each scale, and how progressions like V-I or ii-V-I shape music.
            </p>

            <div className="functional_harmony-lesson-list">
              {lessons.map((lesson, i) => (
                <div key={i} className="functional_harmony-lesson-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 className="functional_harmony-lesson-title">{lesson.title}</h2>
                      <p className="functional_harmony-lesson-description">{lesson.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={checkedLessons[i]}
                      onChange={() => toggleLessonCheck(i)}
                      className="functional_harmony-checkbox"
                    />
                  </div>
                  <Link
                    to={lesson.route}
                    state={lesson.state}
                    onClick={() => markLessonComplete(i)}
                    className="functional_harmony-start-btn"
                  >
                    ▶️ Start Lesson
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
