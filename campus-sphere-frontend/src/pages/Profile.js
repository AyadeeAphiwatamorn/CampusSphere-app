import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

// Shared assets
import logo from '../icons/logo_campusSphere.svg';
import profileIcon from '../icons/profile.svg';

import githubIcon from '../icons/ri_github-fill.svg';
import Footer from '../components/Footer';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    university: "",
    department: "",
    semester: "",
    studentId: "",
    bio: "",
  });
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState({
    notes: [],
    lostFound: [],
    expenses: [],
    deadlines: []
  });

  // 🕒 Relative Time Helper
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // 📥 Fetch user profile from backend
  const fetchProfile = async (uid) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${uid}`);
      const data = await res.json();
      if (data) {
        setProfile(data);
        setTempProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // Auth & Dashboard Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProfile(currentUser.uid);
        fetchDashboardData();
      } else {
        // Check localStorage for custom auth
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          fetchProfile(parsedUser.uid);
          fetchDashboardData();
        } else {
          setUser(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const endpoints = ['notes', 'lostfound', 'expenses', 'deadlines'];
      const [notes, lostFound, expenses, deadlines] = await Promise.all(
        endpoints.map(ep => fetch(`http://localhost:5000/${ep}`).then(res => res.json()))
      );

      setDashboardData({
        notes: Array.isArray(notes) ? notes : [],
        lostFound: Array.isArray(lostFound) ? lostFound : [],
        expenses: Array.isArray(expenses) ? expenses : [],
        deadlines: Array.isArray(deadlines) ? deadlines : []
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Sync basic info if profile is empty
  useEffect(() => {
    if (user && !profile.fullName) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.displayName || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user, profile.fullName]);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // Handlers
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = async () => {
    if (!user) {
      alert("Please sign in to save changes.");
      return;
    }

    if (isEditing) {
      const updatedProfile = {
        ...tempProfile,
        uid: user.uid,
        name: tempProfile.fullName,
        email: user.email,
        photo: user.photoURL || profilePic,
      };

      console.log("📤 Sending Profile Update:", updatedProfile);

      try {
        // 📤 SAVE TO DB using fetch
        const res = await fetch("http://localhost:5000/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        });

        const savedData = await res.json();
        console.log("📥 Server Response:", savedData);

        if (res.ok) {
          setProfile(savedData);
          setIsEditing(false);
          alert("Profile updated successfully!");
        } else {
          alert(`Error: ${savedData.message || "Failed to update profile"}`);
        }
      } catch (error) {
        console.error("❌ Error saving profile:", error);
        alert("An error occurred while saving your profile.");
      }
    } else {
      setTempProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setTempProfile({ ...tempProfile, [field]: value });
  };

  const displayProfile = isEditing ? tempProfile : profile;

  // Dynamic Stats
  const stats = [
    { label: 'Notes Shared', value: dashboardData.notes.length, icon: '📝' },
    { label: 'Items Found', value: dashboardData.lostFound.length, icon: '🔍' },
    { label: 'Expenses Split', value: dashboardData.expenses.length, icon: '💰' },
    { label: 'Deadlines Met', value: dashboardData.deadlines.length, icon: '✅' },
  ];

  // Dynamic Recent Activity
  const activities = [
    ...dashboardData.notes.map(n => ({
      action: `Uploaded ${n.topic}`,
      time: formatRelativeTime(n.createdAt),
      type: 'note',
      rawDate: new Date(n.createdAt)
    })),
    ...dashboardData.lostFound.map(i => ({
      action: `Reported ${i.itemName}`,
      time: formatRelativeTime(i.createdAt),
      type: 'lost',
      rawDate: new Date(i.createdAt)
    })),
    ...dashboardData.expenses.map(e => ({
      action: `Split ${e.sessionName} bill`,
      time: formatRelativeTime(e.createdAt),
      type: 'expense',
      rawDate: new Date(e.createdAt)
    })),
    ...dashboardData.deadlines.map(d => ({
      action: `Added ${d.title} deadline`,
      time: formatRelativeTime(d.createdAt),
      type: 'deadline',
      rawDate: new Date() // Deadlines might not have createdAt in some versions, assuming recent
    }))
  ]
  .sort((a, b) => b.rawDate - a.rawDate)
  .slice(0, 5);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'note': return '📄';
      case 'expense': return '💳';
      case 'lost': return '📦';
      case 'deadline': return '⏰';
      default: return '📌';
    }
  };

  return (
    <div className="profile-page">
      {/* --- HERO SECTION --- */}
      <div className="profile-hero-section">
        {/* Navbar */}
        <div className="profile-navbar">
          <div className="profile-logo">
            <Link to="/">
              <img src={logo} alt="CampusSphere Logo" />
            </Link>
          </div>
          <div className="profile-nav-links">
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
          <div className="profile-nav-profile-section">
            <img
              src={profilePic || user?.photoURL || profileIcon}
              alt="profile"
              className="profile-nav-icon"
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div className={`profile-dropdown ${dropdownVisible ? 'show' : ''}`}>
                <ul>
                  <li><Link to="/signin">Sign In</Link></li>
                  <li><Link to="/signup">Sign Up</Link></li>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/" onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    auth.signOut();
                  }}>Logout</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Hero Content */}
        <div className="profile-hero-content">
          <h1 className="profile-hero-title">My Profile</h1>
          <p className="profile-hero-subtitle">
            Manage your account, track your activity, and personalize your CampusSphere experience
          </p>
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <div className="profile-main-section">
        <div className="profile-content-wrapper">

          {/* TOP ROW: Avatar Card + Stats */}
          <div className="profile-top-row">

            {/* Avatar Card */}
            <div className="profile-glass-card avatar-card">
              <div className="avatar-wrapper">
                <div className="avatar-circle" onClick={() => fileInputRef.current.click()}>
                  {profilePic || user?.photoURL ? (
                    <img src={profilePic || user?.photoURL} alt="Profile" className="avatar-image" />
                  ) : (
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#8b9efd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="#8b9efd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  <div className="avatar-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePicChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <h2 className="avatar-name">{displayProfile.fullName || "User Name"}</h2>
              <p className="avatar-role">{displayProfile.department || "No Department"}</p>
              <p className="avatar-id">{displayProfile.studentId || "No ID"}</p>
              <div className="avatar-actions">
                <button className="edit-profile-btn" onClick={handleEditToggle}>
                  {isEditing ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Save Changes
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit Profile
                    </>
                  )}
                </button>
                {isEditing && (
                  <button className="cancel-edit-btn" onClick={handleCancelEdit}>Cancel</button>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, idx) => (
                <div key={idx} className="profile-glass-card stat-card">
                  <span className="stat-emoji">{stat.icon}</span>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM ROW: Info + Activity */}
          <div className="profile-bottom-row">

            {/* Personal Information */}
            <div className="profile-glass-card info-card">
              <h3 className="card-heading">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#65749b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Personal Information
              </h3>

              <div className="info-grid">
                <div className="info-field">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input type="text" className="info-input" value={tempProfile.fullName} onChange={(e) => handleFieldChange('fullName', e.target.value)} />
                  ) : (
                    <p>{displayProfile.fullName || "—"}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Email</label>
                  {isEditing ? (
                    <input type="email" className="info-input" value={tempProfile.email} onChange={(e) => handleFieldChange('email', e.target.value)} disabled />
                  ) : (
                    <p>{displayProfile.email || "—"}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Phone</label>
                  {isEditing ? (
                    <input type="tel" className="info-input" value={tempProfile.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} />
                  ) : (
                    <p>{displayProfile.phone || "—"}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>University</label>
                  {isEditing ? (
                    <input type="text" className="info-input" value={tempProfile.university} onChange={(e) => handleFieldChange('university', e.target.value)} />
                  ) : (
                    <p>{displayProfile.university || "—"}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Department</label>
                  {isEditing ? (
                    <input type="text" className="info-input" value={tempProfile.department} onChange={(e) => handleFieldChange('department', e.target.value)} />
                  ) : (
                    <p>{displayProfile.department || "—"}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Semester</label>
                  {isEditing ? (
                    <select className="info-input info-select" value={tempProfile.semester} onChange={(e) => handleFieldChange('semester', e.target.value)}>
                      <option value="">Select Semester</option>
                      {[1,2,3,4,5,6,7,8].map(s => (
                        <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                      ))}
                    </select>
                  ) : (
                    <p>{displayProfile.semester || "—"}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Student ID</label>
                  {isEditing ? (
                    <input type="text" className="info-input" placeholder="e.g. CU-2024-0042" value={tempProfile.studentId} onChange={(e) => handleFieldChange('studentId', e.target.value)} />
                  ) : (
                    <p>{displayProfile.studentId || "—"}</p>
                  )}
                </div>
              </div>

              <div className="info-field bio-field">
                <label>Bio</label>
                {isEditing ? (
                  <textarea className="info-input info-textarea" rows="3" value={tempProfile.bio} onChange={(e) => handleFieldChange('bio', e.target.value)} />
                ) : (
                  <p>{displayProfile.bio || "—"}</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="profile-glass-card activity-card">
              <h3 className="card-heading">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#65749b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Recent Activity
              </h3>

              <div className="activity-list">
                {activities.map((act, idx) => (
                  <div key={idx} className="activity-item">
                    <span className="activity-icon">{getActivityIcon(act.type)}</span>
                    <div className="activity-info">
                      <p className="activity-action">{act.action}</p>
                      <p className="activity-time">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="quick-links-section">
                <h4 className="quick-links-title">Quick Links</h4>
                <div className="quick-links-grid">
                  <Link to="/deadlines" className="quick-link-btn">📅 Deadlines</Link>
                  <Link to="/notes" className="quick-link-btn">📝 Notes</Link>
                  <Link to="/lostfound" className="quick-link-btn">🔍 Lost & Found</Link>
                  <Link to="/expenses" className="quick-link-btn">💰 Expenses</Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
