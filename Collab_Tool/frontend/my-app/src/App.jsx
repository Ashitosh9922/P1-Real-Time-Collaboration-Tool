import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './SocketContext'; // Context for real-time updates
import Login from './components/login'; // Login Component
import CreateDocument from './components/createDocument'; // Document Creation Component
import DocumentList from './components/documentList'; // Real-Time Document List
import DocumentEditor from './components/documentEditior'; // Real-Time Document Editor
import Navbar from './components/navbar'; // navbar
import Home from './components/home';
import { AuthProvider } from './AuthContext.jsx';
import Register from './components/register.jsx';

function App() {
  return (
    <AuthProvider>
    <SocketProvider>
<div className="App">
      <Router>
      <header className="App-header">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/create" element={<CreateDocument />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/edit/:documentId" element={<DocumentEditor />} />
          </Routes>
        </main>
      </header>
      </Router>
      
    </div>
    </SocketProvider>
    </AuthProvider>
  );
}

export default App;
