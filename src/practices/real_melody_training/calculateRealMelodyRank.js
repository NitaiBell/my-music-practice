// utils/calculateRealMelodyRank.js

export function calculateRealMelodyRank({
    selectedNotes = [],
    normalMode = true,
    rounds = 10,
    correctCount = 0,
    triesCount = 1,
    totalAnswerTimeSec = 0,
  }) {
    // 1. Determine Level
    const baseLevel = Math.min(12, new Set(selectedNotes).size);
    const level = baseLevel + (normalMode ? 0 : 1); // Pro mode adds +1
  
    // 2. Metrics
    const accuracy = correctCount / Math.max(1, rounds);
    const efficiency = rounds / Math.max(1, triesCount);
    const avgTime = totalAnswerTimeSec / Math.max(1, triesCount);
  
    // 3. Score Breakdown
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
      level, // 2–13
      score, // 0–100
      max: 100,
      rightScore,
      tryScore,
      speedScore,
      avgTimePerAnswer: +avgTime.toFixed(2),
    };
  }
  