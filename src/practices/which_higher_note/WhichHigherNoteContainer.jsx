// src/practices/which_higher_note/WhichHigherNoteContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WhichHigherNoteSettings from './WhichHigherNoteSettings';
import WhichHigherNote from './WhichHigherNote';

const WhichHigherNoteContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<WhichHigherNoteSettings />} />
      <Route path="/play" element={<WhichHigherNote />} />
      <Route path="*" element={<Navigate to="/which-higher-note/settings" replace />} />
    </Routes>
  );
};

export default WhichHigherNoteContainer;
