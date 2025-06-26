// src/pages/school/School.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './School.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = 'http://localhost:5000';

const School = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [teacherEmail, setTeacherEmail] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [linkedTeachers, setLinkedTeachers] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/teacher-student/students?teacherEmail=${encodeURIComponent(currentUser.email)}`
      );
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/teacher-student/teacher?studentEmail=${encodeURIComponent(currentUser.email)}`
      );
      const data = await res.json();
      setLinkedTeachers(data || []);
    } catch (err) {
      console.error('Error loading linked teachers:', err);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchStudents();
      fetchTeachers();
    }
  }, [currentUser]);

  const handleSubmit = async (role) => {
    const initiatorEmail = currentUser.email;
    const targetEmail = role === 'teacher' ? studentEmail : teacherEmail;

    try {
      const res = await fetch(`${BACKEND_URL}/api/teacher-student/propose-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initiatorEmail, targetEmail, role }),
      });

      const data = await res.json();
      setMessage(data.message || 'Link proposal sent.');
      setStudentEmail('');
      setTeacherEmail('');
      fetchStudents();
      fetchTeachers();
    } catch (err) {
      console.error('Linking error:', err);
      setMessage('Something went wrong.');
    }
  };

  const handleViewLog = (studentEmail) => {
    navigate(`/school/log/${encodeURIComponent(studentEmail)}`);
  };

  return (
    <div className="school-wrapper">
      <div className="school-fixed-navbar">
        <Navbar />
      </div>

      <div className="school-scroll-container">
        <div style={{ height: '60px' }} /> {/* Spacer under fixed navbar */}

        <div className="school-inner-wrapper">
          <div className="school-content">
            <h2>🎓 School {currentUser?.email ? 'Management' : ''}</h2>

            {!currentUser?.email ? (
              <>
                <p className="school-not-logged-in-message">
                  You must be signed in to use this feature. Please sign in or create an account.
                </p>
                <p className="school-not-logged-in-description">
                  This page lets teachers and students connect and share practice logs.
                  <br /><br />
                  👉 <strong>Teachers</strong> can manage a list of their students and view their progress.<br />
                  👉 <strong>Students</strong> can link to their teacher and share their practice results automatically.
                  <br /><br />
                  Signing in is quick and gives access to helpful tools for collaborative music learning.
                </p>
              </>
            ) : (
              <>
                <p className="school-explanation">
                  This page lets teachers and students connect to share practice logs.
                  <br /><br />
                  👉 <strong>If you're a student</strong>, enter your teacher's email under <em>"I am a student of"</em>.<br />
                  👉 <strong>If you're a teacher</strong>, enter your student's email under <em>"I am a teacher of"</em>.<br /><br />
                  Once both sides confirm the link, the teacher will be able to view the student’s practice logs.
                </p>

                {linkedTeachers.length > 0 && (
                  <div className="school-linked-message">
                    ✅ You are a student of:
                    <ul>
                      {linkedTeachers.map(({ name, email }) => (
                        <li key={email}>
                          <strong>{name}</strong> ({email})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="school-section">
                  <label>I am a student of:</label>
                  <input
                    type="email"
                    placeholder="Teacher's email"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                  />
                  <button onClick={() => handleSubmit('student')}>Submit</button>
                </div>

                <div className="school-section">
                  <label>I am a teacher of:</label>
                  <input
                    type="email"
                    placeholder="Student's email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                  <button onClick={() => handleSubmit('teacher')}>Submit</button>
                </div>

                {message && <div className="school-message">{message}</div>}

                <div className="school-student-list">
                  <h3>My Students</h3>
                  {students.length === 0 ? (
                    <p className="school-empty">No students yet</p>
                  ) : (
                    students.map(({ name, email }) => (
                      <button
                        key={email}
                        className="school-student-button"
                        onClick={() => handleViewLog(email)}
                      >
                        {name} ({email})
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default School;
