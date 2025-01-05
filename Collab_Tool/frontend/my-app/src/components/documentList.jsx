import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../SocketContext';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('documentCreated', (document) => {
                setDocuments((prev) => [...prev, document]);
            });

            axios.get('http://localhost:5000/api/documents', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => {
                setDocuments(response.data);
            })
            .catch((error) => {
                console.error('Error fetching documents:', error);
            });
        }
    }, [socket]);

    const handleDelete = async (documentId) => {
        try {
            await axios.delete(`http://localhost:5000/api/documents/${documentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
            alert('Document deleted successfully!');
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete the document');
        }
    };

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center">Real-Time Documents</h1>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {documents.map((doc) => (
                    <div key={doc._id} className="col">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{doc.title}</h5>
                                <p className="card-text">{doc.content.substring(0, 100)}...</p>
                                <div className="d-flex justify-content-between">
                                    <Link to={`/edit/${doc._id}`} className="btn btn-success rounded-pill">
                                        Open
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(doc._id)}
                                        className="btn btn-danger rounded-pill"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentList;
