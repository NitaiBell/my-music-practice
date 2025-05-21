// src/pages/Home.jsx
import React from "react";
import Navbar from "../components/Navbar"; // Adjust path if needed
import "./Home.css";

const Home = () => {
  return (
    <div className="home-wrapper">
      <Navbar />
      <main className="home-centered">
        <h1 className="home-welcome-text">🎵 Welcome to MyMusic 🎵</h1>
      </main>
    </div>
  );
};

export default Home;
