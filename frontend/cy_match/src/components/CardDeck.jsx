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

    function getjobs() {
        fetch('http://localhost:8080/jobs')
            .then((response) => response.json())
            .then((data) => {
                setJobs(data);
                setLoading(false);

            })
            .catch((error) => {
                console.error("Error fetching jobs:", error);
            });
    }

    useEffect(() => {
        const loadJobs = async () => {
            const data = await fetchJobs();
            setJobs(data);
            setLoading(false);
        };
        getjobs();
        //loadJobs();
    }, []);

    const handleSwipeLeft = async (jobId) => {
        await handleDelete(jobId);
        setJobs(j => j.filter(job => job.id !== jobId));
        getjobs();
    };

    const handleSwipeRight = async (jobId) => {
        await saveJob(jobId);
        setSavedJobs(s => [...s, jobs.find(job => job.id === jobId)]);
        setJobs(j => j.filter(job => job.id !== jobId));
        getjobs();
    };

    const handleDelete = async (jobId) => {
        const id = parseInt(jobId, 10);
        const url = `http://127.0.0.1:8080/deleteJob/${id}`;
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete Job: ${errorText}`);
            }
            const result = await response.json();
            console.log("Success:", result);
            alert("Job deleted successfully!");
            // Optionally clear the Robot ID input
            setRobotId("");
        } catch (error) {
            console.error("Error:", error);
            alert(`Error deleting Job: ${error.message}`);
        }
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

