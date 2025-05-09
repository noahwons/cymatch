import React from 'react';

const JobCard = ({ job, onSwipeLeft, onSwipeRight }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 h-[360px] max-w-md mx-auto flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-2">{job.title}</h2>
        <h3 className="text-md text-gray-600 mb-2">{job.company}</h3>
        <p className="text-sm text-gray-700">{job.description}</p>
      </div>
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-xl"
          onClick={() => onSwipeLeft(job.id)}
        >
          Dismiss
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-xl"
          onClick={() => onSwipeRight(job.id)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default JobCard;
