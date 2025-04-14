import React from 'react';
import { useLocation } from 'react-router-dom';
import PingPongHarmony from './PingPongHarmony';
import PingPongHarmonySettings from './PingPongHarmonySettings';

const PingPongHarmonyContainer = () => {
  const location = useLocation();
  const isGameStarted = location.state?.selectedChords?.length > 0;

  return isGameStarted ? (
    <PingPongHarmony />
  ) : (
    <PingPongHarmonySettings />
  );
};

export default PingPongHarmonyContainer;
