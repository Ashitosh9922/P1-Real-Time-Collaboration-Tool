import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { useSocket } from '../SocketContext';
import { Link } from 'react-router-dom';
import './DocumentList.css'; // Import the CSS file for custom styling

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const socket = useSocket();

    // Fetch documents when component mounts
    useEffect(() => {
        if (socket) {
            socket.on('documentCreated', (document) => {
                setDocuments((prev) => [...prev, document]);
            });

            // Fetch existing documents with Axios
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

    // Handle document deletion
    const handleDelete = async (documentId) => {
        try {
            await axios.delete(`http://localhost:5000/api/documents/${documentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            // Remove the deleted document from the state
            setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
            alert('Document deleted successfully!');
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete the document');
        }
    };

    return (
        <div>
            <h1>Real-Time Documents</h1>
            <div className="document-grid">
                {documents.map((doc) => (
                    <div key={doc._id} className="document-card">
                        <div className="card-body">
                            <h5 className="card-title">{doc.title}</h5>
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
                ))}
            </div>
        </div>
    );
};

export default DocumentList;
