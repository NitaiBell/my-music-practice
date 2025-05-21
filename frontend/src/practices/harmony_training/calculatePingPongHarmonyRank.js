export function calculatePingPongHarmonyRank({
    selectedChords,
    correctCount,
    triesCount,
    rounds,
    totalAnswerTimeSec,
    hasSpecialChords = false,
  }) {
    const chordCount = hasSpecialChords ? 8 : selectedChords.length;
    const level = hasSpecialChords ? 8 : Math.max(2, Math.min(7, chordCount));
    const maxScore = 100; // ✅ Fixed max score for all levels
  
    // ───── Right/Wrong Score (0–75) ─────
    const accuracy = correctCount / Math.max(1, rounds);
    const rightScore = Math.round(accuracy * 75);
  
    // ───── Try Efficiency Score (0–15) ─────
    const efficiency = rounds / Math.max(1, triesCount);
    const tryScore = Math.round(efficiency * 15);
  
    // ───── Speed Score (0–10) ─────
    const avgTime = totalAnswerTimeSec / Math.max(1, triesCount);
    let speedScore = 0;
    if (avgTime <= 3) speedScore = 10;
    else if (avgTime <= 6) speedScore = 8;
    else if (avgTime <= 9) speedScore = 6;
    else if (avgTime <= 12) speedScore = 4;
    else if (avgTime <= 16) speedScore = 2;
  
    // ───── Final Score (0–100) ─────
    const score = Math.min(100, rightScore + tryScore + speedScore);
  
    return {
      level,
      score,
      max: maxScore,
      rightScore,
      tryScore,
      speedScore,
      avgTimePerAnswer: +avgTime.toFixed(2),
    };
  }
  