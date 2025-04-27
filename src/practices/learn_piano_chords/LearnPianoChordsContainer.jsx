// src/practices/learn_piano_chords/LearnPianoChordsContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LearnPianoChords from './LearnPianoChords';
import LearnPianoChordsSettings from './LearnPianoChordsSettings';

const LearnPianoChordsContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<LearnPianoChordsSettings />} />
      <Route path="/play" element={<LearnPianoChords />} />
      <Route path="*" element={<Navigate to="/learn-piano-chords/settings" replace />} />
    </Routes>
  );
};

export default LearnPianoChordsContainer;
