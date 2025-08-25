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
    title: 'Lesson 1: I and V in C Major',
    description: 'Begin with the tonic (I) and dominant (V) in C major: the foundation of functional harmony.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C'],
      selectedDegrees: ['I', 'V'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: false,
      },
      rounds: 6,
    },
  },
  {
    id: 'lesson2',
    title: 'Lesson 2: Add IV — The Subdominant',
    description: 'Explore the motion between I, IV, and V in C major. The three core pillars of harmony.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C'],
      selectedDegrees: ['I', 'IV', 'V'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: true,
      },
      rounds: 8,
    },
  },
  {
    id: 'lesson3',
    title: 'Lesson 3: Add VI — The Submediant',
    description: 'Add the VI chord to your C major palette. Notice how it softens harmonic movement.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C'],
      selectedDegrees: ['I', 'IV', 'V', 'VI'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: true,
      },
      rounds: 8,
    },
  },
  {
    id: 'lesson4',
    title: 'Lesson 4: Add II — The Pre-Dominant',
    description: 'The II chord leads naturally into V. Now we’re approaching full cadences.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C'],
      selectedDegrees: ['I', 'II', 'IV', 'V', 'VI'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: true,
      },
      rounds: 10,
    },
  },
  {
    id: 'lesson5',
    title: 'Lesson 5: Add III — A Colorful Option',
    description: 'The III chord is less common but adds color. Let’s add it to the mix.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C'],
      selectedDegrees: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: true,
      },
      rounds: 12,
    },
  },
  {
    id: 'lesson6',
    title: 'Lesson 6: Full Set — All 7 Degrees in C Major',
    description: 'Include the leading tone (VII) and test your ability across the full C major scale.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C'],
      selectedDegrees: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
      questionStyles: {
        scaleToDegree: true,
        scaleToNote: false,
      },
      rounds: 14,
    },
  },
  {
    id: 'lesson7',
    title: 'Lesson 7: Note-to-Degree Challenge in C',
    description: 'Flip the game: identify the degree based on the note. Reinforce Roman numeral meaning.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C'],
      selectedDegrees: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
      questionStyles: {
        scaleToDegree: false,
        scaleToNote: true,
      },
      rounds: 14,
    },
  },
  {
    id: 'lesson8',
    title: 'Lesson 8: Mixed Challenge in C',
    description: 'Randomized question types — both degree-to-note and note-to-degree — to solidify fluency.',
    route: '/degree-notice/settings',
    state: {
      selectedScales: ['C'],
      selectedDegrees: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
      questionStyles: {
        scaleToDegree: true,
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
