export function calculateHarmonicDictationRank({
    selectedChords,
    correctCount,
    triesCount,
    totalAnswerTimeSec,
    hasSpecialChords = false,
  }) {
    const rawChordCount = selectedChords.length;
    const chordCount = hasSpecialChords ? 8 : rawChordCount;
  
    // Level 2–8
    const level = hasSpecialChords ? 8 : Math.max(2, Math.min(7, chordCount));
    const maxBaseRank = 100;
  
    // Difficulty scaling: 2 chords = 0, 8 chords = 1
    const difficultyFactor = Math.min(1, (chordCount - 2) / 6);
  
    // Core metrics
    const accuracyFactor = correctCount / Math.max(1, triesCount);
    const avgTimePerAnswer = totalAnswerTimeSec / Math.max(1, triesCount);
    const expectedTime = 2 + 1.6 * chordCount;
  
    // Speed and penalty
    const speedFactor = Math.max(0, (expectedTime - avgTimePerAnswer) / expectedTime);
    const timePenalty = Math.min(1, totalAnswerTimeSec / (triesCount * expectedTime * 1.5));
  
    // Final weights (accuracy: 75%, efficiency: 15%, speed: 10%)
    const rightScore = Math.round(75 * accuracyFactor);
    const tryScore = Math.round(15 * (chordCount / Math.max(triesCount, 1)));
    const speedScore = Math.round(10 * speedFactor * (1 - timePenalty));
  
    const score = Math.min(maxBaseRank, rightScore + tryScore + speedScore);
  
    return {
      score,
      max: maxBaseRank,
      level,
      rightScore,
      tryScore,
      speedScore,
      avgTimePerAnswer: Number(avgTimePerAnswer.toFixed(2)),
    };
  }
  