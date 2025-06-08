// src/practices/chords_for_melody/ChordsForMelodySettings.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { melodies } from './melodies';
import './ChordsForMelodySettings.css';

const ChordsForMelodySettings = () => {
  const navigate = useNavigate();
  const melodyKeys = Object.keys(melodies);

  const [selectedMelody, setSelectedMelody] = useState('');
  const [completedMelodies, setCompletedMelodies] = useState(() => {
    const saved = localStorage.getItem('completedMelodies');
    return saved ? JSON.parse(saved) : {};
  });

  const handleCompletedChange = (melodyKey) => {
    const updated = {
      ...completedMelodies,
      [melodyKey]: !completedMelodies[melodyKey],
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
    <div className="chords_for_melody_settings_fullscreen">
      <div className="chords_ads_side chords_ads_left">Ad</div>

      <div className="chords_for_melody_settings_container">
        <h1 className="chords_for_melody_settings_title">Choose a Melody to Practice</h1>

        <div className="chords_for_melody_settings_list">
          {melodyKeys.map((melodyKey) => {
            const { name, description } = melodies[melodyKey];
            return (
              <div key={melodyKey} className="chords_for_melody_settings_item">
                <div className="chords_for_melody_settings_text_column">
                  <label className="chords_for_melody_settings_label">
                    <input
                      type="radio"
                      name="selectedMelody"
                      value={melodyKey}
                      checked={selectedMelody === melodyKey}
                      onChange={() => setSelectedMelody(melodyKey)}
                      className="chords_for_melody_settings_radio"
                    />
                    <span className="chords_for_melody_settings_melody_name">{name}</span>
                  </label>
                  <div className="chords_for_melody_settings_melody_description">
                    {description}
                  </div>

                  {selectedMelody === melodyKey && (
                    <button
                      className="chords_for_melody_settings_start_button_inline"
                      onClick={handleStartPractice}
                    >
                      Start Practice
                    </button>
                  )}
                </div>

                <label className="chords_for_melody_settings_checkbox_label">
                  <input
                    type="checkbox"
                    checked={completedMelodies[melodyKey] || false}
                    onChange={() => handleCompletedChange(melodyKey)}
                    className="chords_for_melody_settings_checkbox"
                  />
                  <span className="chords_for_melody_settings_checkbox_text">Done</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chords_ads_side chords_ads_right">Ad</div>
    </div>
  );
};

export default ChordsForMelodySettings;
