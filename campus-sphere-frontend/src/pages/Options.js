import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Options.css';

// Shared assets
import logo from '../icons/logo_campusSphere.svg';
import profileIcon from '../icons/profile.svg';

// Option card icons
import deadlineIcon from '../icons/deadline 1.svg';
import pencilIcon from '../icons/pencil 1.svg';
import lostItemsIcon from '../icons/lost-items 1.svg';
import budgetingIcon from '../icons/budgeting 1.svg';

// Socials
import gmailIcon from '../icons/gmail.svg';
import instagramIcon from '../icons/instagram-filled.svg';
import linkedinIcon from '../icons/linkedin.svg';
import githubIcon from '../icons/ri_github-fill.svg';

function Options() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="options-page">

      {/* --- HERO SECTION WITH BG --- */}
      <div className="options-hero-section">
        {/* Navbar */}
        <div className="options-navbar">
          <div className="options-logo">
            <Link to="/">
              <img src={logo} alt="CampusSphere Logo" />
            </Link>
          </div>
          <div className="options-nav-links">
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
          <div className="options-profile-section">
            <img 
              src={profileIcon} 
              alt="Profile" 
              className="options-profile-icon" 
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div className={`options-dropdown ${dropdownVisible ? 'show' : ''}`}>
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

        {/* Hero Content */}
        <div className="options-hero-content">
          <h1 className="options-hero-title">What would you like to do today?</h1>
          <p className="options-hero-highlight">Choose an option to get started</p>
          <p className="options-hero-subtitle">
            Manage your deadlines, notes, lost items and expenses with a single click.
          </p>
        </div>
      </div>

      {/* --- OPTIONS CARDS GRID --- */}
      <div className="options-cards-section">
        <div className="options-grid">

          <div className="option-card">
            <div className="option-card-inner">
              <img src={deadlineIcon} alt="Deadline Tracker" className="option-icon" />
              <h3 className="option-title">Deadline Tracker</h3>
              <Link to="/deadlines" className="option-btn">Get start!</Link>
            </div>
          </div>

          <div className="option-card">
            <div className="option-card-inner">
              <img src={pencilIcon} alt="Notes Sharing" className="option-icon" />
              <h3 className="option-title">Notes Sharing</h3>
              <Link to="/notes" className="option-btn">Get start!</Link>
            </div>
          </div>

          <div className="option-card">
            <div className="option-card-inner">
              <img src={lostItemsIcon} alt="Lost & Found" className="option-icon" />
              <h3 className="option-title">Lost & Found</h3>
              <Link to="/lostfound" className="option-btn">Get start!</Link>
            </div>
          </div>

          <div className="option-card">
            <div className="option-card-inner">
              <img src={budgetingIcon} alt="Expense Split" className="option-icon" />
              <h3 className="option-title">Expense Split</h3>
              <Link to="/expenses" className="option-btn">Get start!</Link>
            </div>
          </div>

        </div>
      </div>

      {/* --- FOOTER (same as Home) --- */}
      <footer className="home-footer" id="contact">
        <div className="footer-content">
          <div className="footer-left">
            <Link to="/">
              <img src={logo} alt="CampusSphere Logo" className="footer-logo" />
            </Link>
            <p>
              CampusSphere is a student-focused platform designed to simplify campus life through smart tools for deadlines, note sharing, lost & found, and expense management. Built as a personal project with the vision to grow into a real student support ecosystem in the future.
            </p>
          </div>

          <div className="footer-middle">
            <h4 className="footer-heading">PROJECT</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/">How it works</Link></li>
              <li><Link to="/">Features</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-right">
            <h4 className="footer-heading">INFORMATION</h4>
            <ul className="footer-links">
              <li><Link to="/">About the Project</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms & Conditions</Link></li>
            </ul>

            <div className="footer-social">
              <div className="social-icon-wrapper">
                <img src={gmailIcon} alt="Gmail" href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=new" />
              </div>
              <div className="social-icon-wrapper">
                <img src={githubIcon} alt="GitHub" href="https://github.com/AyadeeAphiwatamorn" />
              </div>
              <div className="social-icon-wrapper">
                <img src={instagramIcon} alt="Instagram" href ="https://www.instagram.com/hilxmy/" />
              </div>
              <div className="social-icon-wrapper">
                <img src={linkedinIcon} alt="LinkedIn" href = "https://www.linkedin.com/in/ayadee-aphiwatamorn1878/" />
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CampusSphere — Personal Project by Ayadee Aphiwatamorn. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default Options;
