import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleFeedbackClick = () => {
    const subject = encodeURIComponent("Feedback for LikeMozart");
    const body = encodeURIComponent(`Page: ${window.location.origin}${location.pathname}\n\nYour feedback here: `);
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=mozartmozart@gmail.com&su=${subject}&body=${body}`;
    window.open(mailtoLink, "_blank");
  };

  // ✅ Add keyboard shortcut: Shift + G
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleFeedbackClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location]);

  return (
    <div className="user-profile-navbar">
      <div className="navbar-header">
        <div className="navbar-logo">LikeMozart</div>
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
          <a href="/courses">Courses</a>
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
