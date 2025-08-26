// src/pages/about/About.jsx
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './About.css';

export default function About() {
  return (
    <div className="light-page">
      <Navbar />
      <div className="about-content">
        <h1>About LikeMozart</h1>
        <p>
          LikeMozart is an interactive platform designed to help musicians improve their skills in ear training, theory, and instrumental practice. Whether you're a beginner or a seasoned musician, our exercises and courses are built to support you.
        </p>
        <p>
          Explore a variety of practice modes, learn at your own pace, and track your progress as you grow musically.
        </p>
      </div>
      <Footer />
    </div>
  );
}
