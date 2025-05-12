var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
const usersRouter = require("./users");
const path = require("path");


app.use(cors());
app.use(bodyParser.json());
app.use("/users", usersRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const port = "8080";
const host = "localhost";

app.listen(port, () => {
    console.log("App listening at http://%s:%s",
        host, port);
});

const { MongoClient, ObjectId } = require("mongodb");

// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "cymatch";
const client = new MongoClient(url);
const db = client.db(dbName);

app.get("/jobs", async (req, res) => {
    try {
        await client.connect();
        const recent = await db
            .collection("jobs")
            .find({ status: { $nin: ["saved", "dismissed"] } })
            .sort({ date: -1 })
            .limit(1)
            .toArray();

        const transformed = recent.map(job => {
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