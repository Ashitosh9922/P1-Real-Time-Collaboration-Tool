import React from "react";
import { Link } from "react-router-dom";
import './home.css';

function Home() {
  return (
    <div className="home">
      <main className="App-main">
        <h2>Welcome to CollabTool</h2>
        <p>
          CollabTool is your go-to platform for seamless real-time collaboration. Work together on documents, share ideas, and communicate effortlessly with your team.
        </p>
        <p>
          Whether you're working on a team project or just need to organize your thoughts, CollabTool offers all the features you need to stay productive.
        </p>
        <div className="buttons">
          <Link to="/register" className="register-button">
            Register
          </Link>
          <Link to="/login" className="login-button">
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
