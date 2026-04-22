import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import bgImage from '../icons/bg_LandingPage.png';
import logo from '../icons/logo_campusSphere.svg';
import profileIcon from '../icons/profile.svg';

// Custom Toolkit Icons
import hourglassIcon from '../icons/hourglass-outline.svg';
import journalIcon from '../icons/journal 1.svg';
import missingIcon from '../icons/missing.svg';
import calculatorIcon from '../icons/calculator.svg';

import githubIcon from '../icons/ri_github-fill.svg';
import Footer from '../components/Footer';

function Home() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="home-page">
      
      {/* --- HERO SECTION --- */}
      <div className="home-hero-section">
        {/* Navbar */}
        <div className="home-navbar">
          <div className="home-logo">
            <Link to="/">
              <img src={logo} alt="CampusSphere Logo" />
            </Link>
          </div>
          <div className="home-nav-links">
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
          <div className="home-profile-section">
            <img 
              src={profileIcon} 
              alt="Profile" 
              className="home-profile-icon" 
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div className={`home-dropdown ${dropdownVisible ? 'show' : ''}`}>
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
        <div className="home-hero-glow"></div>
        <div className="home-hero-content">
          <h1 className="home-hero-title">Your All-in-One <br />Student Life Hub</h1>
          <p className="home-hero-subtitle">
            Manage deadlines, expenses, notes, and lost & found in one secure space.
          </p>
          <Link to="/options" className="home-primary-btn">Get start!</Link>
        </div>
        <div className="hero-fade-overlay"></div>
      </div>

      <div className="white-glow-section">
        <div className="blue-glow glow-1"></div>
        <div className="blue-glow glow-2"></div>
        <div className="blue-glow glow-3"></div>
        <div className="blue-glow glow-4"></div>
        <div className="blue-glow glow-5"></div>
        <div className="blue-glow glow-6"></div>
        <div className="blue-glow glow-7"></div>
        <div className="blue-glow glow-8"></div>
        <div className="blue-glow glow-9"></div>
        <div className="blue-glow glow-10"></div>
        <div className="blue-glow glow-11"></div>
        <div className="blue-glow glow-12"></div>
        <div className="blue-glow glow-13"></div>
        <div className="blue-glow glow-14"></div>
        <div className="content-wrapper">
          {/* --- SECTION 2: HOW IT WORKS --- */}
          <div className="home-how-section" id="how-it-works">
            <h4 className="section-pre-title">Stay Organized</h4>
            <h2 className="section-title">How CampusSphere works</h2>
        <p className="section-subtitle">
          Manage your student life in seconds. Track deadlines, share notes, report lost items, and split expenses — all in one secure space.
        </p>
        
        <div className="how-grid">
          <div className="how-card">
            <div className="how-badge">1</div>
            <h3>Create Your Account</h3>
            <p>Sign up using your college email and set up your personalized student profile.</p>
          </div>
          <div className="how-card">
            <div className="how-badge">2</div>
            <h3>Access Your Dashboard</h3>
            <p>Enter your student dashboard to manage deadlines, notes, expenses, and campus essentials.</p>
          </div>
          <div className="how-card">
            <div className="how-badge">3</div>
            <h3>Connect & Share</h3>
            <p>Share notes, resources, and updates with friends, classmates, and seniors.</p>
          </div>
          <div className="how-card">
            <div className="how-badge">4</div>
            <h3>Use Smart Features</h3>
            <p>Track deadlines, report lost items, split expenses, and stay organized effortlessly.</p>
          </div>
          <div className="how-card">
            <div className="how-badge">5</div>
            <h3>Grow Together</h3>
            <p>Learn from seniors, collaborate with peers, and make student life easier every day.</p>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: STUDENT TOOLKIT --- */}
      <div className="home-toolkit-section" id="features">
        <h4 className="section-pre-title">Everything You Need</h4>
        <h2 className="section-title">Your Student Toolkit</h2>
        <p className="section-subtitle">
          Manage your student life in seconds. Track deadlines, share notes, report lost items, and split expenses — all in one secure space.
        </p>

        <div className="toolkit-grid">
          <div className="toolkit-card">
            <img src={hourglassIcon} alt="Track Deadlines" className="toolkit-icon" />
            <h3>Track Deadlines</h3>
            <p>Add assignments, due dates, and stay on top of your academic schedule.</p>
          </div>
          <div className="toolkit-card">
            <img src={journalIcon} alt="Share Notes" className="toolkit-icon" />
            <h3>Share Notes</h3>
            <p>Upload and access study notes, PYQs, and important resources anytime.</p>
          </div>
          <div className="toolkit-card">
            <img src={missingIcon} alt="Lost & Found" className="toolkit-icon" />
            <h3>Lost & Found</h3>
            <p>Report missing items or help others recover their belongings on campus.</p>
          </div>
          <div className="toolkit-card">
            <img src={calculatorIcon} alt="Split Expenses" className="toolkit-icon" />
            <h3>Split Expenses</h3>
            <p>Calculate and divide shared costs easily among friends and classmates.</p>
          </div>
          </div>
        </div>
        </div>
      </div>

      <Footer />

    </div>
  );
}

export default Home;
