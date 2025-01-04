import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../SocketContext';

const DocumentEditor = () => {
    const { documentId } = useParams(); // Extract documentId from the route
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        // Fetch the document content using Axios
        const fetchDocument = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/documents/${documentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setContent(response.data.content);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch document');
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId]);

    useEffect(() => {
        // Listen for updates from other clients
        if (socket) {
            socket.on('documentUpdated', (data) => {
                if (data.documentId === documentId) {
                    setContent(data.content);
                }
            });
        }

        // Clean up the listener on unmount
        return () => {
            if (socket) {
                socket.off('documentUpdated');
            }
        };
    }, [socket, documentId]);

    const handleContentChange = (e) => {
        setContent(e.target.value);

        // Emit the update to the backend
        if (socket) {
            const token = localStorage.getItem('token');
            socket.emit('updateDocument', { documentId, content: e.target.value, token });
        }
    };

    if (loading) return <p>Loading document...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Edit your document here"
            />
        </div>
    );
};

export default DocumentEditor;
