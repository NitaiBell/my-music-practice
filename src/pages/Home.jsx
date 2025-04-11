import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">
      <h1 className="welcome-heading">🎶 Music Practice App</h1>
      <p className="welcome-text">
        Sharpen your ears, train your fingers, and master musical patterns.
      </p>

      <section className="button-stack">
        <button className="action-btn orange-btn" onClick={() => navigate("/play")}>
          Start Practicing
        </button>
        <button className="action-btn teal-btn" onClick={() => navigate("/melody")}>
          Ping Pong Melody
        </button>
        <button className="action-btn purple-btn" onClick={() => navigate("/keyboard")}>
          Keyboard for All
        </button>
        <button className="action-btn blue-btn" onClick={() => navigate("/staff")}>
          Musical Staff
        </button>
      </section>
    </main>
  );
};

export default Home;


