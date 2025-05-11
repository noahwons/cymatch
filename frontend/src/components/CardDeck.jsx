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
        setLoading(true);
        fetch("http://localhost:8080/jobs")
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error("Expected an array but got " + typeof data);
                }
                setJobs(data);
            })
            .catch(err => {
                console.error("Error fetching jobs:", err);
                // optionally show an error UI or toast
                setJobs([]);   // avoid jobs.map blowing up
            })
            .finally(() => {
                setLoading(false);
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

            // add to savedJobs array
            setSavedJobs((prev) => [
                ...prev,
                jobs.find((j) => j._id === jobId),
            ]);

            // remove from deck
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

            // add to savedJobs array
            setSavedJobs((prev) => [
                ...prev,
                jobs.find((j) => j._id === jobId),
            ]);

            // remove from deck
            setJobs((js) => js.filter((j) => j._id !== jobId));
        } catch (err) {
            console.error('Error dismissing job:', err);
            alert(`Error dismissing job: ${err.message}`);
        }
    };

    const handleSwipeRight = async (jobId) => {
        // await saveJob(jobId);
        await handleSave(jobId);
        // setSavedJobs(s => [...s, jobs.find(job => job.id === jobId)]);
        // setJobs(j => j.filter(job => job.id !== jobId));
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

