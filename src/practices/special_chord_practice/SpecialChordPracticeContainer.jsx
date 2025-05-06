// src/practices/special_chord_practice/SpecialChordPracticeContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SpecialChordPractice from './SpecialChordPractice';
import SpecialChordPracticeSettings from './SpecialChordPracticeSettings';

const SpecialChordPracticeContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<SpecialChordPracticeSettings />} />
      <Route path="/play" element={<SpecialChordPractice />} />
      <Route path="*" element={<Navigate to="/special_chord/settings" replace />} />
    </Routes>
  );
};

export default SpecialChordPracticeContainer;
