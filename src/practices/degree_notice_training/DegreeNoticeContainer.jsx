import React from 'react';
import { useLocation } from 'react-router-dom';
import DegreeNotice from './DegreeNotice';
import DegreeNoticeSettings from './DegreeNoticeSettings';

const DegreeNoticeContainer = () => {
  const location = useLocation();
  const { selectedScales, selectedDegrees, questionStyles } = location.state || {};

  const isGameStarted =
    Array.isArray(selectedScales) && selectedScales.length > 0 &&
    Array.isArray(selectedDegrees) && selectedDegrees.length > 0 &&
    (questionStyles?.scaleToDegree || questionStyles?.scaleToNote);

  return isGameStarted ? (
    <DegreeNotice />
  ) : (
    <DegreeNoticeSettings />
  );
};

export default DegreeNoticeContainer;
