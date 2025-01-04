const Document = require('./models/Document');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle document creation
        socket.on('createDocument', async ({ title, content, token }) => {
            if (!token) {
                socket.emit('documentError', { message: 'User is not logged in' });
                return;
            }

            try {
                // Validate token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                if (!user) {
                    socket.emit('documentError', { message: 'Invalid user' });
                    return;
                }

                // Create a new document
                const newDocument = new Document({
                    title,
                    content,
                    owner: user._id,
                });

                const savedDocument = await newDocument.save();

                // Emit success event to the client
                socket.emit('documentCreated', {
                    message: 'Document created successfully',
                    document: savedDocument,
                });

                console.log(`Document created by ${user.username}:`, savedDocument);
            } catch (err) {
                console.error(err);
                socket.emit('documentError', { message: 'Failed to create document' });
            }
        });

        // Listen for content updates (for real-time editing)
        socket.on('updateDocument', async ({ documentId, content, token }) => {
            if (!token) {
                socket.emit('documentError', { message: 'User is not logged in' });
                return;
            }

            try {
                // Validate token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                if (!user) {
                    socket.emit('documentError', { message: 'Invalid user' });
                    return;
                }

                // Find the document and update the content
                const document = await Document.findById(documentId);
                if (!document) {
                    socket.emit('documentError', { message: 'Document not found' });
                    return;
                }

                // Update document content
                document.content = content;
                await document.save();

                // Emit the updated document to all connected clients
                io.emit('documentUpdated', {
                    documentId,
                    content: document.content,
                    lastEditor: user.username,
                    lastEdited: new Date().toLocaleString(),  // Current time for last edit
                });

                console.log(`Document updated by ${user.username}:`, content);
            } catch (err) {
                console.error(err);
                socket.emit('documentError', { message: 'Failed to update document' });
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
