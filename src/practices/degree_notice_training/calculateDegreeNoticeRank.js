export function calculateDegreeNoticeRank({
  selectedScales,
  selectedDegrees,
  correctCount,
  triesCount,
  rounds,
  totalTimeSec
}) {
  const scaleCount = selectedScales.length;
  const degreeCount = selectedDegrees.length;
  const level = Math.min(12, Math.max(1, scaleCount));

  // Accuracy (0–75)
  const accuracy = correctCount / rounds;
  const rightScore = Math.round(accuracy * 75);

  // Efficiency (0–15)
  const efficiency = rounds / Math.max(triesCount, rounds);
  const tryScore = Math.round(efficiency * 15);

  // Speed (0–10)
  const avgTime = totalTimeSec / Math.max(triesCount, 1);
  let speedScore = 0;
  if (avgTime <= 3) speedScore = 10;
  else if (avgTime <= 5) speedScore = 8;
  else if (avgTime <= 6.5) speedScore = 6;
  else if (avgTime <= 8) speedScore = 4;
  else if (avgTime <= 10) speedScore = 2;
  else speedScore = 0;

  const score = rightScore + tryScore + speedScore;

  return {
    score,
    max: 100,
    level,
    rightScore,
    tryScore,
    speedScore,
    avgTimePerAnswer: Number(avgTime.toFixed(2))
  };
}