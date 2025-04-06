import React from 'react';
import { useLocation } from 'react-router-dom';
import PingPongMelody from './PingPongMelody';
import PingPongMelodySettings from './PingPongMelodySettings';

const PingPongMelodyContainer = () => {
  const location = useLocation();
  const isGameStarted = location.state?.selectedNotes?.length > 0;

  return isGameStarted ? (
    <PingPongMelody />
  ) : (
    <PingPongMelodySettings />
  );
};

export default PingPongMelodyContainer;
