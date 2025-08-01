import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="user-profile-navbar">
      <div className="navbar-header">
        <div className="navbar-logo">MyMusic</div>
        <div
          className="navbar-hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </div>
      </div>

      <div className={`navbar-links-group ${isMenuOpen ? 'open' : ''}`}>
        <div className="navbar-links">
          <a href="/">Home</a>
<a href="/keyboard" target="_blank" rel="noopener noreferrer">Keyboard</a>
          <a href="/practices-showcase">Practices</a>
          <a href="/courses">Courses</a> {/* ✅ Updated line */}
          <a href="/articles">Articles</a>
          <a href="/school" className="navbar-school-link">School</a>
          <a href="/about">About</a>
          <a href="/signin" className="navbar-signin-button">Sign In</a>
        </div>
        <div className="navbar-profile">
          <a href="/profile" className="navbar-profile-link">Profile</a>
        </div>
      </div>
    </div>
  );
}
