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

  function simplifyDescription(html, maxLen = 150) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    let text = tmp.textContent || tmp.innerText || '';

    text = text.replace(/\s+/g, ' ').trim();

    if (text.length > maxLen) {
      return text.slice(0, maxLen).trimEnd() + '…';
    }
    return text;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{job.title}</h2>
      <h3 className="text-md text-gray-600 mb-2">{job.company}</h3>
      <p className="text-gray-700 mb-4">
        {simplifyDescription(job.description)}
      </p>
      <h3 className="text-md text-gray-600 mb-2">{timeFromNow(job.date)}</h3>
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={onSwipeLeft}
        >
          Dismiss
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={onSwipeRight}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default JobCard;
