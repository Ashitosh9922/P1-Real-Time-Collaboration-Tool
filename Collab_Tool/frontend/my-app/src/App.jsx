import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './SocketContext'; 
import Login from './components/login'; 
import CreateDocument from './components/createDocument'; 
import DocumentList from './components/documentList'; 
import DocumentEditor from './components/documentEditior'; 
import Navbar from './components/navbar'; 
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
