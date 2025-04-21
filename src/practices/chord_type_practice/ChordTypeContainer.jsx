import React from 'react';
import { useLocation } from 'react-router-dom';
import ChordTypePractice from './ChordTypePractice';
import ChordTypeSettings from './ChordTypeSettings';

const ChordTypeContainer = () => {
  const location = useLocation();
  const isGameStarted = location.state?.selectedChordTypes?.length > 0;

  return isGameStarted ? (
    <ChordTypePractice />
  ) : (
    <ChordTypeSettings />
  );
};

export default ChordTypeContainer;
