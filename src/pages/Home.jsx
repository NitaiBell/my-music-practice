import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">🎵 Welcome to Music Practice</h1>
      <p className="home-description">
        Train your ears and improve your musicianship with interactive note and chord exercises.
      </p>
      <button className="home-button" onClick={() => navigate("/play")}>
        Start Practicing
      </button>
    </div>
  );
};

export default Home;
