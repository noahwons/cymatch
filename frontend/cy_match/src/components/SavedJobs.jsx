import React from 'react';

const SavedJobs = ({ savedJobs }) => {

  // TODO: Create get for all saved jobs in server.js


  return (
    <div className="relative w-full max-w-md h-[600px] mx-auto">
      <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <p className="text-gray-600">You haven’t saved any jobs yet.</p>
      ) : (
        savedJobs.map((job) => (
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2">{job.title}</h2>
            <h3 className="text-md text-gray-600 mb-2">{job.company}</h3>
            <div className="flex justify-between">

            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobs;
