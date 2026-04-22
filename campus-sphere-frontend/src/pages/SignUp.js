import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import bgImage from '../icons/bg.png';
import logo from '../icons/logo_campusSphere.svg';
import profileIcon from '../icons/profile.svg';
import googleIcon from '../icons/google icon.svg';
import facebookIcon from '../icons/facebook icon.svg';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const EyeIcon = ({ show, onClick }) => (
  <svg 
    onClick={onClick} 
    className="signup-eye-icon" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {show ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    )}
  </svg>
);

function SignUp() {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201) {
        alert("Registration successful! Please sign in.");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.response?.data?.message || "Error signing up. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
      navigate("/profile");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-page">
      {/* Background */}
      <div 
        className="signup-background" 
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="signup-bg-overlay"></div>
      </div>
    
      {/* Navbar Section */}
      <div className="signup-navbar">
      
        <div className="signup-logo">
          <Link to="/">
            <img src={logo} alt="CampusSphere Logo" />
          </Link>
        </div>
        <div className="signup-nav-links">
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
        <div className="signup-profile-section">
          <img 
            src={profileIcon} 
            alt="Profile" 
            className="signup-profile-icon" 
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className={`signup-dropdown ${dropdownVisible ? 'show' : ''}`}>
               <ul>
                   <li><Link to="/signin">Sign In</Link></li>
                   <li><Link to="/signup">Sign Up</Link></li>
                   <li><Link to="/profile">Profile</Link></li>
                   <li><Link to="/">Logout</Link></li>
               </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="signup-content-wrapper">
        
        {/* Hero Text */}
        <div className="signup-hero-text">
          <h1>Join<br /><span className="signup-brand-name">CampusSphere</span><br />your all-in-one student life hub</h1>
          <p className="signup-subtitle">Create your space, connect, and stay organized</p>
        </div>

        {/* Card */}
        <div className="signup-card-container">
            <form className="signup-glass-card" onSubmit={handleSubmit}>
              
              <div className="signup-form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="signup-form-group">
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

              <div className="signup-form-group">
                <label>Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Enter Password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <EyeIcon show={showPassword} onClick={togglePasswordVisibility} />
              </div>

              <div className="signup-checkbox-group">
                <input 
                  type="checkbox" 
                  id="agreement" 
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <label htmlFor="agreement">I agree to the processing of Personal data</label>
              </div>

              <button type="submit" className="signup-submit-btn">Sign up</button>

              <div className="signup-divider-text">Sign up with</div>

              <div className="signup-social-login">
                <img src={googleIcon} alt="Google sign in" className="signup-social-icon" onClick={handleGoogleLogin}/>
                <img src={facebookIcon} alt="Facebook sign in" className="signup-social-icon" />
              </div>

              <div className="signup-signin-prompt">
                Have account already? <Link to="/signin">Sign in</Link>
              </div>

            </form>
        </div>

      </div>
    </div>
  );
}

export default SignUp;
