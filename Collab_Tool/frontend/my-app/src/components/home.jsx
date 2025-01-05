import React from "react";
import { Link } from "react-router-dom"; 
import './home.css';

function Home() {
  return (
    <div className="home">
      <header className="App-header">
        <h1>CollabTool</h1>
      </header>
      <main className="App-main">
        <div className="hero-section">
          <h2>Welcome to CollabTool</h2>
          <p>
            CollabTool is your go-to platform for seamless real-time collaboration. Work together on documents, share ideas, and communicate effortlessly with your team.
          </p>
          <p>
            Whether you're working on a team project or organizing your thoughts, CollabTool provides all the features you need to stay productive and focused.
          </p>
        </div>
        <div className="buttons">
          <Link to="/register">
            <button className="register-button">Register</button>
          </Link>
          <Link to="/login">
            <button className="login-button">Log In</button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
