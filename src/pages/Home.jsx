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

      <div className="home-buttons">
        <button
          className="home-button practice"
          onClick={() => navigate("/play")}
        >
          Start Practicing
        </button>
        <button
          className="home-button melody"
          onClick={() => navigate("/melody")}
        >
          Ping Pong Melody
        </button>
      </div>
    </div>
  );
};

export default Home;

