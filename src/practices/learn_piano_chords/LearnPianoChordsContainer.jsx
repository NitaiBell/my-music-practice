import React from 'react';
import { useLocation } from 'react-router-dom';
import LearnPianoChords from './LearnPianoChords';
import LearnPianoChordsSettings from './LearnPianoChordsSettings';

const LearnPianoChordsContainer = () => {
  const location = useLocation();
  const isGameStarted = location.state?.selectedChords?.length > 0;

  return isGameStarted ? (
    <LearnPianoChords />
  ) : (
    <LearnPianoChordsSettings />
  );
};

export default LearnPianoChordsContainer;
