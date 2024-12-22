import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setIsLoggedIn, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate checking login credentials (from the registered user)
    if (localStorage.getItem('user')) {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser.email === email && savedUser.password === password) {
        setUser(savedUser); // Set the user state
        setIsLoggedIn(true); // Set login state to true
        alert("Login successful!");
        navigate('/dashboard'); // Navigate to Dashboard after successful login
      } else {
        alert("Invalid email or password!");
      }
    } else {
      alert("No registered users found!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
