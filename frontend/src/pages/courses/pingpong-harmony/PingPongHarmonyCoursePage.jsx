// src/pages/courses/pingpong-harmony/PingPongHarmonyCoursePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
// ממחזר את ה-CSS הקיים של פינגפונג מלודי (אותן מחלקות)
import '../ping-pong-melody/PingPongCoursePage.css';

const levels = [
  {
    id: 'pph_level1',
    title: 'Level 1: I–V in C (C, G)',
    description: 'Establish tonal stability: practice moving between tonic and dominant.',
    route: '/harmony/settings',
    state: {
      selectedScale: 'C',
      selectedChords: ['C', 'G'],
      outChords: [],
      rounds: 15,
      specialChordMode: false,
    },
  },
  {
    id: 'pph_level2',
    title: 'Level 2: I–IV–V (C, F, G)',
    description: 'Add the subdominant to create simple cadences.',
    route: '/harmony/settings',
    state: {
      selectedScale: 'C',
      selectedChords: ['C', 'F', 'G'],
      outChords: [],
      rounds: 15,
      specialChordMode: false,
    },
  },
  {
    id: 'pph_level3',
    title: 'Level 3: I–vi–IV–V (C, Am, F, G)',
    description: 'Classic pop progression – smooth, recurring motion.',
    route: '/harmony/settings',
    state: {
      selectedScale: 'C',
      selectedChords: ['C', 'Am', 'F', 'G',],
      outChords: [],
      rounds: 20,
      specialChordMode: false,
    },
  },
  {
    id: 'pph_level4',
    title: 'Level 4: I–vi–IV–V-ii (C, Am, F, G, Dm)',
    description: 'Practice all diatonic triads in C major.',
    route: '/harmony/settings',
    state: {
      selectedScale: 'C',
      selectedChords: ['C', 'Am', 'F', 'G','Dm'],
      outChords: [],
      rounds: 20,
      specialChordMode: false,
    },
  },
  {
    id: 'pph_level5',
    title: 'Level 5: I–vi–IV–V-ii-iii (C, Am, F, G, Dm, Em)',
    description: 'Add secondary dominants as out-of-scale chords and focus on them.',
    route: '/harmony/settings',
    state: {
      selectedScale: 'C',
      selectedChords: ['C', 'Dm', 'Em', 'F', 'G', 'Am'],
      outChords: [],
      rounds: 20,
      specialChordMode: true,
    },
  },
  {
    id: 'pph_level6',
    title: 'Level 5: I–vi–IV–V-ii-iii-Bdim (C, Am, F, G, Dm, Em, Bdim)',
    description: 'Introduce modal mixture with borrowed chords for extra harmonic color.',
    route: '/harmony/settings',
    state: {
      selectedScale: 'C',
      selectedChords: ['C', 'Dm', 'Em', 'F', 'G', 'Am','Bdim'],
      rounds: 20,
      specialChordMode: false,
    },
  },
];


export default function PingPongHarmonyCoursePage() {
  const { currentUser } = useAuth();
  const [checkedLessons, setCheckedLessons] = useState({});

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser?.email) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/course-progress/get?email=${currentUser.email}&courseName=pingpong_harmony`
        );
        const data = await res.json();
        setCheckedLessons(data || {});
      } catch (err) {
        console.error('❌ Failed to load pingpong harmony progress:', err);
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
          courseName: 'pingpong_harmony',
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
      if (newStatus) updated[lessonId] = true;
      else delete updated[lessonId];
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
            <h1 className="pingpong_melody-title">🎼 PingPong Harmony Course</h1>
            <p className="pingpong_melody-description">
              אימון חשיבה פונקציונלית והרמונית בשלבים – דיאטוני, דומיננטות משניות והלוואות מודאליות.
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
