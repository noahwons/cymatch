var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const port = "8080";
const host = "localhost";

app.listen(port, () => {
    console.log("App listening at http://%s:%s",
        host, port);
});

const { MongoClient } = require("mongodb");
// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "cymatch";
const client = new MongoClient(url);
const db = client.db(dbName);

app.get("/jobs", async (req, res) => {
    await client.connect();
    try {
        const recent = await db
            .collection("jobs")
            .find({})
            .sort({ date: -1 })
            .limit(1)
            .toArray();
        res.json(recent);
    } catch (err) {
        console.error("GET /jobs failed:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/job/:id/save", async (req, res) => {
    try {
        await client.connect();
        const newDocument = {
            id: Number(req.body.id),
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
        };
        const result = await db.collection("jobs").insertOne(newDocument);
        res.status(200);
        res.send(result);
    } catch (error) {
        console.error("Could not add the new Job" + error);
        res.status(500);
        res.send("Error adding new job");
    } finally {
        await client.close();
    }
});

app.delete("/deleteJob/:id", async (req, res) => {
    try {
        await client.connect();
        const result = await db
            .collection("jobs")
            .deleteOne({ id: Number(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: "No job found with that ID" });
        }
        res.status(200).send(result);
    } catch (error) {
        console.error("Error deleting Job:", error);
        res.status(500).send({ error: "An internal server error occurred" });
    } finally {
        await client.close();
    }
})