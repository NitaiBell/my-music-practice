// src/practices/real_melody_training/RealMelodyContainer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import RealMelody from './RealMelody';
import RealMelodySettings from './RealMelodySettings';

const RealMelodyContainer = () => {
  const location = useLocation();
  // assume settings will navigate here with location.state.selectedNotes = [...]
// if you prefer checking rounds/octaves you could use location.state?.rounds > 0
  const isGameStarted = Array.isArray(location.state?.selectedNotes) 
                        && location.state.selectedNotes.length > 0;

  return isGameStarted
    ? <RealMelody />
    : <RealMelodySettings />;
};

export default RealMelodyContainer;
