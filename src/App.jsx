import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import DocumentPage from "./components/DocumentPage";
import Home from "./components/Home";  // Import your Home page

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Route protection: If not logged in, redirect to login
  const PrivateRoute = ({ element, ...rest }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <nav className="navbar">
            <h1>CollabTool</h1>
            <div>
              {!isLoggedIn ? (
                <>
                  <a href="/">Home</a>
                  <a href="/login">Login</a>
                  <a href="/register">Register</a>
                </>
              ) : (
                <a href="/dashboard">Dashboard</a>
              )}
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />  {/* Add the Home route */}
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/document/:id" element={<PrivateRoute element={<DocumentPage />} />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
