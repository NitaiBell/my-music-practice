import React from 'react';
import './Navbar.css';

export default function Navbar() {
  return (
    <div className="user-profile-navbar">
      <div className="navbar-logo">MyMusic</div>

      <div className="navbar-links-group">
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/practices-showcase">Practices</a>
          <a href="/course/1">Courses</a>
          <a href="/articles">Articles</a>
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