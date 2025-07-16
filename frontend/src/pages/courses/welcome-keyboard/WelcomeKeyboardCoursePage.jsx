import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
import './WelcomeKeyboardCoursePage.css';

const lessons = [
  {
    id: 'lesson1',
    title: 'Lesson 1: Just C and G',
    description: 'Start by identifying only two keys: C and G. Get familiar with the spacing between white keys.',
    route: '/learn-piano/settings',
    state: {
      defaultScale: 'C',
      defaultNotes: ['C', 'G'],
      defaultRounds: 8,
      defaultSequenceLength: 4,
    },
  },
  {
    id: 'lesson2',
    title: 'Lesson 2: Add E to the Mix',
    description: 'Now play C, E, and G — the building blocks of a basic triad on the keyboard.',
    route: '/learn-piano/settings',
    state: {
      defaultScale: 'C',
      defaultNotes: ['C', 'E', 'G'],
      defaultRounds: 10,
      defaultSequenceLength: 5,
    },
  },
  {
    id: 'lesson3',
    title: 'Lesson 3: All White Keys in C',
    description: 'Practice all the white keys in C major: C D E F G A B.',
    route: '/learn-piano/settings',
    state: {
      defaultScale: 'C',
      defaultNotes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      defaultRounds: 12,
      defaultSequenceLength: 6,
    },
  },
];

export default function WelcomeKeyboardCoursePage() {
  const { currentUser } = useAuth();
  const [completedLessons, setCompletedLessons] = useState({});

  // Load lesson progress from backend on mount
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser?.email) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/course-progress/get?email=${currentUser.email}&courseName=welcome_keyboard`
        );
        const data = await res.json();
        setCompletedLessons(data || {});
      } catch (err) {
        console.error('❌ Failed to load lesson progress:', err);
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
          courseName: 'welcome_keyboard',
          lessonIndex: lessonId,
          isChecked,
        }),
      });
    } catch (err) {
      console.error('❌ Failed to update lesson progress:', err);
    }
  };

  const handleCheckboxToggle = (lessonId) => {
    const newStatus = !completedLessons[lessonId];
    setCompletedLessons((prev) => {
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

  const handleStartLesson = (lessonId) => {
    if (!completedLessons[lessonId]) {
      setCompletedLessons((prev) => {
        const updated = { ...prev, [lessonId]: true };
        return updated;
      });
      updateBackend(lessonId, true);
    }
  };

  return (
    <div className="welcome_keyboard-wrapper">
      <div className="welcome_keyboard-fixed-navbar">
        <Navbar />
      </div>

      <div className="welcome_keyboard-scroll-container">
        <div style={{ height: '60px' }} /> {/* Spacer for navbar */}

        <div className="welcome_keyboard-inner-wrapper">
          <div className="welcome_keyboard-page">
            <h1 className="welcome_keyboard-title">🎹 Welcome to the Keyboard</h1>
            <p className="welcome_keyboard-description">
              In this course, you’ll begin by learning how to recognize notes on the piano keyboard.
              Each lesson gradually adds new notes and challenges, helping you build confidence and accuracy.
            </p>

            <div className="welcome_keyboard-lesson-list">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="welcome_keyboard-lesson-card">
                  <div className="welcome_keyboard-lesson-header">
                    <h2 className="welcome_keyboard-lesson-title">{lesson.title}</h2>
                    <input
                      type="checkbox"
                      checked={!!completedLessons[lesson.id]}
                      onChange={() => handleCheckboxToggle(lesson.id)}
                      className="welcome_keyboard-checkbox"
                    />
                  </div>
                  <p className="welcome_keyboard-lesson-description">{lesson.description}</p>
                  <Link
                    to={lesson.route}
                    state={lesson.state}
                    className="welcome_keyboard-start-btn"
                    onClick={() => handleStartLesson(lesson.id)}
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
