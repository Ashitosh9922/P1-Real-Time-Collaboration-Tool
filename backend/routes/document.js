const express = require('express');
const jwt = require('jsonwebtoken');
const Document = require('../models/Document');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ','').trim();
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Create Document
router.post('/create', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    try {
        const document = new Document({ title, content, owner: req.user.id });
        await document.save();
        res.status(201).json(document);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get User Documents
router.get('/my-documents', verifyToken, async (req, res) => {
    try {
        const documents = await Document.find({ owner: req.user.id });
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
