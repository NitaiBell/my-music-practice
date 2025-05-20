// utils/calculateMelodicDictationRank.js

export function calculateMelodicDictationRank({
    selectedNotes = [],
    sequenceLength = 4,
    rounds = 5,
    correctCount = 0,
    triesCount = 0,
    totalAnswerTimeSec = 0,
    difficulty = 'normal',
  }) {
    // 1. Determine difficulty multiplier
    const difficultyMap = {
      normal: 1,
      hard: 2,
      master: 3,
    };
    const diffMultiplier = difficultyMap[difficulty] || 1;
  
    // 2. Calculate level (2–25)
    const uniqueNotesCount = [...new Set(selectedNotes)].length;
    const cappedSequenceLength = Math.min(sequenceLength, 10);
    const level = Math.max(2, Math.min(25, uniqueNotesCount + cappedSequenceLength));
  
    // 3. Score metrics
    const accuracy = correctCount / Math.max(1, rounds);
    const efficiency = rounds / Math.max(1, triesCount);
    const avgTime = totalAnswerTimeSec / Math.max(1, triesCount);
  
    // 4. Score breakdown
    const rightScore = Math.round(accuracy * 75);
    const tryScore = Math.round(efficiency * 15);
  
    let speedScore = 0;
    if (avgTime <= 3) speedScore = 10;
    else if (avgTime <= 6) speedScore = 8;
    else if (avgTime <= 9) speedScore = 6;
    else if (avgTime <= 12) speedScore = 4;
    else if (avgTime <= 16) speedScore = 2;
  
    const rawScore = rightScore + tryScore + speedScore;
    const score = Math.round(rawScore * diffMultiplier);
    const cappedScore = Math.min(score, 100);
  
    return {
      level,
      score: cappedScore,
      max: 100,
      rightScore,
      tryScore,
      speedScore,
      avgTimePerAnswer: +avgTime.toFixed(2),
    };
  }