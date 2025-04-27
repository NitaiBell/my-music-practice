// src/practices/real_melody_training/RealMelodyContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RealMelody from './RealMelody';
import RealMelodySettings from './RealMelodySettings';

const RealMelodyContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<RealMelodySettings />} />
      <Route path="/play" element={<RealMelody />} />
      <Route path="*" element={<Navigate to="/real-melody/settings" replace />} />
    </Routes>
  );
};

export default RealMelodyContainer;
