import React, { useState, useEffect } from 'react';
import { useSocket } from '../SocketContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateDocument = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const socket = useSocket();
    const navigate = useNavigate();

    const handleCreate = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

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
                    setTitle(''); 
                    setContent(''); 
                    setShowForm(false);
                    fetchDocuments();
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
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            alert('Error fetching documents. Please try again.');
        }
    };

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
            fetchDocuments();
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Error deleting document. Please try again.');
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const filteredDocuments = documents.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleForm = () => {
        setShowForm((prev) => !prev);
        setTitle(''); // Clear title when toggling form
        setContent(''); // Clear content when toggling form
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center">Document Page</h1>

            <div className="text-center mb-4">
                <button
                    onClick={toggleForm}
                    className="btn btn-primary mb-3"
                >
                    {showForm ? 'Cancel' : 'Create New Document'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label" style={{ fontSize: '1.5rem' }}>
                            Document Name
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ fontSize: '1.25rem' }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="content" className="form-label" style={{ fontSize: '1.5rem' }}>
                            Document Description
                        </label>
                        <textarea
                            id="content"
                            className="form-control"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            style={{ height: '200px', fontSize: '1.25rem' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100" style={{ fontSize: '1.25rem' }}>
                        Create Document
                    </button>
                </form>
            )}

            <div className="my-4">
                <input
                    type="text"
                    placeholder="Search documents by title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control mb-4"
                    style={{ fontSize: '1.25rem' }}
                />
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredDocuments.length === 0 ? (
                    <p>No documents found.</p>
                ) : (
                    filteredDocuments.map((doc) => (
                        <div key={doc._id} className="col">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title display-5">{doc.title}</h5>
                                    <p className="card-text">{doc.content.substring(0, 100)}...</p>
                                    <p className="card-text text-muted" style={{ fontSize: '1.2rem' }}>
                                        Created on: {new Date(doc.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/edit/${doc._id}`} className="btn btn-success btn-lg rounded-pill">
                                            Open
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(doc._id)}
                                            className="btn btn-danger btn-lg rounded-pill"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CreateDocument;
