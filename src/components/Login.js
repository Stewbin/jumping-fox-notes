import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get('http://localhost:9000/getUser', {
                params: { username, password },
            });

            if (response.data) {
                alert('Login Successful');
                navigate('/home');  // Changed from '/login-successful' to '/home'
            } else {
                setError('Wrong Credentials');
            }
        } catch (err) {
            setError('Login Error');
            console.error(err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4" style={{ color: '#A077FF' }}>Login</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn w-100 py-2 text-white"
                            style={{ 
                                backgroundColor: '#D09EFF',
                                borderRadius: '20px',
                                border: 'none',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#AC4FFF'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#B86BFF'}
                        >
                            Login
                        </button>
                    </form>
                    <p className="mt-4 text-center text-muted">
                        Don't have an account? <a href="/signup" style={{ color: '#6a0dad' }} className="text-decoration-none">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;