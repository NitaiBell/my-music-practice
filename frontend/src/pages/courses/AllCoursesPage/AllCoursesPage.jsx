import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import courses from '../../../data/courseList';
import { useAuth } from '../../../context/AuthContext';
import './AllCoursesPage.css';

const AllCoursesPage = () => {
  const { currentUser } = useAuth();
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    const fetchAllProgress = async () => {
      if (!currentUser?.email) return;
      try {
        const res = await fetch(`http://localhost:5000/api/course-progress/all?email=${currentUser.email}`);
        const data = await res.json(); // Format: { welcome_keyboard: {0:true,1:true}, functional_harmony: {0:true} }
        setProgressMap(data || {});
      } catch (err) {
        console.error('❌ Failed to fetch course progress:', err);
      }
    };
    fetchAllProgress();
  }, [currentUser]);

  const getProgressClass = (courseId, totalLessons) => {
    const completed = progressMap[courseId]
      ? Object.values(progressMap[courseId]).filter(val => val === true).length
      : 0;
    if (completed === 0) return 'progress-none';
    if (completed === totalLessons) return 'progress-complete';
    return 'progress-incomplete';
  };

  const getProgressText = (courseId, totalLessons) => {
    const completed = progressMap[courseId]
      ? Object.values(progressMap[courseId]).filter(val => val === true).length
      : 0;
    const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    const symbol = percent === 100 ? '✅' : percent > 0 ? '🔄' : '⬜️';
    return `${symbol} ${completed}/${totalLessons} lessons — ${percent}% complete`;
  };

  return (
    <div className="all_courses-wrapper">
      <div className="all_courses-fixed-navbar">
        <Navbar />
      </div>

      <div className="all_courses-scroll-container">
        <div style={{ height: '60px' }} /> {/* Spacer for fixed navbar */}

        <div className="all_courses-content">
          <h1 className="all_courses-title">🎓 All Courses</h1>
          <p className="all_courses-subtitle">
            Explore our structured learning paths and start practicing with guided lessons.
          </p>

          <div className="all_courses-list">
            {courses.map((course, i) => (
              <div key={i} className="all_courses-card">
                <h2 className="all_courses-card-title">{course.title}</h2>
                <p className="all_courses-card-description">{course.description}</p>
                <p className={`all_courses-card-progress ${getProgressClass(course.id, course.totalLessons)}`}>
                  {getProgressText(course.id, course.totalLessons)}
                </p>
                <Link to={course.route} className="all_courses-card-button">
                  ▶️ Go to Course
                </Link>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AllCoursesPage;
