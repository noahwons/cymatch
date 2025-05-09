import { useState, useEffect } from 'react';
import './App.css';
import JobCard from './components/JobCard';
import SavedJobs from './components/SavedJobs';
import Profile from './components/Profile';
import TipBanner from './components/TipBanner';
import { fetchJobs, deleteJob, saveJob } from './services/api';

function App() {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');

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
    const jobToSave = jobs.find((job) => job.id === jobId);
    if (jobToSave) {
      setSavedJobs([...savedJobs, jobToSave]);
    }
    await saveJob(jobId);
    setJobs(jobs.filter((job) => job.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 shadow-md bg-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">CyMatch</h1>
        <nav className="space-x-4">
          <button onClick={() => setView('home')} className="text-blue-500 hover:underline">
            Home
          </button>
          <button onClick={() => setView('saved')} className="text-blue-500 hover:underline">
            Saved Jobs
          </button>
          <button onClick={() => setView('profile')} className="text-blue-500 hover:underline">
            Profile
          </button>
        </nav>
      </header>

      <main className="p-4">
        {view === 'home' ? (
          <>
            <TipBanner />
            {loading ? (
              <p className="text-center text-gray-600">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-gray-600">No more jobs to show!</p>
            ) : (
              <div className="relative h-[420px]">
                {jobs
                  .slice()
                  .reverse()
                  .map((job, index) => (
                    <div
                      key={job.id}
                      className="absolute inset-0"
                      style={{
                        zIndex: index,
                        transform: `translateY(${index * 2}px) scale(${1 - index * 0.01})`,
                      }}
                    >
                      {index === jobs.length - 1 && (
                        <JobCard
                          job={job}
                          onSwipeLeft={handleSwipeLeft}
                          onSwipeRight={handleSwipeRight}
                        />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </>
        ) : view === 'saved' ? (
          <SavedJobs savedJobs={savedJobs} />
        ) : view === 'profile' ? (
          <Profile />
        ) : null}
      </main>
    </div>
  );
}

export default App;
