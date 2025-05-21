// src/pages/NitaiPractices.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./nitaipractices.css";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const practices = [
  {
    title: "Learn Piano",
    description: "Play melodies by ear on a visual keyboard.",
    route: "/learn-piano",
  },
  {
    title: "Learn Piano Chords",
    description: "Train your eyes and ears to identify chords.",
    route: "/learn-piano-chords",
  },
  {
    title: "Interval Practice",
    description: "Guess musical distances: up, down, or random.",
    route: "/interval-practice",
  },
  {
    title: "Sing Note",
    description: "Sing a note and let the app detect your pitch.",
    route: "/sing-note",
  },
  {
    title: "Harmony Training",
    description: "Listen and match chords in tonal context.",
    route: "/harmony",
  },
  {
    title: "Real Melody",
    description: "Follow and repeat real musical phrases.",
    route: "/real-melody",
  },
  {
    title: "Degree Notice",
    description: "Recognize degrees and notes in different keys.",
    route: "/degree-notice",
  },
  {
    title: "Chord Type",
    description: "Identify major, minor, and complex chords.",
    route: "/chord-type",
  },
];

export default function NitaiPractices() {
  const navigate = useNavigate();

  return (
    <div className="nitaipractices-wrapper">
      <h2 className="nitaipractices-heading">🎶 Welcome to Nitai's Practice Room</h2>
      <div className="nitaipractices-ad-placeholder">
  <span>Ad Placeholder (728×90)</span>
</div>
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={5000}
        arrows
        showDots
        containerClass="nitaipractices-carousel"
        itemClass="nitaipractices-carousel-item"
      >
        {practices.map((p, index) => (
          <div className="nitaipractices-card" key={index}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <button onClick={() => navigate(p.route)}>Practice →</button>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

