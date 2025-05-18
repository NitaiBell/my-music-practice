// utils/calculateLearnPianoRank.js
export function calculateLearnPianoRank({
    selectedNotes = [],
    sequenceLength = 5,
    correctCount,
    triesCount,
    rounds,
    totalAnswerTimeSec = 0,
    freestyleMode = false,
  }) {
    // 1. Determine level (2–18)
    const baseLevel = selectedNotes.length + sequenceLength;
    const level = freestyleMode && sequenceLength >= 10
      ? 18
      : Math.max(2, Math.min(18, baseLevel));
  
    // 2. Metrics
    const accuracy = correctCount / Math.max(1, rounds); // correctness per round
    const efficiency = rounds / Math.max(1, triesCount); // fewer tries is better
    const avgTime = totalAnswerTimeSec / Math.max(1, triesCount); // seconds per full round
  
    // 3. Score breakdown
    const rightScore = Math.round(accuracy * 75); // up to 75 pts
    const tryScore = Math.round(efficiency * 15); // up to 15 pts
  
    let speedScore = 0;
    if (avgTime <= 3) speedScore = 10;
    else if (avgTime <= 6) speedScore = 8;
    else if (avgTime <= 9) speedScore = 6;
    else if (avgTime <= 12) speedScore = 4;
    else if (avgTime <= 16) speedScore = 2;
  
    const score = rightScore + tryScore + speedScore;
  
    return {
      level,
      score,
      max: 100,
      rightScore,
      tryScore,
      speedScore,
      avgTimePerAnswer: +avgTime.toFixed(2),
    };
  }