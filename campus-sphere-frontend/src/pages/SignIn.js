import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';
import bgImage from '../icons/bg.png';
import logo from '../icons/logo_campusSphere.svg';
import profileIcon from '../icons/profile.svg';
import googleIcon from '../icons/google icon.svg';
import facebookIcon from '../icons/facebook icon.svg';

function SignIn() {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/signin", formData);
      if (response.status === 200) {
        alert("Login success!");
        // Store user info and token
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Signin error:", error);
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="signin-page">
      {/* Background */}
      <div 
        className="signin-background" 
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="signin-bg-overlay"></div>
      </div>
    

      {/* Navbar Section specific to SignIn design (simulated nav elements as requested) */}
      <div className="signin-navbar">
        <div className="signin-logo">
          <Link to="/">
            <img src={logo} alt="CampusSphere Logo" />
          </Link>
        </div>
        <div className="signin-nav-links">
          <div className="global-nav-dropdown-wrapper">
            <span className="nav-link-btn">Modules ▾</span>
            <div className="global-nav-dropdown-menu">
              <Link to="/deadlines">Deadline Tracker</Link>
              <Link to="/notes">Notes Sharing</Link>
              <Link to="/lostfound">Lost & Found</Link>
              <Link to="/expenses">Expense Split</Link>
            </div>
          </div>
          <a href="/#features" className="nav-link-btn">Features</a>
          <a href="/#how-it-works" className="nav-link-btn">How it works</a>
          <a href="#contact" className="nav-link-btn">Contact Us</a>
        </div>
        <div className="signin-profile-section">
          <img 
            src={profileIcon} 
            alt="Profile" 
            className="signin-profile-icon" 
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className={`signin-dropdown ${dropdownVisible ? 'show' : ''}`}>
               <ul>
                   <li><Link to="/signin" style={{ textDecoration: 'none', color: 'inherit' }}>Sign In</Link></li>
                   <li><Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Sign Up</Link></li>
                   <li><Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link></li>
                   <li><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Logout</Link></li>
               </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="signin-content-wrapper">
        
        {/* Hero Text */}
        <div className="signin-hero-text">
          <h1>Welcome back to<br /><span className="signin-brand-name">CampusSphere</span></h1>
          <p className="signin-subtitle">Pick up where you left off</p>
        </div>

        {/* Card */}
        <div className="signin-card-container">
            <form className="signin-glass-card" onSubmit={handleSubmit}>
              
              <div className="signin-form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter Email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="signin-form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Enter Password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="signin-forgot-password">
                <a href="#/">Forget password ?</a>
              </div>

              <button type="submit" className="signin-submit-btn">Sign in</button>

              <div className="signin-divider-text">Sign in with</div>

              <div className="signin-social-login">
                <img src={googleIcon} alt="Google sign in" className="signin-social-icon" />
                <img src={facebookIcon} alt="Facebook sign in" className="signin-social-icon" />
              </div>

              <div className="signin-signup-prompt">
                Don't have an account yet? <Link to="/signup">Sign Up</Link>
              </div>

            </form>
        </div>

      </div>
    </div>
  );
}

export default SignIn;
