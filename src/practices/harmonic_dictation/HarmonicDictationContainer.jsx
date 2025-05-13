// src/practices/harmonic_dictation/HarmonicDictationContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HarmonicDictation from './HarmonicDictation';
import HarmonicDictationSettings from './HarmonicDictationSettings';

const HarmonicDictationContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<HarmonicDictationSettings />} />
      <Route path="/play" element={<HarmonicDictation />} />
      <Route path="*" element={<Navigate to="/harmonic/settings" replace />} />
    </Routes>
  );
};

export default HarmonicDictationContainer;
