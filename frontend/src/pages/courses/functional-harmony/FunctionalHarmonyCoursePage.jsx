// src/pages/courses/functional-harmony/FunctionalHarmonyCoursePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
import './FunctionalHarmonyCoursePage.css';

const lessons = [
  {
    id: 'lesson1',
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
    id: 'lesson2',
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
    id: 'lesson3',
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
    id: 'lesson4',
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
    id: 'lesson5',
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
    id: 'lesson6',
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
  const { currentUser } = useAuth();
  const [checkedLessons, setCheckedLessons] = useState({});

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser?.email) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/course-progress/get?email=${currentUser.email}&courseName=functional_harmony`
        );
        const data = await res.json();
        setCheckedLessons(data || {});
      } catch (err) {
        console.error('❌ Failed to load functional harmony progress:', err);
      }
    };
    fetchProgress();
  }, [currentUser]);

  const updateBackend = async (lessonId, isChecked) => {
    if (!currentUser?.email) return;
    try {
      await fetch('http://localhost:5000/api/course-progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          courseName: 'functional_harmony',
          lessonIndex: lessonId,
          isChecked,
        }),
      });
    } catch (err) {
      console.error('❌ Failed to update lesson progress:', err);
    }
  };

  const toggleLessonCheck = (lessonId) => {
    const newStatus = !checkedLessons[lessonId];
    setCheckedLessons((prev) => {
      const updated = { ...prev };
      if (newStatus) {
        updated[lessonId] = true;
      } else {
        delete updated[lessonId];
      }
      return updated;
    });
    updateBackend(lessonId, newStatus);
  };

  const markLessonComplete = (lessonId) => {
    if (!checkedLessons[lessonId]) {
      setCheckedLessons((prev) => ({ ...prev, [lessonId]: true }));
      updateBackend(lessonId, true);
    }
  };

  return (
    <div className="functional_harmony-wrapper">
      <div className="functional_harmony-fixed-navbar">
        <Navbar />
      </div>

      <div className="functional_harmony-scroll-container">
        <div style={{ height: '60px' }} /> {/* Spacer for navbar */}

        <div className="functional_harmony-inner-wrapper">
          <div className="functional_harmony-page">
            <h1 className="functional_harmony-title">🎼 Functional Harmony Basics</h1>
            <p className="functional_harmony-description">
              This course will help you understand how chords relate to each scale,
              and how progressions like V–I or ii–V–I shape music.
            </p>

            <div className="functional_harmony-lesson-list">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="functional_harmony-lesson-card">
                  <div className="functional_harmony-lesson-header">
                    <h2 className="functional_harmony-lesson-title">{lesson.title}</h2>
                    <input
                      type="checkbox"
                      checked={!!checkedLessons[lesson.id]}
                      onChange={() => toggleLessonCheck(lesson.id)}
                      className="functional_harmony-checkbox"
                    />
                  </div>
                  <p className="functional_harmony-lesson-description">{lesson.description}</p>
                  <Link
                    to={lesson.route}
                    state={lesson.state}
                    className="functional_harmony-start-btn"
                    onClick={() => markLessonComplete(lesson.id)}
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
