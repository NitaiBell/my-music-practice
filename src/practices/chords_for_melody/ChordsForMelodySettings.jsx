// src/practices/chords_for_melody/ChordsForMelodySettings.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { melodies } from './melodies'; // Import melodies data
import './ChordsForMelodySettings.css'; // You can create this CSS file later

const ChordsForMelodySettings = () => {
  const navigate = useNavigate();

  // Get all melody names
  const melodyNames = Object.keys(melodies);

  // Local state
  const [selectedMelody, setSelectedMelody] = useState('');
  const [completedMelodies, setCompletedMelodies] = useState(() => {
    // Try to load completed melodies from localStorage if available
    const saved = localStorage.getItem('completedMelodies');
    return saved ? JSON.parse(saved) : {};
  });

  const handleCompletedChange = (melodyName) => {
    const updated = {
      ...completedMelodies,
      [melodyName]: !completedMelodies[melodyName],
    };
    setCompletedMelodies(updated);
    localStorage.setItem('completedMelodies', JSON.stringify(updated));
  };

  const handleStartPractice = () => {
    if (!selectedMelody) {
      alert('Please select a melody to practice.');
      return;
    }
    navigate('/chords-for-melody/practice', {
      state: { selectedMelody },
    });
  };

  return (
    <div className="chords_for_melody_settings_container">
      <h1 className="chords_for_melody_settings_title">Choose a Melody to Practice</h1>

      <div className="chords_for_melody_settings_list">
        {melodyNames.map((melodyName) => (
          <div key={melodyName} className="chords_for_melody_settings_item">
            <label className="chords_for_melody_settings_label">
              <input
                type="radio"
                name="selectedMelody"
                value={melodyName}
                checked={selectedMelody === melodyName}
                onChange={() => setSelectedMelody(melodyName)}
                className="chords_for_melody_settings_radio"
              />
              <span className="chords_for_melody_settings_melody_name">{melodyName}</span>
            </label>

            <label className="chords_for_melody_settings_checkbox_label">
              <input
                type="checkbox"
                checked={completedMelodies[melodyName] || false}
                onChange={() => handleCompletedChange(melodyName)}
                className="chords_for_melody_settings_checkbox"
              />
              <span className="chords_for_melody_settings_checkbox_text">Done</span>
            </label>
          </div>
        ))}
      </div>

      <button
        className="chords_for_melody_settings_start_button"
        onClick={handleStartPractice}
      >
        Start Practice
      </button>
    </div>
  );
};

export default ChordsForMelodySettings;
