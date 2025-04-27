// src/practices/degree_notice_training/DegreeNoticeContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DegreeNotice from './DegreeNotice';
import DegreeNoticeSettings from './DegreeNoticeSettings';

const DegreeNoticeContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<DegreeNoticeSettings />} />
      <Route path="/play" element={<DegreeNotice />} />
      <Route path="*" element={<Navigate to="/degree-notice/settings" replace />} />
    </Routes>
  );
};

export default DegreeNoticeContainer;
