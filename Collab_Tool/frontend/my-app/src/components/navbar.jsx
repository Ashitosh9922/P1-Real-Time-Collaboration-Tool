import React from 'react';
import { useAuth } from '../AuthContext';

function Navbar() {
//   const isLoggedIn = !!localStorage.getItem('token');
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to home or login page
  };

  return (
    <nav className="navbar">
      <h1>CollabTool</h1>
      <div>
        {!isLoggedIn ? (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
