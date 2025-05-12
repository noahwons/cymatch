const axios = require('axios');
const cron = require('node-cron');

const REMOTIVE_URL = "https://remotive.com/api/remote-jobs";

const { MongoClient, ObjectId } = require("mongodb");

// MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017";
const dbName = "cymatch";
const client = new MongoClient(MONGO_URL);
const db = client.db(dbName);

async function fetchAndStoreJobs() {
    const { data } = await axios.get(REMOTIVE_URL);
    const jobs = data.jobs;
    await Promise.all(jobs.map(job =>
        db.collection("jobs").updateOne(
            { _id: job.id },
            {
                $set: {
                    title: job.title,
                    company: job.company_name,
                    location: job.candidate_required_location,
                    url: job.url,
                    date: new Date(job.publication_date),
                    description: job.description,
                }
            },
            { upsert: true }
        )
    ));
    console.log(`Fetched & upserted ${jobs.length} jobs`);
}

; (async () => {
    await client.connect();

    await fetchAndStoreJobs();

    cron.schedule("0 * * * *", fetchAndStoreJobs);

    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const path = require('path');
    const usersRouter = require('./users');
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use("/users", usersRouter);
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.get("/jobs", async (req, res) => {
        try {
            const doc = await db
                .collection("jobs")
                .findOne(
                    { status: { $nin: ["saved", "dismissed"] } },
                    { sort: { date: -1 } }
                );
            if (!doc) {
                return res.status(404).json({ error: "No jobs available" });
            }
            const id = doc._id.toHexString?.() || String(doc._id);
            res.json({ ...doc, _id: id });
        } catch (err) {
            console.error("GET /jobs failed:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.get("/jobs/saved", async (req, res) => {
        try {
            await client.connect();
            const savedList = await db
                .collection("jobs")
                .find({ status: "saved" })
                .sort({ savedAt: -1 })
                .toArray();

            const transformed = savedList.map(job => {
                let id;
                if (job._id && typeof job._id.toHexString === "function") {
                    id = job._id.toHexString();
                } else {
                    id = String(job._id);
                }
                return {
                    ...job,
                    _id: id,
                };
            });

            res.json(transformed);
        } catch (err) {
            console.error("GET /jobs/saved failed:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    function buildIdFilter(raw) {
        if (ObjectId.isValid(raw) && String(new ObjectId(raw)) === raw) {
            return { _id: new ObjectId(raw) };
        }
        if (/^\d+$/.test(raw)) {
            return { _id: Number(raw) };
        }
        return null;
    }

    app.post("/job/:id/save", async (req, res) => {
        const filter = buildIdFilter(req.params.id);
        if (!filter) return res.status(400).json({ error: "Invalid job ID" });

        try {
            await client.connect();
            const result = await db
                .collection("jobs")
                .updateOne(filter, { $set: { status: "saved", savedAt: new Date() } });
            if (!result.matchedCount) return res.status(404).json({ error: "Job not found" });
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.post("/job/:id/dismiss", async (req, res) => {
        const filter = buildIdFilter(req.params.id);
        if (!filter) return res.status(400).json({ error: "Invalid job ID" });

        try {
            await client.connect();
            const result = await db
                .collection("jobs")
                .updateOne(filter, { $set: { status: "dismissed", dismissedAt: new Date() } });
            if (!result.matchedCount) return res.status(404).json({ error: "Job not found" });
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`App listening on :${PORT}`));
})();