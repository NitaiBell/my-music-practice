// src/practices/melodic_dictation/MelodicDictationContainer.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MelodicDictation from './MelodicDictation';
import MelodicDictationSettings from './MelodicDictationSettings';

const MelodicDictationContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<MelodicDictationSettings />} />
      <Route path="/play" element={<MelodicDictation />} />
      <Route path="*" element={<Navigate to="/melodic-dictation/settings" replace />} />
    </Routes>
  );
};

export default MelodicDictationContainer;
