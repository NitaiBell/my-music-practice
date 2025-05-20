// src/pages/auth/SignUp.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './SignUp.css';

export default function SignUp() {
  const [name, setName] = useState('');       // ✅ Name state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords don't match");
      return;
    }

    // Later: send this data to backend
    console.log('Sign Up:', { name, email, password });
  };

  return (
    <div className="light-page">
      <Navbar />

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
          Already have an account? <Link to="/signin" className="auth-link">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
