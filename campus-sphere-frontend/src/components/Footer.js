import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import './Footer.css';

// Assets
import logo from '../icons/logo_campusSphere.svg';
import gmailIcon from '../icons/gmail.svg';
import instagramIcon from '../icons/instagram-filled.svg';
import linkedinIcon from '../icons/linkedin.svg';
import githubIcon from '../icons/ri_github-fill.svg';

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const modalContent = {
    about: {
      title: "About the Project",
      content: (
        <>
          <p><strong>CampusSphere</strong> is a personalized student hub designed to streamline academic and campus life through integrated digital tools.</p>
          <p>Created by <strong>Ayadee Aphiwatamorn</strong> as a final year personal project, the platform aims to solve everyday campus challenges like tracking scattered deadlines, sharing study resources, and managing shared group expenses.</p>
          <h3>Our Vision</h3>
          <p>To foster a collaborative student ecosystem where learning and campus management are effortless and connected.</p>
        </>
      )
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <>
          <p>Last Updated: April 2026</p>
          <p>At CampusSphere, we take your privacy seriously. This policy describes how we collect and use your data:</p>
          <h3>1. Data Collection</h3>
          <p>We collect information you provide directly to us (name, email, university details) via Firebase Authentication and MongoDB.</p>
          <h3>2. Data Usage</h3>
          <p>Your data is used solely to provide and improve the services offered by the platform, such as your profile and dashboard stats.</p>
          <h3>3. Security</h3>
          <p>We utilize industry-standard cloud security provided by Firebase and MongoDB Atlas to protect your personal information.</p>
        </>
      )
    },
    terms: {
      title: "Terms & Conditions",
      content: (
        <>
          <p>By using CampusSphere, you agree to the following terms:</p>
          <h3>1. Acceptable Use</h3>
          <p>Users must not upload harmful, illegal, or copyrighted material without permission. The "Notes Sharing" feature is intended for educational purposes only.</p>
          <h3>2. Resource Sharing</h3>
          <p>You retain ownership of any notes you upload, but grant CampusSphere users a license to view and download them for personal use.</p>
          <h3>3. Termination</h3>
          <p>We reserve the right to suspend accounts that violate our community guidelines or engage in harassment.</p>
        </>
      )
    }
  };

  const handleOpenModal = (e, type) => {
    e.preventDefault();
    setActiveModal(type);
  };

  return (
    <>
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
              <li><a href="/#features">Features</a></li>
              <li><a href="/#how-it-works">How it works</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-right">
            <h4 className="footer-heading">INFORMATION</h4>
            <ul className="footer-links">
              <li><a href="#about" onClick={(e) => handleOpenModal(e, 'about')}>About the Project</a></li>
              <li><a href="#privacy" onClick={(e) => handleOpenModal(e, 'privacy')}>Privacy Policy</a></li>
              <li><a href="#terms" onClick={(e) => handleOpenModal(e, 'terms')}>Terms & Conditions</a></li>
            </ul>

            <div className="footer-social">
              <a href="mailto:contact@campussphere.com" className="social-icon-wrapper">
                <img src={gmailIcon} alt="Gmail" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper">
                <img src={githubIcon} alt="GitHub" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper">
                <img src={instagramIcon} alt="Instagram" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper">
                <img src={linkedinIcon} alt="LinkedIn" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CampusSphere — Personal Project by Ayadee Aphiwatamorn. All rights reserved.</p>
        </div>
      </footer>

      {activeModal && (
        <Modal 
          title={modalContent[activeModal].title}
          content={modalContent[activeModal].content}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
};

export default Footer;
