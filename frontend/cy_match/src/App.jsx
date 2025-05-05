import { useState, useEffect } from 'react';
import './App.css';
import JobCard from './components/JobCard';
import { fetchJobs, deleteJob, saveJob } from './services/api';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      const data = await fetchJobs();
      setJobs(data);
      setLoading(false);
    };

    loadJobs();
  }, []);

  const handleSwipeLeft = async (jobId) => {
    await deleteJob(jobId);
    setJobs(jobs.filter((job) => job.id !== jobId));
  };

  const handleSwipeRight = async (jobId) => {
    await saveJob(jobId);
    setJobs(jobs.filter((job) => job.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold">CyMatch</h1>
      </header>

      <main className="p-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-600">No more jobs to show!</p>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          ))
        )}
      </main>
    </div>
  );
}

export default App;
