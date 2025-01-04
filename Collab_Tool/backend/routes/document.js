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

// Fetch a document by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        // Fetch documents created by the authenticated user
        const documents = await Document.find();

        // Send documents as response
        res.json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete document route
router.delete('/:documentId', verifyToken, async (req, res) => {
    try {
        // Get the document ID from the route parameter
        const { documentId } = req.params;

        // Find and delete the document by its ID
        const document = await Document.findByIdAndDelete(documentId);

        // If the document doesn't exist, send a 404 response
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Send success response
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete the document' });
    }
});

module.exports = router;
