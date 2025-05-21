// pages/auth/SignIn.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar'; // ✅ import navbar
import './SignIn.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign In:', { email, password });
    // later: send to backend
  };

  return (
    <div className="light-page">
      <Navbar /> {/* ✅ navbar at the top */}

      <div className="auth-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
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
          <button type="submit">Sign In</button>
        </form>

        <p className="auth-link-text">
          Not signed up yet? <Link to="/signup" className="auth-link">Click here</Link>
        </p>
      </div>
    </div>
  );
}
