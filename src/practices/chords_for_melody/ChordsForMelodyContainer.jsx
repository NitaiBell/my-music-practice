// src/practices/chords_for_melody/ChordsForMelodyContainer.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChordsForMelodySettings from './ChordsForMelodySettings';
import ChordsForMelodyPractice from './ChordsForMelodyPractice';

const ChordsForMelodyContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<ChordsForMelodySettings />} />
      <Route path="/practice" element={<ChordsForMelodyPractice />} />
      <Route path="*" element={<Navigate to="/chords-for-melody/settings" replace />} />
    </Routes>
  );
};

export default ChordsForMelodyContainer;
