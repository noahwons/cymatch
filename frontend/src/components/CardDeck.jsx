import React from 'react';
import JobCard from './JobCard';
import { useState, useEffect } from 'react';

export default function CardDeck({ savedJobs, setSavedJobs }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);


    function getjobs() {
        setLoading(true);
        fetch("http://localhost:8080/jobs")
            .then(res => res.json())
            .then(data => {
                const arr = Array.isArray(data) ? data : [data];
                setJobs(arr);
            })
            .catch(err => {
                console.error("Error fetching jobs:", err);
                setJobs([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }


    useEffect(() => {
        getjobs();
    }, []);

    const handleSwipeLeft = async (jobId) => {
        await handleDismiss(jobId);
        getjobs();
    };

    const handleSave = async (jobId) => {
        console.log("About to save job with id:", jobId);
        try {
            const res = await fetch(`http://127.0.0.1:8080/job/${jobId}/save`, {
                method: 'POST',
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || res.statusText);
            }
            const savedObj = await res.json();
            console.log('Saved result:', savedObj);

            setSavedJobs((prev) => [
                ...prev,
                jobs.find((j) => j._id === jobId),
            ]);

            setJobs((js) => js.filter((j) => j._id !== jobId));
        } catch (err) {
            console.error('Error saving job:', err);
            alert(`Error saving job: ${err.message}`);
        }
    };

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

            setSavedJobs((prev) => [
                ...prev,
                jobs.find((j) => j._id === jobId),
            ]);

            setJobs((js) => js.filter((j) => j._id !== jobId));
        } catch (err) {
            console.error('Error dismissing job:', err);
            alert(`Error dismissing job: ${err.message}`);
        }
    };

    const handleSwipeRight = async (jobId) => {
        await handleSave(jobId);
        getjobs();
    };

    return (
        loading ? (
            <p className="text-center text-gray-600">Loading jobs...</p>
        ) : jobs.length === 0 ? (
            <p className="text-center text-gray-600">No more jobs to show!</p>
        ) : (
            <div className="relative w-full max-w-md h-[600px] mx-auto">
                {jobs.map((job, i) => {
                    return (<div
                        key={job._id}
                        className="absolute inset-0"
                        style={{
                            zIndex: i,
                        }}
                    >
                        <JobCard
                            key={job._id}
                            job={job}
                            onSwipeLeft={() => handleSwipeLeft(job._id)}
                            onSwipeRight={() => handleSwipeRight(job._id)}
                            className="absolute inset-0"
                            style={{ zIndex: jobs.length - i }}
                        />
                    </div>
                    );

                })}
            </div>

        )

    );
}

