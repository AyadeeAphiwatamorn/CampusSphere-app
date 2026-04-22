import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LostFound.css';

// Shared assets
import logo from '../icons/logo_campusSphere.svg';
import profileIcon from '../icons/profile.svg';
import lostItemsIcon from '../icons/lost-items 1.svg';

import githubIcon from '../icons/ri_github-fill.svg';
import Footer from '../components/Footer';

function LostFound() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Form state
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Bottle');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = React.useRef(null);

  // Data from backend
  const [items, setItems] = useState([]);

  // 📥 Fetch items from backend
  const fetchItems = () => {
    fetch("http://localhost:5000/lostfound")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Error fetching lost items:", err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const getEmoji = (cat, name) => {
    const n = name.toLowerCase();
    if (n.includes('phone') || n.includes('iphone') || cat === 'Electronics') return '📱';
    if (n.includes('key')) return '🔑';
    if (n.includes('wallet') || cat === 'Wallet') return '👛';
    if (n.includes('card') || n.includes('id')) return '🪪';
    if (n.includes('bottle') || cat === 'Bottle') return '🍼';
    if (n.includes('pen') || n.includes('pencil') || cat === 'Stationery') return '✏️';
    if (n.includes('book') || n.includes('notebook')) return '📖';
    if (n.includes('bag') || n.includes('backpack')) return '🎒';
    if (n.includes('watch')) return '⌚';
    return '📦';
  };

  // ➕ Report item to backend
  const handleReportItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !location || !date) return;

    const formData = new FormData();
    formData.append("itemName", itemName);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("contact", contact);
    formData.append("emoji", getEmoji(category, itemName));
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:5000/add-lostfound", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setItemName('');
        setLocation('');
        setDate('');
        setCategory('Bottle');
        setDescription('');
        setContact('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchItems();
      }
    } catch (error) {
      console.error("Error reporting item:", error);
    }
  };

  return (
    <div className="lostfound-page">
      {/* --- HERO SECTION --- */}
      <div className="lostfound-hero-section">
        {/* Navbar */}
        <div className="lostfound-navbar">
          <div className="lostfound-logo">
            <Link to="/">
              <img src={logo} alt="CampusSphere Logo" />
            </Link>
          </div>
          <div className="lostfound-nav-links">
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
          <div className="lostfound-profile-section">
            <img
              src={profileIcon}
              alt="Profile"
              className="lostfound-profile-icon"
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div className={`lostfound-dropdown ${dropdownVisible ? 'show' : ''}`}>
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
        <div className="lostfound-hero-content">
          <img src={lostItemsIcon} alt="Lost & Found" className="lostfound-hero-icon" />
          <h1 className="lostfound-hero-title">Lost & Found</h1>
          <p className="lostfound-hero-subtitle">
            Report missing items or help students recover their belongings quickly.
          </p>
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <div className="lostfound-main-section">
        {/* Transparent Form Container Overlay */}
        <div className="lostfound-form-container">
          <form className="lostfound-form" onSubmit={handleReportItem}>
            <div className="form-row form-row-half">
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Blue Water Bottle"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input input-icon-calendar"
                  placeholder="e.g. Library 2nd Floor"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row form-row-half">
              <div className="form-group">
                <label className="form-label">Date Lost / Found</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Bottle">Bottle</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Wallet">Wallet/ID</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Item Description</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Color, brand, unique marks, where last seen"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Upload Image (Optional)</label>
                <input
                  type="file"
                  className="form-input"
                  ref={fileInputRef}
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contact Information"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="lostfound-submit-btn">Report Item</button>
            </div>
          </form>
        </div>

        {/* --- RECENT ITEMS --- */}
        <div className="lostfound-recent-section">
          <h2 className="recent-items-title">Recently Reported Items</h2>
          
          <div className="recent-items-list">
            {items.length === 0 ? (
              <p className="recent-empty">No items reported recently.</p>
            ) : null}
            {items.map((item) => (
              <div key={item._id} className="recent-item-card">
                <div className="item-card-left">
                  <div className="item-image-placeholder item-emoji">
                    {item.imageUrl ? (
                      <img 
                        src={`http://localhost:5000/uploads/${item.imageUrl}`} 
                        alt={item.itemName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                      />
                    ) : (
                      item.emoji || '📦'
                    )}
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.itemName}</h3>
                    <p className="item-location">
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="location-icon">
                        <path d="M6 0C2.68629 0 0 2.68629 0 6C0 10.5 6 14 6 14C6 14 12 10.5 12 6C12 2.68629 9.31371 0 6 0ZM6 8.5C4.61929 8.5 3.5 7.38071 3.5 6C3.5 4.61929 4.61929 3.5 6 3.5C7.38071 3.5 8.5 4.61929 8.5 6C8.5 7.38071 7.38071 8.5 6 8.5Z" fill="#718096"/>
                      </svg>
                      {item.location}
                    </p>
                    <p className="item-date">{item.date}</p>
                  </div>
                </div>
                <div className="item-card-right">
                  <button className="contact-btn" onClick={() => alert(`Contact Information: ${item.contact || 'No contact provided'}`)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V10C16 12.2091 14.2091 14 12 14H6L2 16V14C0.89543 14 0 13.1046 0 12V4ZM12 4H4V6H12V4ZM8 8H4V10H8V8Z" fill="#6A82FB"/>
                    </svg>
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LostFound;
