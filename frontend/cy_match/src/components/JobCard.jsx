import React from 'react';

const JobCard = ({ job, onSwipeLeft, onSwipeRight }) => {
  function timeFromNow(input) {
    const now = new Date();
    const past = input instanceof Date ? input : new Date(input);
    const delta = now - past;
    const secs = Math.floor(delta / 1000);
    const mins = Math.floor(secs / 60);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hrs > 0) {
      return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    } else if (mins > 0) {
      return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    } else {
      return `${secs} second${secs !== 1 ? 's' : ''} ago`;
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{job.title}</h2>
      <h3 className="text-md text-gray-600 mb-2">{job.company}</h3>
      <img src={job.image} alt={job.title} className="w-full h-48 object-cover rounded-lg mb-4" />
      <h3 className="text-md text-gray-600 mb-2">{timeFromNow(job.date)}</h3>
      <div className="flex justify-between">
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
