// src/practices/interval_training/IntervalPracticeContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import IntervalPractice from './IntervalPractice';
import IntervalPracticeSettings from './IntervalPracticeSettings';

const IntervalPracticeContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<IntervalPracticeSettings />} />
      <Route path="/play" element={<IntervalPractice />} />
      <Route path="*" element={<Navigate to="/interval-practice/settings" replace />} />
    </Routes>
  );
};

export default IntervalPracticeContainer;
