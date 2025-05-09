// CardDeck.jsx
import React from 'react';
import JobCard from './JobCard';
import { useState, useEffect } from 'react';
import { fetchJobs, deleteJob, saveJob } from '../services/api';

export default function CardDeck({ savedJobs, setSavedJobs }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // keep track of remaining cards
    // optional: track last swipe direction
    const [lastDirection, setLastDirection] = useState();

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
        loading ? (
            <p className="text-center text-gray-600">Loading jobs...</p>
        ) : jobs.length === 0 ? (
            <p className="text-center text-gray-600">No more jobs to show!</p>
        ) : (
            <div className="relative w-full max-w-md h-[600px] mx-auto">
                {jobs.map((job, i) => (
                    <div
                        key={job.id}
                        className="absolute inset-0"
                        style={{
                            zIndex: i,
                            transform: `translateY(${i * 2}px) translateX(${i * 2}px) scale(${1 - i * 0.01})`,
                        }}
                    >
                        <JobCard
                            key={job.id}
                            job={job}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                            className="absolute inset-0"
                            style={{ zIndex: jobs.length - i }}
                        />
                    </div>

                ))}
            </div>

        )

    );
}

