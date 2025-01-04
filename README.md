**REAL-TIME COLLABORATION TOOL**

A **Real-Time Document Collaboration Tool** built using the **MERN stack** (MongoDB, Express.js, React, Node.js) and **Socket.IO** for real-time communication. It supports collaborative editing, version control, notifications, and document sharing.

### **Features**  
- **Real-Time Collaboration**: Simultaneous document editing with live updates.  
- **Document Editing**: Rich-text editor for making changes.  
- **Version Control**: Undo/redo with a history of edits.  
- **Real-Time Notifications**: Alerts on updates, showing who made changes and when.  
- **Document Clear**: Reset the document to its initial state.  
- **User Authentication**: Secure access using JWT tokens.  
- **Document Retrieval**: Retrieve documents via unique IDs.  
- **Word & Character Count**: Live count displayed in the editor.  
- **Theme Toggle**: Light and dark mode for better usability.  
- **History Management**: Navigate between versions of the document.  
- **Persistent Notifications**: Notifications persist after refresh.  
- **Responsive Design**: Works seamlessly on all devices.

### **Tech Stack**  
- **Frontend**: React.js, React Router, CSS, Axios, Socket.IO  
- **Backend**: Node.js, Express.js, MongoDB, Socket.IO  
- **Authentication**: JWT for secure user access  
- **Real-Time Communication**: Socket.IO for bi-directional event-based updates  

### **Setup Instructions**  
1. **Prerequisites**: Install **Node.js** and **MongoDB**.  
2. **Clone Repository**:  
   ```bash  
   git clone https://github.com/yourusername/Real-Time-Collaboration-Tool.git  
   cd Real-Time-Collaboration-Tool  
   ```  
3. **Install Dependencies**:  
   - Backend:  
     ```bash  
     cd backend  
     npm install  
     ```  
   - Frontend:  
     ```bash  
     cd frontend  
     npm install  
     ```  
4. **Set Environment Variables**:  
   In the `backend/.env` file:  
   ```  
   MONGO_URI=mongodb://localhost:27017/collabtool  
   JWT_SECRET=your_jwt_secret_key  
   ```  
5. **Start Application**:  
   - Backend:  
     ```bash  
     cd backend  
     npm start  
     ```  
   - Frontend:  
     ```bash  
     cd frontend  
     npm start  
     ```  
6. **Access App**: Open `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend API.

### **Usage**  
- **Editing**: Log in, open a document, and start editing. Updates are visible to all connected users in real time.  
- **Undo/Redo**: Revert changes with the undo/redo buttons.  
- **Notifications**: View real-time notifications of document updates.  
- **Word Count**: Monitor word and character counts live.  
- **Theme Toggle**: Switch between light and dark themes.  
- **Persistent Notifications**: Notifications stay even after refreshing.

### **API Endpoints**  
- `GET /api/documents/:documentId`: Fetch a document.  
- `POST /api/documents`: Create a new document.  
- `PUT /api/documents/:documentId`: Update a document.  
- `DELETE /api/documents/:documentId`: Delete a document.

### **Contributing**  
1. Fork the repository.  
2. Create a branch:  
   ```bash  
   git checkout -b feature-name  
   ```  
3. Commit your changes:  
   ```bash  
   git commit -m "Add new feature"  
   ```  
4. Push to the branch:  
   ```bash  
   git push origin feature-name  
   ```  
5. Create a pull request.
