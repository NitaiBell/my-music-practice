// Updated calculateDifferenceRank.js

export function calculateDifferenceRank({
    selectedNotes,
    sequenceLength,
    correctCount,
    triesCount,
    rounds,
    totalAnswerTimeSec,
  }) {
    // Level is sequenceLength (capped between 2–8)
    const level = Math.max(2, Math.min(8, sequenceLength));
  
    // Component scores
    const accuracyScore = Math.round((correctCount / rounds) * 75);
    const tryScore = Math.round(Math.max(0, (rounds / triesCount) * 15));
  
    const avgTime = totalAnswerTimeSec / Math.max(1, triesCount);
    const expectedTime = 2 + sequenceLength * 1.5;
    const speedScore = Math.round(
      Math.max(0, ((expectedTime - avgTime) / expectedTime) * 10)
    );
  
    const totalScore = accuracyScore + tryScore + speedScore;
  
    return {
      score: totalScore,
      max: 100,
      avgTimePerAnswer: Number(avgTime.toFixed(2)),
      rightScore: accuracyScore,
      tryScore,
      speedScore,
      level,
    };
  }