const admin = require("firebase-admin");
const serviceAccount = require("../firebase-key.json");
const express = require("express");
const cors = require("cors");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(express.json());
app.use(cors());

// API untuk membuat shortlink
app.post("/api/shorten", async (req, res) => {
    const { longUrl, slug } = req.body;
    if (!longUrl) return res.status(400).json({ error: "URL tidak boleh kosong" });

    const shortId = slug || Math.random().toString(36).substring(7);
    const shortUrl = `https://${req.get("host")}/${shortId}`;

    await db.collection("shortlinks").doc(shortId).set({ longUrl });

    res.json({ shortUrl });
});

// API untuk redirect link pendek ke link asli
app.get("/api/:slug", async (req, res) => {
    const slug = req.params.slug;
    const doc = await db.collection("shortlinks").doc(slug).get();

    if (!doc.exists) {
        return res.status(404).send("Link tidak ditemukan.");
    }

    res.redirect(doc.data().longUrl);
});

module.exports = app;
