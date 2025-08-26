// src/pages/courses/pingpong-melody/PingPongCoursePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
import './PingPongCoursePage.css';

const levels = [
  {
    id: 'level1',
    title: 'Level 1: C and G only',
    description: 'Start building short melodies with just the notes C and G.',
    route: '/real-melody/settings',
    state: {
      selectedNotes: ['C', 'G'],
      rounds: 30,
    },
  },
  {
    id: 'level2',
    title: 'Level 2: C, G, E',
    description: 'Add E to create new melodic contours with three notes.',
    route: '/real-melody/settings',
    state: {
      selectedNotes: ['C', 'G', 'E'],
      rounds: 30,
    },
  },
  {
    id: 'level3',
    title: 'Level 3: Add A',
    description: 'Four-note melodies: expand with A and experiment with steps.',
    route: '/real-melody/settings',
    state: {
      selectedNotes: ['C', 'G', 'E', 'A'],
      rounds: 30,
    },
  },
  {
    id: 'level4',
    title: 'Level 4: Add D',
    description: 'Include D and explore higher range movement.',
    route: '/real-melody/settings',
    state: {
      selectedNotes: ['C', 'G', 'E', 'A', 'D'],
      rounds: 30,
    },
  },
  {
    id: 'level5',
    title: 'Level 4: Add E',
    description: 'Now use C-D-E-F-G-A and start composing more complete motifs.',
    route: '/real-melody/settings',
    state: {
      selectedNotes: ['C', 'G', 'E', 'F', 'A', 'D', 'E'],
      rounds: 30,
    },
  },
    {
    id: 'level6',
    title: 'Level 4: Add B',
    description: 'Now use C-D-E-F-G-A-B and start composing more complete motifs.',
    route: '/real-melody/settings',
    state: {
      selectedNotes: ['C', 'G', 'E','F', 'A', 'D', 'E', 'B'],
      rounds: 30,
    },
  },
];

export default function PingPongCoursePage() {
  const { currentUser } = useAuth();
  const [checkedLessons, setCheckedLessons] = useState({});

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser?.email) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/course-progress/get?email=${currentUser.email}&courseName=pingpong_melody`
        );
        const data = await res.json();
        setCheckedLessons(data || {});
      } catch (err) {
        console.error('❌ Failed to load pingpong melody progress:', err);
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
          courseName: 'pingpong_melody',
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
    <div className="pingpong_melody-wrapper">
      <div className="pingpong_melody-fixed-navbar">
        <Navbar />
      </div>

      <div className="pingpong_melody-scroll-container">
        <div style={{ height: '60px' }} />
        <div className="pingpong_melody-inner-wrapper">
          <div className="pingpong_melody-page">
            <h1 className="pingpong_melody-title">🎵 PingPong Melody Course</h1>
            <p className="pingpong_melody-description">
              Build your melodic instinct step-by-step using limited note sets. Great for beginners in improvisation and melodic composition.
            </p>

            <div className="pingpong_melody-lesson-list">
              {levels.map((lesson) => (
                <div key={lesson.id} className="pingpong_melody-lesson-card">
                  <div className="pingpong_melody-lesson-header">
                    <h2 className="pingpong_melody-lesson-title">{lesson.title}</h2>
                    <input
                      type="checkbox"
                      checked={!!checkedLessons[lesson.id]}
                      onChange={() => toggleLessonCheck(lesson.id)}
                      className="pingpong_melody-checkbox"
                    />
                  </div>
                  <p className="pingpong_melody-lesson-description">{lesson.description}</p>
                  <Link
                    to={lesson.route}
                    state={lesson.state}
                    className="pingpong_melody-start-btn"
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
