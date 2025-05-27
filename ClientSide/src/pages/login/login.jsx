// src/components/Login/Login.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import axiosInstance from '../../axiosInstance';
import backgroundImage from '../../assets/newsPaperLogin.jpeg';
import { AuthContext } from '../../components/AuthContext/AuthContext';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { signIn } = useContext(AuthContext);
  const [error, setError] = useState(''); // State for favorite error

  const navigate = useNavigate();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    axiosInstance.post('/login', formData)
      .then(response => {
        console.log(response.data);
        signIn(); // Update context state to indicate the user is signed in
        navigate(`/`);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          setError('Incorrect Email!');
        }else if (error.response && error.response.status === 404) {
          setError('Incorrect Password!');
        }else{
          setError('Error in logging In!');
        }

        console.error(error);
      });
  };

  return (
    <div className="all" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container">
        <div className="header">
          <div className="text">Log In</div>
          <div className="underline"></div>

        </div>
        <br/>
        {error && <h3 className="error-message" style={{ color: 'red' }}>{error}</h3>}
        <br/>

        <form onSubmit={handleFormSubmit}>
          <div className="inputs">
            <div className="input">
              <label htmlFor="email" className="info">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="Your email" />
            </div>
            <div className="input">
              <label htmlFor="password" className="info">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Your password" />
            </div>
            <div className="submit-container">
              <button type="submit">Login</button>
            </div>
            <br />
            <div className="link-container">
              <p><Link to="/signup">Don't have an account? Sign Up</Link></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
