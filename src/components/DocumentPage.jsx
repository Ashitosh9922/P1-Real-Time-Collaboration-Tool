import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function DocumentPage() {
  const [document, setDocument] = useState(null);
  const [docContent, setDocContent] = useState('');
  const { id } = useParams();  // Get the document ID from the URL
  const navigate = useNavigate();

  // Simulate fetching the document by ID (In real applications, use an API)
  useEffect(() => {
    const doc = JSON.parse(localStorage.getItem('documents') || '[]').find((doc) => doc.id === parseInt(id));
    if (doc) {
      setDocument(doc);
      setDocContent(doc.content);
    } else {
      alert('Document not found');
      navigate('/dashboard');  // Redirect to dashboard if document not found
    }
  }, [id, navigate]);

  // Save the updated document content
  const handleSave = () => {
    if (document) {
      document.content = docContent;
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      const updatedDocuments = documents.map((doc) =>
        doc.id === document.id ? document : doc
      );
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      alert('Document saved!');
      navigate('/dashboard');
    }
  };

  return (
    <Container>
      {document ? (
        <>
          <Typography variant="h4" gutterBottom>
            Edit Document: {document.title}
          </Typography>

          {/* Document Content */}
          <TextField
            label="Document Content"
            multiline
            rows={10}
            variant="outlined"
            fullWidth
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginTop: '20px' }}
          >
            Save
          </Button>
        </>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Container>
  );
}

export default DocumentPage;
