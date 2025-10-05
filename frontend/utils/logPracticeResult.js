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
  sessionTime,
}) => {
  const date = new Date().toISOString();

  // ✅ בדיקה: תראה מה באמת הערך
  console.log('🌍 VITE_API_URL:', import.meta.env.VITE_API_URL);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  console.log('🚀 Using API_BASE_URL:', API_BASE_URL);

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
    sessionTime,
    date,
  };

  console.log('📤 Sending practice result:', payload);

  try {
    const response = await fetch(`${API_BASE_URL}/api/practice/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('✅ Backend response:', result);
  } catch (error) {
    console.error('❌ Error logging practice result:', error);
  }
};
