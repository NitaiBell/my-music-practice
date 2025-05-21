export function calculateChordTypeRank({
  selectedChordTypes,
  correctCount,
  triesCount,
  rounds,
  totalTimeSec,
}) {
  const chordCount = selectedChordTypes.length;

  // LEVEL: from 2 to 12 based on chords
  const level = chordCount < 3 ? 2 : Math.min(12, chordCount);

  // 1. Right/Wrong (75 points)
  const rightRatio = correctCount / Math.max(1, rounds);
  const rightScore = Math.round(rightRatio * 75);

  // 2. Tries (15 points) → full if 1 try per round, reduced if extra tries
  const tryRatio = rounds / Math.max(1, triesCount);
  const tryScore = Math.round(Math.min(1, tryRatio) * 15);

  // 3. Speed (10 points)
  const avgTimePerAnswer = totalTimeSec / Math.max(1, triesCount);
  let speedScore;
  if (avgTimePerAnswer <= 3) speedScore = 10;
  else if (avgTimePerAnswer >= 10) speedScore = 1;
  else speedScore = 10 - ((avgTimePerAnswer - 3) / 7) * 9;
  speedScore = Math.round(Math.max(1, Math.min(10, speedScore)));

  const totalScore = Math.min(100, rightScore + tryScore + speedScore);

  return {
    level,
    score: totalScore,
    max: 100,
    avgTimePerAnswer: Number(avgTimePerAnswer.toFixed(2)),
    rightScore,
    tryScore,
    speedScore,
  };
}
