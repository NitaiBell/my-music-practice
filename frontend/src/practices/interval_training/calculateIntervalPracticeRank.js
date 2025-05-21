export function calculateIntervalPracticeRank({
    selectedNotes = [],
    selectedIntervals = [],
    correctCount,
    triesCount,
    rounds,
    totalAnswerTimeSec = 0,
  }) {
    const uniqueNotes = [...new Set(selectedNotes)].length;
    const uniqueIntervals = [...new Set(selectedIntervals)].length;
    const level = Math.max(3, Math.min(25, uniqueNotes + uniqueIntervals));
  
    const accuracy = Math.min(1, correctCount / Math.max(1, rounds)); // capped at 1
    const efficiency = Math.min(1, rounds / Math.max(1, triesCount)); // capped at 1
    const avgTime = totalAnswerTimeSec / Math.max(1, triesCount);
  
    const rightScore = Math.round(accuracy * 75);
    const tryScore = Math.round(efficiency * 15);
  
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