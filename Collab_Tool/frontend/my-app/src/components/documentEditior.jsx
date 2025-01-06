import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../SocketContext';

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
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [editorTheme, setEditorTheme] = useState(localStorage.getItem('editorTheme') || 'light');
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
                    headers: { Authorization: `Bearer ${token}` },
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
        const words = content.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
        setCharCount(content.length);
    }, [content]);

    useEffect(() => {
        const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
        setNotifications(savedNotifications.slice(0, 2));
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
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
                            ...notifications.slice(0, 1),
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

    const toggleEditorTheme = () => {
        const newTheme = editorTheme === 'light' ? 'dark' : 'light';
        setEditorTheme(newTheme);
        localStorage.setItem('editorTheme', newTheme);
    };

    if (loading) {
        return <p>Loading document...</p>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container">
            <h2 className="my-3">Document Editor</h2>
            <h3>{title}</h3>
            <button
                className="btn btn-primary btn-lg my-2"
                onClick={toggleEditorTheme}
                style={{ fontSize: '18px' }}
            >
                Toggle {editorTheme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
            <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Edit your document here"
                className={`form-control document-editor-textarea ${editorTheme === 'dark' ? 'bg-dark text-light' : ''}`}
                disabled={loading}
                style={{ height: '400px', fontSize: '22px' }}
            />
            <div className="editor-actions my-3">
                <button
                    className="btn btn-success mx-1"
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    style={{ fontSize: '18px' }}
                >
                    Undo
                </button>
                <button
                    className="btn btn-warning mx-1"
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    style={{ fontSize: '18px' }}
                >
                    Redo
                </button>
                <button
                    className="btn btn-danger mx-1"
                    onClick={clearDocument}
                    style={{ fontSize: '18px' }}
                >
                    Clear Document
                </button>
            </div>
            <div className="word-char-count my-3">
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Word Count: {wordCount}</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Character Count: {charCount}</p>
            </div>
            <div className="notifications-container my-3">
                {notifications.map((notification, index) => (
                    <div 
                        key={index} 
                        className={`alert alert-${notification.type}`} 
                        style={{ color: 'black', fontWeight: 'bold' }}>
                        {notification.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentEditor;
