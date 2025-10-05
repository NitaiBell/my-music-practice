// src/pages/auth/SignUp.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer'; // ✅ Import Footer
import './SignUp.css';

// ✅ נשתמש בכתובת מה־ENV אם קיימת (לפרודקשן), אחרת localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [imageUrl, setImageUrl] = useState('/profiles/mozart-profile.png');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ בדיקות בסיסיות
    if (password !== confirm) {
      alert("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      // ✅ שליחה לשרת (לוקאל או חיצוני)
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Signed up user:', data);
        localStorage.setItem('user', JSON.stringify(data));
        alert(`Welcome, ${data.name}!`);
      } else {
        alert(data.error || 'Signup failed.');
      }
    } catch (err) {
      console.error('❌ Signup error:', err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="light-page">
      <Navbar />

      <div style={{ flexGrow: 1 }}>
        <div className="auth-container">
          <h2>Sign Up</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <button type="submit">Sign Up</button>
          </form>

          <p className="auth-link-text">
            Already have an account?{' '}
            <Link to="/signin" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <Footer /> {/* ✅ sticks to bottom */}
    </div>
  );
}
