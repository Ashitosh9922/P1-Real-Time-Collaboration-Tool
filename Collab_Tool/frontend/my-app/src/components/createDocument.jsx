import { useSocket } from '../SocketContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './DocumentPage.css';  // Make sure the path is correct

const CreateDocument = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showForm, setShowForm] = useState(false); // To toggle form visibility
    const [documents, setDocuments] = useState([]); // To store documents
    const socket = useSocket();
    const navigate = useNavigate();

    const handleCreate = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Assuming user ID is stored here

        if (!token) {
            alert('User not logged in.');
            return;
        }

        if (!title.trim() || !content.trim()) {
            alert('Title and content cannot be empty.');
            return;
        }

        if (socket) {
            socket.emit('createDocument', { title, content, token });

            socket.on('documentCreated', (response) => {
                if (response?.message === 'Document created successfully') {
                    alert('Document created successfully!');
                    setShowForm(false); // Hide the form after document creation
                    fetchDocuments(); // Fetch the updated list of documents
                }
            });

            socket.on('documentError', (error) => {
                alert(error.message || 'Error while creating document');
            });
        } else {
            console.error('Socket connection not available');
            alert('Real-time connection is unavailable. Please try again later.');
        }
    };

    // Fetch documents from the server
    const fetchDocuments = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to log in first.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/documents/', {
                headers: {  
                    Authorization: `Bearer ${token}`
                }
            });
            setDocuments(response.data); // Assuming the backend returns an array of documents
        } catch (error) {
            console.error('Error fetching documents:', error);
            alert('Error fetching documents. Please try again.');
        }
    };

    // Handle delete request
    const handleDelete = async (documentId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to log in first.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/documents/${documentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Document deleted successfully!');
            fetchDocuments(); // Re-fetch the documents to reflect the deletion
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Error deleting document. Please try again.');
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <div>
            <h1>Document Page</h1>

            {/* Button to show/hide the document creation form */}
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Create New Document'}
            </button>

            {/* Form to create a new document */}
            {showForm && (
                <form onSubmit={handleCreate}>
                    <div>
                        <label>Document Name:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Document Description:</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Create Document</button>
                </form>
            )}

            <h2>Your Documents</h2>
            <div className="document-grid">
                {documents.length === 0 ? (
                    <p>No documents found.</p>
                ) : (
                    documents.map((doc) => (
                        <div key={doc._id} className="document-card">
                            <div className="card-body">
                                <h5 className="card-title">{doc.title}</h5>
                                <p>Created on: {new Date(doc.createdAt).toLocaleDateString()}</p>
                                <p className="card-text">
                                    {doc.content.substring(0, 100)}...
                                </p>
                                <Link to={`/edit/${doc._id}`} className="btn-open">
                                    Open
                                </Link>
                                <button
                                    onClick={() => handleDelete(doc._id)}
                                    className="btn-delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CreateDocument;
