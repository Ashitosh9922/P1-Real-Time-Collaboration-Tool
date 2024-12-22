import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, Typography, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [docTitle, setDocTitle] = useState('');
  const navigate = useNavigate();

  // Load documents from localStorage when the component mounts
  useEffect(() => {
    const savedDocuments = JSON.parse(localStorage.getItem('documents')) || [];
    setDocuments(savedDocuments);
  }, []);

  // Handle document creation
  const handleCreateDocument = () => {
    if (docTitle) {
      const newDoc = {
        id: Date.now(),  // Use timestamp for unique ID
        title: docTitle,
        content: '',  // Empty content initially
      };

      // Add the new document to the state
      const updatedDocuments = [...documents, newDoc];
      setDocuments(updatedDocuments);

      // Save documents to localStorage
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));

      setDocTitle('');  // Clear the input field
    }
  };

  // Handle editing the document (navigates to the document page)
  const handleEditDocument = (id) => {
    navigate(`/document/${id}`);
  };

  // Handle deleting the document
  const handleDeleteDocument = (id) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== id);  // Remove the document from state
    setDocuments(updatedDocuments);

    // Update localStorage
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard - Your Documents
      </Typography>

      {/* Document creation form */}
      <TextField
        label="Document Title"
        variant="outlined"
        fullWidth
        value={docTitle}
        onChange={(e) => setDocTitle(e.target.value)} // Update the document title input
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateDocument}
        style={{ marginBottom: '20px' }}
      >
        Create Document
      </Button>

      {/* Display created documents */}
      <Grid container spacing={3}>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{doc.title}</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditDocument(doc.id)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No documents available. Create one to start.</Typography>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;
