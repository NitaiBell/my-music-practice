// src/practices/write_notes_practice/WriteNotesPracticeContainer.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WriteNotesSettings from './WriteNotesSettings';
import WriteNotesPractice from './WriteNotesPractice';

const WriteNotesPracticeContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<WriteNotesSettings />} />
      <Route path="/play" element={<WriteNotesPractice />} />
      <Route path="*" element={<Navigate to="/write-notes/settings" replace />} />
    </Routes>
  );
};

export default WriteNotesPracticeContainer;
