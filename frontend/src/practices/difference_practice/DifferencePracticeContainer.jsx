// src/practices/difference_practice/DifferencePracticeContainer.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DifferencePracticeSettings from './DifferencePracticeSettings';
import DifferencePractice from './DifferencePractice';

const DifferencePracticeContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<DifferencePracticeSettings />} />
      <Route path="/play" element={<DifferencePractice />} />
      <Route path="*" element={<Navigate to="/difference/settings" replace />} />
    </Routes>
  );
};

export default DifferencePracticeContainer;
