import React from 'react';
import { useLocation } from 'react-router-dom';
import IntervalPractice from './IntervalPractice';
import IntervalPracticeSettings from './IntervalPracticeSettings';

const IntervalPracticeContainer = () => {
  const location = useLocation();

  const isGameStarted = Array.isArray(location.state?.selectedIntervals) 
                        && location.state.selectedIntervals.length > 0
                        && typeof location.state.rounds === 'number'
                        && location.state.rounds > 0;

  return isGameStarted
    ? <IntervalPractice />
    : <IntervalPracticeSettings />;
};

export default IntervalPracticeContainer;