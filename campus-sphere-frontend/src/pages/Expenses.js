import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Expenses.css';

// Shared assets
import logo from '../icons/logo_campusSphere.svg';
import profileIcon from '../icons/profile.svg';
import budgetingIcon from '../icons/budgeting 1.svg';

import githubIcon from '../icons/ri_github-fill.svg';
import Footer from '../components/Footer';

// Simple colors for result dots
const colors = ['#63b3ed', '#68d391', '#fc8181', '#a78bfa', '#f6ad55', '#4fd1c5'];

function Expenses() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // --- APP STATE ---
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState('');

  const [items, setItems] = useState([]);

  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemSharedBy, setNewItemSharedBy] = useState([]);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // --- ACTIONS ---
  const handleAddParticipant = () => {
    const trimmed = newParticipant.trim();
    if (trimmed && !participants.includes(trimmed)) {
      setParticipants([...participants, trimmed]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (name) => {
    setParticipants(participants.filter(p => p !== name));
    // Remove participant from shared lists
    setItems(items.map(item => ({
      ...item,
      sharedBy: item.sharedBy.filter(p => p !== name)
    })));
    setNewItemSharedBy(newItemSharedBy.filter(p => p !== name));
  };

  const toggleNewItemShare = (name) => {
    if (newItemSharedBy.includes(name)) {
      setNewItemSharedBy(newItemSharedBy.filter(p => p !== name));
    } else {
      setNewItemSharedBy([...newItemSharedBy, name]);
    }
  };

  const handleAddItem = () => {
    if (newItemName && newItemPrice && newItemSharedBy.length > 0) {
      setItems([
        ...items,
        {
          id: Date.now(),
          name: newItemName,
          price: Number(newItemPrice),
          sharedBy: newItemSharedBy
        }
      ]);
      setNewItemName('');
      setNewItemPrice('');
      setNewItemSharedBy([]);
      setIsAddingItem(false);
    }
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // --- CALCULATIONS ---
  const { totalItemsCost, grandTotal, splitResult } = useMemo(() => {
    const cost = items.reduce((sum, item) => sum + Number(item.price), 0);
    const taxVal = Number(tax) || 0;
    const discountVal = Number(discount) || 0;
    const grand = cost + taxVal - discountVal;

    // Base splits calculation
    const splits = {};
    participants.forEach(p => splits[p] = 0);

    items.forEach(item => {
      const validSharers = item.sharedBy.filter(p => participants.includes(p));
      if (validSharers.length > 0) {
        const sharePrice = Number(item.price) / validSharers.length;
        validSharers.forEach(p => {
          if (splits[p] !== undefined) splits[p] += sharePrice;
        });
      }
    });

    // Tax and discount are split equally among all active participants
    if (participants.length > 0) {
      const extraPerPerson = (taxVal - discountVal) / participants.length;
      participants.forEach(p => {
        splits[p] += extraPerPerson;
      });
    }

    return { totalItemsCost: cost, grandTotal: grand, splitResult: splits };
  }, [items, participants, tax, discount]);

  // --- SAVED SESSIONS ---
  const [savedSessions, setSavedSessions] = useState([]);
  const [sessionName, setSessionName] = useState('');

  const fetchSessions = () => {
    fetch("http://localhost:5000/expenses")
      .then(res => res.json())
      .then(data => setSavedSessions(data))
      .catch(err => console.error("Error fetching sessions:", err));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSaveSession = async () => {
    const data = {
      sessionName: sessionName || `Session ${new Date().toLocaleDateString()}`,
      participants,
      items,
      tax: Number(tax),
      discount: Number(discount),
      totalCost: totalItemsCost,
      grandTotal: Math.max(0, grandTotal),
      perPerson: Object.entries(splitResult).map(([name, amount]) => ({
        name,
        amount: Math.max(0, amount).toFixed(2),
      })),
    };

    try {
      const res = await fetch("http://localhost:5000/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSessionName('');
        fetchSessions();
        alert("Session saved!");
      }
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const handleLoadSession = (session) => {
    setParticipants(session.participants || []);
    setItems(session.items || []);
    setTax(session.tax || 0);
    setDiscount(session.discount || 0);
  };


  return (
    <div className="expenses-page">
      {/* --- HERO SECTION --- */}
      <div className="expenses-hero-section">
        {/* Navbar */}
        <div className="expenses-navbar">
          <div className="expenses-logo">
            <Link to="/">
              <img src={logo} alt="CampusSphere Logo" />
            </Link>
          </div>
          <div className="expenses-nav-links">
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
          <div className="expenses-profile-section">
            <img
              src={profileIcon}
              alt="Profile"
              className="expenses-profile-icon"
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div className={`expenses-dropdown ${dropdownVisible ? 'show' : ''}`}>
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
        <div className="expenses-hero-content">
          <img src={budgetingIcon} alt="Expense Splitter" className="expenses-hero-icon" />
          <h1 className="expenses-hero-title">Expense Splitter</h1>
          <p className="expenses-hero-subtitle">
            Easily split the bill with friends based on what each person ordered
          </p>
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <div className="expenses-main-section">
        <div className="expenses-content-wrapper">
          
          {/* --- BILL SUMMARY --- */}
          <div className="expenses-card">
            <h2 className="card-title">Bill Summary</h2>
            <div className="summary-grid">
              {/* Left Column */}
              <div className="summary-col">
                <div className="summary-row">
                  <span className="summary-label">Total Items:</span>
                  <span className="summary-value">₹{totalItemsCost}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label"></span>
                  <span className="summary-value"></span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row summary-grand">
                  <span className="summary-label">Total Cost:</span>
                  <span className="summary-value">₹{Math.max(0, grandTotal)}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="summary-col">
                <div className="summary-row">
                  <span className="summary-label">Tax (₹):</span>
                  <input 
                    type="number" 
                    className="summary-input" 
                    value={tax} 
                    onChange={(e) => setTax(e.target.value)} 
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="summary-row">
                  <span className="summary-label">Discount (₹):</span>
                  <input 
                    type="number" 
                    className="summary-input" 
                    value={discount} 
                    onChange={(e) => setDiscount(e.target.value)} 
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row summary-grand">
                  <span className="summary-label">Grand Total:</span>
                  <span className="summary-value">₹{Math.max(0, grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- PARTICIPANTS & ITEMS --- */}
          <div className="expenses-card participants-items-card">
            {/* Participants */}
            <div className="participants-section">
              <h2 className="card-title fade-title">Add Participants</h2>
              <div className="participants-header">
                <div className="participants-pills">
                  {participants.length === 0 ? <p className="empty-text">No participants added.</p> : null}
                  {participants.map(p => (
                    <div key={p} className="participant-pill">
                      {p}
                      <span className="pill-close" onClick={() => handleRemoveParticipant(p)}>×</span>
                    </div>
                  ))}
                </div>
                <div className="add-friend-wrapper">
                  <input 
                    type="text" 
                    className="add-friend-input" 
                    placeholder="Name" 
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                  />
                  <button className="add-friend-btn" onClick={handleAddParticipant}>
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="items-section">
              <div className="items-table-header">
                <span className="th-name">Items Ordered</span>
                <span className="th-price">Price</span>
                <span className="th-shared">Shared By</span>
                <span className="th-action"></span>
              </div>

              <div className="items-list">
                {items.length === 0 ? <p className="empty-text">No items added yet.</p> : null}
                {items.map((item) => (
                  <div key={item.id} className="item-row">
                    <div className="item-name-col">
                      <div className="checkbox-tick">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5.5 9L9.5 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <div className="item-price-col">₹{item.price}</div>
                    <div className="item-shared-col">
                      <span>{item.sharedBy.join(', ')}</span>
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="share-icon"><path d="M1 5L5 9L13 1" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="item-action-col">
                      <span className="remove-item-text" onClick={() => handleRemoveItem(item.id)}>×</span>
                    </div>
                  </div>
                ))}
              </div>

              {isAddingItem ? (
                <div className="add-item-form">
                  <input 
                    type="text" 
                    placeholder="Item Name (e.g. Pizza)" 
                    className="item-form-input"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Price (₹)" 
                    className="item-form-input"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                  />
                  <div className="share-selectors">
                    <span className="share-label">Shared by:</span>
                    {participants.map(p => (
                      <button 
                        key={p} 
                        className={`share-toggle-btn ${newItemSharedBy.includes(p) ? 'active' : ''}`}
                        onClick={() => toggleNewItemShare(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="add-form-actions">
                    <button className="add-item-submit-btn" onClick={handleAddItem}>Save Item</button>
                    <button className="add-item-cancel-btn" onClick={() => setIsAddingItem(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="add-item-container">
                  <button className="add-item-btn" onClick={() => setIsAddingItem(true)}>
                    + Add Item
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* --- RESULT --- */}
          <h2 className="result-title">Result Breakdown</h2>
          <div className="expenses-card result-card">
            {participants.length === 0 ? (
               <p className="empty-text">Add participants to see calculation.</p>
            ) : (
              participants.map((p, idx) => (
                <div key={p} className="result-row">
                  <div className="result-person">
                    <div className="person-dot" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                    <span>{p}</span>
                  </div>
                  <div className="result-amount">₹{Math.max(0, splitResult[p] || 0).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>

          {/* --- SAVE SESSION --- */}
          <div className="expenses-card save-session-card">
            <h3 className="card-label">Save This Session</h3>
            <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
              <input
                type="text"
                className="session-name-input"
                placeholder="Session name (optional)"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
              <button className="add-item-submit-btn" onClick={handleSaveSession}>
                💾 Save
              </button>
            </div>
            <p className="session-meta-text">
              {participants.length} {participants.length === 1 ? 'person' : 'people'} · {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* --- SAVED SESSIONS LIST --- */}
          {savedSessions.length > 0 && (
            <>
              <h2 className="result-title">Saved Sessions</h2>
              <div className="expenses-card">
                {savedSessions.map((session) => (
                  <div key={session._id} className="saved-session-block" onClick={() => handleLoadSession(session)}>
                    <div className="saved-session-header">
                      <div className="result-person">
                        <div className="person-dot" style={{ backgroundColor: '#6a82fb' }}></div>
                        <span>{session.sessionName || 'Untitled'}</span>
                      </div>
                      <div className="result-amount">
                        ₹{session.grandTotal ?? '—'}
                      </div>
                    </div>
                    <div className="saved-session-meta">
                      {session.participants?.length || 0} {(session.participants?.length || 0) === 1 ? 'person' : 'people'} · {session.items?.length || 0} {(session.items?.length || 0) === 1 ? 'item' : 'items'}
                    </div>
                    {session.perPerson && session.perPerson.length > 0 && (
                      <div className="saved-session-splits">
                        {session.perPerson.map((p, idx) => (
                          <div key={idx} className="split-row">
                            <span className="split-name">
                              <div className="person-dot-sm" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                              {p.name}
                            </span>
                            <span className="split-amount">₹{p.amount}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

    </div>
  );
}

export default Expenses;
