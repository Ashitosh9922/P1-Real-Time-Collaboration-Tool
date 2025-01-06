import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    
    setIsUserLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    setIsUserLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        backgroundColor: '#222222',
        fontFamily: 'Comic Sans MS',
        fontSize: '20px',
      }}
    >
      <div className="container-fluid">
        <a className="navbar-brand fs-3 fw-bold text-white" href="/">
          CollabTool
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isUserLoggedIn ? (
              <>
                <li className="nav-item">
                  <a className="btn btn-light btn-lg text-black me-3" href="/login">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="btn btn-light btn-lg text-black" href="/register">
                    Register
                  </a>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-light btn-lg text-black" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
