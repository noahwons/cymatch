import React from 'react';

const About = () => {
  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8 text-gray-800">
      <h2 className="text-2xl font-bold mb-4">About CyMatch</h2>
      <p className="mb-2">
        <strong>Course:</strong> SE/COM S 3190 – Construction of User Interfaces, Spring 2025
      </p>
      <p className="mb-2">
        <strong>Team Members:</strong>
      </p>
      <ul className="list-disc list-inside">
        <li>Alexander Ganekov – <a href="mailto:aganekov@iastate.edu" className="text-blue-600 underline">aganekov@iastate.edu</a></li>
        <li>Noah Wons – <a href="mailto:wons123@iastate.edu" className="text-blue-600 underline">wons123@iastate.edu</a></li>
      </ul>
    </div>
  );
};

export default About;
