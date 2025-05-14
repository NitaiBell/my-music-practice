export function calculateDegreeNoticeRank({
    selectedScales,
    selectedDegrees,
    correctCount,
    triesCount,
    rounds,
    totalTimeSec
  }) {
    // Cap logic by how many degrees were tested
    const maxRankByDegreeCount = {
      1: 200,
      2: 250,
      3: 300,
      4: 340,
      5: 370,
      6: 400,
      7: 430, // full major scale degrees
    };
  
    const degreeCount = selectedDegrees.length;
    const maxRank = maxRankByDegreeCount[degreeCount] || 200;
  
    // Difficulty based on # of scales and degrees
    const scaleFactor = Math.min(1, selectedScales.length / 6);   // Max boost at 6+ scales
    const degreeFactor = Math.min(1, degreeCount / 7);            // Max boost at 7 degrees
    const difficultyFactor = (scaleFactor + degreeFactor) / 2;
  
    const accuracy = correctCount / rounds;
    const efficiency = rounds / triesCount;
  
    const avgTime = totalTimeSec / triesCount;
    const speedFactor = Math.max(0, (6 - avgTime) / 6);           // Lower time = higher score
  
    const timePenalty = Math.min(1, totalTimeSec / (rounds * 10)); // Cap at 1 (10s per round avg)
  
    // Rank formula
    const rawScore =
      100 +
      200 * difficultyFactor * accuracy +
      100 * efficiency +
      100 * speedFactor * (1 - timePenalty);
  
    const finalScore = Math.min(maxRank, Math.round(rawScore));
  
    return {
      score: finalScore,
      max: maxRank,
      avgTimePerAnswer: Number(avgTime.toFixed(2)),
    };
  }
  