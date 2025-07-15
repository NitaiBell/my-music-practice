import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import courses from '../../../data/courseList';
import './AllCoursesPage.css';

const AllCoursesPage = () => {
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
