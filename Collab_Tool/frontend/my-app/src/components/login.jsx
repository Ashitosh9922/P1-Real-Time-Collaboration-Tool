import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Login.css';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            login(response.data.token);
            alert('Login successful!');
            navigate('/create');
        } catch (error) {
            alert('Login failed: ' + error.response.data.error);
        }
    };

    return (
        <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
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
};

export default Login;
