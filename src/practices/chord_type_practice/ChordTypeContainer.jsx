// src/practices/chord_type_practice/ChordTypeContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChordTypePractice from './ChordTypePractice';
import ChordTypeSettings from './ChordTypeSettings';

const ChordTypeContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<ChordTypeSettings />} />
      <Route path="/play" element={<ChordTypePractice />} />
      <Route path="*" element={<Navigate to="/chord-type/settings" replace />} />
    </Routes>
  );
};

export default ChordTypeContainer;
