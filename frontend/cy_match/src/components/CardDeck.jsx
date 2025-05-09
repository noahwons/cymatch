// CardDeck.jsx
import React from 'react';
import JobCard from './JobCard';
import { useState, useEffect } from 'react';
import { fetchJobs, deleteJob, saveJob } from '../services/api';

export default function CardDeck({ }) {
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
        await saveJob(jobId);
        setJobs(jobs.filter((job) => job.id !== jobId));
    };

    return (
        loading ? (
            <p className="text-center text-gray-600">Loading jobs...</p>
        ) : jobs.length === 0 ? (
            <p className="text-center text-gray-600">No more jobs to show!</p>
        ) : (
            <div className="relative mx-auto overflow-hidden">
                {jobs.map((job, i) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                        className="absolute inset-0"
                        style={{ zIndex: jobs.length - i }}
                    />
                ))}
            </div>

        )

    );
}

