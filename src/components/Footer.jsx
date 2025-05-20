// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="mymusic-footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3>🎵 MyMusic</h3>
          <p>Practice smarter. Play better.</p>
        </div>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/articles">Articles</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <div className="footer-right">
          <p>&copy; {new Date().getFullYear()} MyMusic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
