const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const fetch = require("node-fetch");
const { MongoClient, ObjectId } = require("mongodb");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const MONGO_URL = "mongodb://127.0.0.1:27017";
const dbName = "cymatch";
const client = new MongoClient(MONGO_URL);
const db = client.db(dbName);

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Missing email or password" });

    try {
        const existing = await db.collection("users").findOne({ email });
        if (existing)
            return res.status(409).json({ error: "User already exists" });

        const hash = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({
            email,
            passwordHash: hash,
            createdAt: new Date(),
        });

        res.status(201).json({ success: true });
    } catch (err) {
        console.error("REGISTER ERROR", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Missing email or password" });

    try {
        const user = await db.collection("users").findOne({ email });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match)
            return res.status(401).json({ error: "Invalid credentials" });


        const token = jwt.sign(
            { sub: user._id.toString(), email },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        try {
        } catch (err) {
            return res.status(500).json({ error: "Could not load jobs" });
        }



        res.json({ token });
    } catch (err) {
        console.error("LOGIN ERROR", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.sub;
        next();
    } catch {
        return res.status(403).json({ error: 'Invalid token' });
    }
});

router.get('/profile', async (req, res) => {
    try {
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(req.userId) },
            { projection: { passwordHash: 0 } }
        );
        if (!user) return res.status(404).json({ error: 'Not found' });
        const resumeUrl = user.resumeUploadId
            ? `/uploads/${user.resumeUploadId.toHexString()}`
            : null;

        res.json({
            name: user.name || '',
            email: user.email,
            resumeUrl
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put(
    "/profile",
    upload.single("resume"),
    async (req, res) => {
        const { name, email } = req.body;
        const update = { name, email };

        if (req.file) {
            const fileDoc = {
                userId: new ObjectId(req.userId),
                filename: req.file.originalname,
                contentType: req.file.mimetype,
                data: req.file.buffer,
                createdAt: new Date(),
            };
            const result = await db.collection("uploads").insertOne(fileDoc);
            update.resumeUploadId = result.insertedId;
            update.resumeUrl = `/uploads/${result.insertedId.toHexString()}`;
        }

        await db.collection("users").updateOne(
            { _id: new ObjectId(req.userId) },
            { $set: update }
        );

        res.json({
            success: true,
            name: update.name,
            email: update.email,
            resumeUrl: update.resumeUploadId
                ? `/uploads/${update.resumeUploadId.toHexString()}`
                : ""
        });
    }
);



module.exports = router;
