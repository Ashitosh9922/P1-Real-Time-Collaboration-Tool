import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div
      className="home"
      style={{
        background: 'linear-gradient(135deg, #000000, #333333)',
        backgroundSize: 'cover',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <header className="bg-dark text-white text-center py-5">
        <h1 className="display-4">CollabTool</h1>
        <h2 className="mb-4 text-white">Your seamless collaboration companion</h2>
      </header>

      <main className="container my-5">
        <div className="hero-section text-center mb-5">
          <h2 className="mb-4 text-white">Welcome to CollabTool</h2>
          
          <div className="card p-4 mx-auto mb-4" style={{ maxWidth: '600px', backgroundColor: '#222222', color: '#FFFFFF', borderRadius: '12px' }}>
            <div className="card-body">
              <p className="fs-5">
                CollabTool is your go-to platform for seamless real-time collaboration. Work together on documents, share ideas, and communicate effortlessly with your team.
              </p>
              <p className="fs-5">
                Whether you're working on a team project or organizing your thoughts, CollabTool provides all the features you need to stay productive and focused.
              </p>
            </div>
          </div>

          <div className="buttons text-center">
            <Link
              to="/register"
              className="btn btn-lg btn-danger me-4 px-4 rounded-pill shadow-sm"
              style={{ border: 'none', fontSize: '1.1rem' }}
            >
              Register
            </Link>
            <Link
              to="/login"
              className="btn btn-lg btn-success"
              style={{ border: 'none', fontSize: '1.1rem' }}
            >
              Log In
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p className="mb-0">&copy; 2025 CollabTool. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
