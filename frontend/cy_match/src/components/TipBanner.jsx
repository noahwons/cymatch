import React, { useEffect, useState } from 'react';

const tips = [
  "Tailor your resume for each job.",
  "Always follow up after an interview.",
  "Keep your LinkedIn profile updated.",
  "Practice whiteboard coding problems.",
  "Research the company before applying.",
  "Build a portfolio of personal projects.",
  "Ask thoughtful questions in interviews.",
  "Highlight your soft skills too."
];

const TipBanner = () => {
  const [tip, setTip] = useState('');

  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow">
      <p><strong>Daily Tip:</strong> {tip}</p>
    </div>
  );
};

export default TipBanner;
