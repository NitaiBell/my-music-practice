// src/practices/learn_piano/LearnPianoContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LearnPiano from './LearnPiano';
import LearnPianoSettings from './LearnPianoSettings';

const LearnPianoContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<LearnPianoSettings />} />
      <Route path="/play" element={<LearnPiano />} />
      <Route path="*" element={<Navigate to="/learn-piano/settings" replace />} />
    </Routes>
  );
};

export default LearnPianoContainer;
