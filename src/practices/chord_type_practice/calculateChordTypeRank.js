export function calculateChordTypeRank({
    selectedChordTypes,
    correctCount,
    triesCount,
    rounds,
    totalTimeSec,
  }) {
    const maxRankByChordCount = {
      2: 200,
      3: 250,
      4: 300,
      5: 340,
      6: 370,
      7: 400,
      8: 420,
      9: 440,
      10: 470,
      11: 490,
      12: 500,
    };
  
    const chordCount = selectedChordTypes.length;
    const maxRank = maxRankByChordCount[chordCount] || 200;
  
    const difficultyFactor = (chordCount - 1) / 11; // 0 to 1
    const accuracyFactor = correctCount / rounds;
    const efficiencyFactor = rounds / triesCount;
    const avgTimePerAnswer = totalTimeSec / triesCount;
    const speedFactor = Math.max(0, (6 - avgTimePerAnswer) / 6);
    const timePenalty = Math.min(1, totalTimeSec / (rounds * 10));
  
    const rawScore =
      100 +
      200 * difficultyFactor * accuracyFactor +
      100 * efficiencyFactor +
      100 * speedFactor * (1 - timePenalty);
  
    const finalScore = Math.min(maxRank, Math.round(rawScore));
  
    return {
      score: finalScore,
      max: maxRank,
      avgTimePerAnswer: Number(avgTimePerAnswer.toFixed(2)),
    };
  }
  