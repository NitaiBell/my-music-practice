// src/practices/harmony_training/PingPongHarmonyContainer.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PingPongHarmony from './PingPongHarmony';
import PingPongHarmonySettings from './PingPongHarmonySettings';

const PingPongHarmonyContainer = () => {
  return (
    <Routes>
      <Route path="/settings" element={<PingPongHarmonySettings />} />
      <Route path="/play" element={<PingPongHarmony />} />
      <Route path="*" element={<Navigate to="/harmony/settings" replace />} />
    </Routes>
  );
};

export default PingPongHarmonyContainer;
