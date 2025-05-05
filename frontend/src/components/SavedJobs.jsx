import React from 'react';

const SavedJobs = ({ savedJobs }) => {
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <p className="text-gray-600">You haven’t saved any jobs yet.</p>
      ) : (
        savedJobs.map((job) => (
          <div key={job.id} className="bg-white shadow-md rounded-xl p-4 mb-4">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-700 mt-2">{job.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobs;
