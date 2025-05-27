import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Signup.css';
import axiosInstance from '../../axiosInstance';
import backgroundImage from '../../assets/newsPaperLogin.jpeg'; 

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '', age: '' });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    axiosInstance.post('/signup', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className="all" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container">
        <div className="header">
          <div className="text">Sign Up</div>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="inputs">
            <div className="input">
              <label htmlFor="email" className="info">Email</label>
              <input
                type="email"
                placeholder="your email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="input">
              <label htmlFor="username" className="info">Username</label>
              <input
                type="text"
                placeholder="your username"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="input">
              <label htmlFor="password" className="info">Password</label>
              <input
                type="password"
                placeholder="your password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="input">
              <label htmlFor="age" className="info">Age</label>
              <input
                type="text"
                placeholder="your age"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>
          <div className="submit-container">
            <button type="submit">Sign Up</button>
          </div>
          <br />
          <div className="link-container">
            <p><Link to="/Login">Already have an account? Log In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
