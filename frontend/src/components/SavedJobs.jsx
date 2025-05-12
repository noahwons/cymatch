import React from 'react';
import { useState, useEffect } from 'react';


const SavedJobs = ({ }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  function getSavedJobs() {
    fetch('http://localhost:8080/jobs/saved')
      .then((response) => response.json())
      .then((data) => {
        setSavedJobs(data);
        setLoading(false);

      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }

  const handleDismiss = async (jobId) => {
    console.log("About to dismiss job with id:", jobId);
    try {
      const res = await fetch(`http://127.0.0.1:8080/job/${jobId}/dismiss`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }
      const savedObj = await res.json();
      console.log('Dissmissed result:', savedObj);

    } catch (err) {
      console.error('Error dismissing job:', err);
      alert(`Error dismissing job: ${err.message}`);
    }
  };

  const handleRemove = async (jobId) => {
    await handleDismiss(jobId);
    getSavedJobs();
  };

  useEffect(() => {
    getSavedJobs();
  }, []);

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
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded"
                onClick={() => window.open(job.url, '_blank')}
              >Visit
              </button>
              <button
                className="px-4 py-2 bg-red-700 text-white rounded"
                onClick={() => handleRemove(job._id)}
              >Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobs;
