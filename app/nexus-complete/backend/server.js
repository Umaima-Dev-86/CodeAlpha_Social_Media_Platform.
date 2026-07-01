// ==========================================================================
// 🚀 NEXUS PRODUCTION BACKEND ECOSYSTEM — MAIN ENGINE (server.js)
// ==========================================================================
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ SECURITY & PARSING MIDDLEWARE GLOBALS
app.use(cors({
    origin: '*', // Production me specific domains add karein (e.g., http://localhost:3000)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' })); // Large base64 images/payloads handle karne ke liye
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 📂 ROUTE SEED DATA & ENGINE DATABASES (In-Memory Arrays acting as Live DB)
let creatorsDatabase = [
    { id: 'sophia', name: 'Sophia Chen', handle: '@sophia_ai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'AI Neural Research and Pipeline Architect.', isFollowed: false },
    { id: 'alex', name: 'Alex Rivera', handle: '@alex_dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', bio: 'Cyberpunk Interface Designer mapping futuristic distributions.', isFollowed: false },
    { id: 'marcus', name: 'Marcus Vance', handle: '@marcus_v', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', bio: 'Ecosystem Defense and Cryptographic Systems Specialist.', isFollowed: false },
    { id: 'elena', name: 'Elena Rostova', handle: '@elena_ux', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', bio: 'Lead Interaction Architect developing smooth UI fluid frameworks.', isFollowed: false }
];

let globalPostsFeed = [];
// Massive 50+ Seed Data generation inside Backend on startup
for (let i = 1; i <= 55; i++) {
    let creator = creatorsDatabase[i % creatorsDatabase.length];
    globalPostsFeed.push({
        id: `node_id_${i}`,
        user: { name: creator.name, handle: creator.handle, avatar: creator.avatar, bio: creator.bio },
        text: `[Matrix Registry Network Cluster Node #${i}] System verification handshake online. Analyzing framework telemetry pipelines for anomalous activity.`,
        img: i % 2 === 0 ? "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600" : "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
        tags: ["#SystemCore", "#BackendActive", `#Node${i}`],
        likes: Math.floor(Math.random() * 80) + 20,
        isLiked: false
    });
}

// ==========================================================================
// 🛠️ MICROSERVICE API ROUTING CONTRACTS
// ==========================================================================

// 🛸 GET: Pure Global Feed Stream (Fetches all 50+ structures instantly)
app.get('/api/v1/feed', (req, res) => {
    try {
        res.status(200).json({ status: "success", count: globalPostsFeed.length, data: globalPostsFeed });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Failed to pipeline stream arrays." });
    }
});

// 🚀 POST: Broadcast Live Custom Publication Payload
app.post('/api/v1/posts/broadcast', (req, res) => {
    const { text, user } = req.body;
    if (!text) {
        return res.status(400).json({ status: "fail", message: "Broadcast transaction package cannot be empty." });
    }

    const newPost = {
        id: `custom_${Date.now()}`,
        user: user || { name: "Umaima Dev", handle: "@umaima_codes", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
        text: text,
        img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600",
        tags: ["#LiveBroadcast", "#UmaimaBackend"],
        likes: 0,
        isLiked: false
    };

    globalPostsFeed.unshift(newPost);
    res.status(201).json({ status: "success", data: newPost });
});

// ⚡ PATCH: Dynamic Follow/Unfollow State Pipeline Handshake
app.patch('/api/v1/creators/:id/toggle-follow', (req, res) => {
    const creatorId = req.params.id;
    let target = creatorsDatabase.find(c => c.id === creatorId);
    
    if (!target) {
        return res.status(404).json({ status: "fail", message: "Node target entity not found in cluster directory." });
    }

    target.isFollowed = !target.isFollowed;
    res.status(200).json({ status: "success", data: target });
});

// 🔍 GET: Fetch All Registered Network Creators
app.get('/api/v1/creators', (req, res) => {
    res.status(200).json({ status: "success", data: creatorsDatabase });
});

// ==========================================================================
// 🚨 SYSTEM MONITORING & GLOBAL ERROR INTERCEPTOR
// ==========================================================================
app.use((req, res, next) => {
    res.status(404).json({ status: "error", message: "Requested operational matrix endpoint does not exist." });
});

app.use((err, req, res, next) => {
    console.error("💥 SYSTEM CRITICAL ERROR:", err.stack);
    res.status(500).json({ status: "fatal", message: "Internal application engine anomaly detected." });
});

// 🛰️ SPIN UP SERVER GRID
app.listen(PORT, () => {
    console.log(`\n🛸 ===================================================`);
    console.log(`📡 NEXUS BACKEND GRID ONLINE: http://localhost:${PORT}`);
    console.log(`🛡️ 55+ LARGEST DATA STREAM PARAMETERS DEPLOYED SUCCESSFULLY`);
    console.log(`======================================================= 🚀\n`);
});