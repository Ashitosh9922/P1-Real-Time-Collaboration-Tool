import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../SocketContext';
import './DocumentEditor.css';

const DocumentEditor = () => {
    const { documentId } = useParams();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [hasUserUpdated, setHasUserUpdated] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const socket = useSocket();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token is missing');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/documents/${documentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setTitle(response.data.title);
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
        const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
        setNotifications(savedNotifications);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(date);
    };

    useEffect(() => {
        if (socket) {
            socket.on('documentUpdated', (data) => {
                if (data.documentId === documentId) {
                    setContent(data.content);
                    if (!hasUserUpdated) {
                        const newNotifications = [
                            {
                                message: `Document updated by ${data.lastEditor} at ${formatDate(data.lastEdited)}`,
                                type: 'info',
                            },
                            ...notifications.slice(0, 4),
                        ];

                        setNotifications(newNotifications);
                        localStorage.setItem('notifications', JSON.stringify(newNotifications));
                    }
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('documentUpdated');
            }
        };
    }, [socket, documentId, notifications, hasUserUpdated]);

    const handleContentChange = (e) => {
        const updatedContent = e.target.value;
        setContent(updatedContent);
        setHasUserUpdated(true);

        if (historyIndex === history.length - 1) {
            setHistory([...history, updatedContent]);
        } else {
            setHistory([...history.slice(0, historyIndex + 1), updatedContent]);
        }
        setHistoryIndex(historyIndex + 1);

        if (socket) {
            const token = localStorage.getItem('token');
            if (token) {
                socket.emit('updateDocument', { documentId, content: updatedContent, token });
            }
        }

        setTimeout(() => {
            setHasUserUpdated(false);
        }, 1000);
    };

    const undo = () => {
        if (historyIndex > 0) {
            const previousContent = history[historyIndex - 1];
            setContent(previousContent);
            setHistoryIndex(historyIndex - 1);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextContent = history[historyIndex + 1];
            setContent(nextContent);
            setHistoryIndex(historyIndex + 1);
        }
    };

    const clearDocument = () => {
        setContent('');
        setHasUserUpdated(false);
        setHistory([]);
        setHistoryIndex(-1);
        if (socket) {
            const token = localStorage.getItem('token');
            if (token) {
                socket.emit('clearDocument', { documentId, token });
            }
        }
    };

    if (loading) {
        return <p>Loading document...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Document Editor</h2>
            <h3>{title}</h3>
            <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Edit your document here"
                className="document-editor-textarea"
                disabled={loading}
            />
            <div className="editor-actions">
                <button onClick={undo} disabled={historyIndex <= 0}>Undo</button>
                <button onClick={redo} disabled={historyIndex >= history.length - 1}>Redo</button>
                <button onClick={clearDocument}>Clear Document</button>
            </div>
            <div className="notifications-container">
                {notifications.map((notification, index) => (
                    <div key={index} className={`notification-box ${notification.type}`}>
                        {notification.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentEditor;
