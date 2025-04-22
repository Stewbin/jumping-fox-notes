import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {auth, db, doc, setDoc,createUserWithEmailAndPassword } from '../lib/firebase';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    

    const handleSignUp = async (event) => {
        event.preventDefault();
        setError(''); 
    
        try {
        
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            await setDoc(doc(db, "users", user.uid), {
                firstName,
                lastName,
                email,
                createdAt: new Date(),
            });
    
            alert('Signup Successful!');
            navigate('/login'); 
        } catch (err) {
          
            if (err.code !== 'auth/email-already-in-use') { 
                setError(err.message || 'Signup failed. Please try again.');
            }
            console.error("Signup Error:", err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4" style={{ color: '#A077FF' }}>Sign Up</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSignUp}>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                placeholder="Enter First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                placeholder="Enter Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                                backgroundColor: '#B86BFF',
                                borderRadius: '20px',
                                border: 'none',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#AC4FFF'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#B86BFF'}
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-4 text-center text-muted">
                        Already have an account? <a href="/login" style={{ color: '#A077FF' }} className="text-decoration-none">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;