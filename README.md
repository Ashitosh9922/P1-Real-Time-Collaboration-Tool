
# Real-Time Collaboration Tool

This is a **Real-Time Document Collaboration Tool** built using the **MERN** stack (MongoDB, Express.js, React, Node.js) and **Socket.IO** for real-time communication. It allows multiple users to collaborate and edit documents simultaneously, with features such as version control (undo/redo), notifications, and document sharing.

## Features

- **Real-Time Collaboration**: Users can edit the document simultaneously with live updates visible to all collaborators in real-time.
- **Document Editing**: Users can make changes to the document content in a rich-text editor.
- **Version Control (Undo/Redo)**: Users can undo and redo changes with a history of document edits.
- **Real-Time Notifications**: Users are notified when someone else updates the document, showing who made the last edit and when.
- **Document Clear**: Users can clear the document and reset it to its initial state.
- **User Authentication**: Secure access to documents via authentication tokens stored in local storage.
- **Document Retrieval**: Users can retrieve documents using unique document IDs.
- **Responsive Design**: Fully responsive interface built with React and styled with CSS.

## Tech Stack

- **Frontend**:
  - React.js
  - React Router
  - Socket.IO (for real-time updates)
  - Axios (for API calls)
  - CSS (for styling)

- **Backend**:
  - Node.js
  - Express.js
  - Socket.IO (for real-time communication)
  - MongoDB (for document storage and user management)

- **Real-Time Communication**:
  - Socket.IO (for bi-directional event-based communication)

- **Authentication**:
  - JWT (JSON Web Token) for secure user authentication and authorization

## Installation

### Prerequisites

- Node.js
- MongoDB (local or remote MongoDB service)

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/Real-Time-Collaboration-Tool.git
   cd Real-Time-Collaboration-Tool
   ```

2. **Install dependencies for the backend**:

   Navigate to the `backend` folder and run:

   ```bash
   cd backend
   npm install
   ```

3. **Install dependencies for the frontend**:

   Navigate to the `frontend` folder and run:

   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**:

   In the `backend` folder, create a `.env` file with the following content:

   ```
   MONGO_URI=mongodb://localhost:27017/collabtool
   JWT_SECRET=your_jwt_secret_key
   ```

   Make sure MongoDB is running locally or provide a remote MongoDB URI.

5. **Start the application**:

   To start both the backend and frontend servers concurrently, use the following commands in separate terminal windows:

   - **Backend**:

     ```bash
     cd backend
     npm start
     ```

   - **Frontend**:

     ```bash
     cd frontend
     npm start
     ```

6. **Access the application**:

   The frontend will be available at `http://localhost:3000`, and the backend API will be available at `http://localhost:5000`.

## Usage

- **Document Editing**: Once logged in, users can open a document and start editing. All changes will be reflected in real-time for all connected users.
- **Undo/Redo**: Users can undo or redo their changes using the respective buttons.
- **Notifications**: Users will see notifications about document updates, including who made the changes and when.
- **Clear Document**: Users can clear the document content by clicking the "Clear Document" button.

## API Endpoints

- **GET** `/api/documents/:documentId`: Fetch a document by its ID.
- **POST** `/api/documents`: Create a new document.
- **PUT** `/api/documents/:documentId`: Update an existing document.
- **DELETE** `/api/documents/:documentId`: Delete a document.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new Pull Request.
