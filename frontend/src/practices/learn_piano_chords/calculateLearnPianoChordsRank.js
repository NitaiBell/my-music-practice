// utils/calculateLearnPianoChordsRank.js

export function calculateLearnPianoChordsRank({
    selectedScale = 'C',
    selectedChords = [],
    correctCount,
    triesCount,
    rounds,
    totalAnswerTimeSec = 0,
    freestyleMode = false,
  }) {
    // Define diatonic chords for common major scales
    const scaleChordMap = {
      C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
      F: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
      G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
      D: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
      A: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
      E: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
      B: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
    };
  
    // 1. Determine level
    let level = 2;
    const diatonicChords = scaleChordMap[selectedScale] || [];
  
    if (freestyleMode) {
      level = 8;
    } else {
      const uniqueValidChords = selectedChords.filter(c => diatonicChords.includes(c));
      level = Math.max(2, Math.min(7, uniqueValidChords.length));
    }
  
    // 2. Metrics
    const accuracy = correctCount / Math.max(1, rounds); // correctness per round
    const efficiency = rounds / Math.max(1, triesCount); // fewer tries = better
    const avgTime = totalAnswerTimeSec / Math.max(1, triesCount); // seconds per round
  
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
  