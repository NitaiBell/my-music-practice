import React from 'react';
import { Link } from 'react-router-dom';
import './CourseLessonCard.css';

export default function CourseLessonCard({ lesson }) {
  return (
    <div className="course-lesson-card">
      <h2>{lesson.title}</h2>
      <p>{lesson.description}</p>
      <Link
        to={lesson.route}
        state={lesson.state}
        className="start-lesson-btn"
      >
        ▶️ Start Lesson
      </Link>
    </div>
  );
}
