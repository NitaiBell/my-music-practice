// src/practices/learn_piano/LearnPianoContainer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import LearnPiano from './LearnPiano';
import LearnPianoSettings from './LearnPianoSettings';

const LearnPianoContainer = () => {
  const location = useLocation();

  const isGameStarted = Array.isArray(location.state?.selectedNotes) &&
                        location.state.selectedNotes.length > 0;

  return isGameStarted
    ? <LearnPiano />
    : <LearnPianoSettings />;
};

export default LearnPianoContainer;
