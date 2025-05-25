// src/utils/logPracticeResult.js

export const logPracticeResult = async ({
    gmail,
    practiceName,
    correct,
    wrong,
    tries,
    level,
    rank,
    maxRank,
    rightScore,
    tryScore,
    speedScore,
    avgTimePerAnswer,
  }) => {
    const date = new Date().toISOString();
  
    const payload = {
      gmail,
      practiceName,
      correct,
      wrong,
      tries,
      level,
      rank,
      maxRank,
      rightScore,
      tryScore,
      speedScore,
      avgTimePerAnswer,
      date,
    };
  
    // ✅ Confirm it's called
    console.log('📤 Sending practice result:', payload);
  
    try {
      const response = await fetch('http://localhost:5000/api/practice/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log('✅ Backend response:', result); // Should log: { message: "Practice saved successfully" }
  
    } catch (error) {
      console.error('❌ Error logging practice result:', error);
    }
  };
  