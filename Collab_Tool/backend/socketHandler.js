const Document = require('./models/Document');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        
        socket.on('createDocument', async ({ title, content, token }) => {
            if (!token) {
                socket.emit('documentError', { message: 'User is not logged in' });
                return;
            }

            try {
             
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                if (!user) {
                    socket.emit('documentError', { message: 'Invalid user' });
                    return;
                }

               
                const newDocument = new Document({
                    title,
                    content,
                    owner: user._id,
                });

                const savedDocument = await newDocument.save();

                
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

      
        socket.on('updateDocument', async ({ documentId, content, token }) => {
            if (!token) {
                socket.emit('documentError', { message: 'User is not logged in' });
                return;
            }

            try {
               
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);

                if (!user) {
                    socket.emit('documentError', { message: 'Invalid user' });
                    return;
                }

                
                const document = await Document.findById(documentId);
                if (!document) {
                    socket.emit('documentError', { message: 'Document not found' });
                    return;
                }

                
                document.content = content;
                await document.save();

                
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

      
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
