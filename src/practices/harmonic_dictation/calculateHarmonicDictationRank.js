export function calculateHarmonicDictationRank({
    selectedChords,
    correctCount,
    triesCount,
    totalAnswerTimeSec,
    rounds,
    hasSpecialChords = false,
  }) {
    const rawChordCount = selectedChords.length;
    const chordCount = hasSpecialChords ? 8 : rawChordCount;
  
    // Level 2–8
    const level = hasSpecialChords ? 8 : Math.max(2, Math.min(7, chordCount));
    const maxBaseRank = 100;
  
    // Accuracy is now based on rounds, not tries
    const accuracyFactor = correctCount / Math.max(1, rounds);
    const avgTimePerAnswer = totalAnswerTimeSec / Math.max(1, triesCount);
    const expectedTime = 2 + 1.6 * chordCount;
  
    // Speed and penalty logic
    const speedFactor = Math.max(0, (expectedTime - avgTimePerAnswer) / expectedTime);
    const timePenalty = Math.min(1, totalAnswerTimeSec / (triesCount * expectedTime * 1.5));
  
    // 1. Right/Wrong → up to 75 points
    const rightScore = Math.round(75 * accuracyFactor);
  
    // 2. Tries → up to 15 points, subtract 1 per extra try
    const extraTries = Math.max(0, triesCount - correctCount);
    const tryScore = Math.max(0, 15 - extraTries);
  
    // 3. Speed → up to 10 points
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
  