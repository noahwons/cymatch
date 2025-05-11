const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "cymatch";
const client = new MongoClient(url);
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
        res.json({ token });
    } catch (err) {
        console.error("LOGIN ERROR", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
