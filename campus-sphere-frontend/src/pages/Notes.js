import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Notes.css';

// Shared assets
import logo from '../icons/logo_campusSphere.svg';
import profileIcon from '../icons/profile.svg';
import notesIcon from '../icons/pencil 1.svg'; // The options mock used pencil 1.svg for notes

import githubIcon from '../icons/ri_github-fill.svg';
import Footer from '../components/Footer';

function Notes() {
  const [file, setFile] = useState(null);
  const fileInputRef = React.useRef(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // --- STATE FOR FUNCTIONALITY ---
  // Search
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('Semester 4');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');

  // Upload Form
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadSemester, setUploadSemester] = useState('Semester 4');
  const [uploadCourseCode, setUploadCourseCode] = useState('');
  const [uploadTopic, setUploadTopic] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  
  // Note Requests Form
  const [requestDesc, setRequestDesc] = useState('');

  // Data from backend
  const [notes, setNotes] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  
  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const uid = user?.uid || null;

  // Derive saved notes from the notes list
  const savedNotes = notes.filter(n => n.savedBy?.includes(uid));

  // 📥 Fetch notes from backend
  const fetchNotes = () => {
    fetch("http://localhost:5000/notes")
      .then(res => res.json())
      .then(data => {
        console.log("FETCHED DATA:", data);

        // 🔥 FIX HERE
        if (Array.isArray(data)) {
          setNotes(data);
        } else if (Array.isArray(data.notes)) {
          setNotes(data.notes);
        } else {
          console.error("Invalid data:", data);
          setNotes([]);
        }
      })
      .catch(err => {
        console.error("Error fetching notes:", err);
        setNotes([]);
      });
  };
  const fetchRequests = () => {
    fetch("http://localhost:5000/api/note-requests")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMyRequests(data);
      })
      .catch(err => console.error("Error fetching requests:", err));
  };

  useEffect(() => {
      fetchNotes();
      fetchRequests();
  }, []);

  const handleUploadSubmit = async () => {
   

    // Debug: log all state values before upload
    console.log("Uploading:", {
      file,
      uploadTopic,
      uploadSubject,
      uploadSemester,
      uploadCourseCode,
      uploadDescription,
    });

    if (!file) {
      alert("Please select a file");
      return;
    }

    // Build FormData manually from React state (NOT from e.target)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("topic", uploadTopic);
    formData.append("subject", uploadSubject);
    formData.append("semester", uploadSemester);
    formData.append("courseCode", uploadCourseCode);
    formData.append("description", uploadDescription);

    try {
      const res = await fetch("http://localhost:5000/add-note", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("SAVED:", data);

      // Reset all form state
      setUploadSubject('');
      setUploadCourseCode('');
      setUploadTopic('');
      setUploadDescription('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh notes list
      fetchNotes();

    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestDesc) return;
    
    try {
      const res = await fetch("http://localhost:5000/api/note-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: requestDesc,
          requestedBy: uid
        })
      });

      if (res.ok) {
        setRequestDesc('');
        fetchRequests();
      }
    } catch (err) {
      console.error("Error submitting request:", err);
    }
  };

  const toggleSaveNote = async (id) => {
    if (!uid) {
      alert("Please sign in to save notes.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}/toggle-save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid })
      });

      if (res.ok) {
        // Refresh notes to update visual state
        fetchNotes();
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  

 const filteredNotes = (Array.isArray(notes) ? notes : []).filter(note => {
  const topic = note.topic || "";
  const subject = note.subject || "";
  const searchText = (search || "").toLowerCase();

  return (
    topic.toLowerCase().includes(searchText) ||
    subject.toLowerCase().includes(searchText)
  );
});

  return (
    <div className="notes-page">
      {/* --- HERO SECTION --- */}
      <div className="notes-hero-section">
        {/* Navbar */}
        <div className="notes-navbar">
          <div className="notes-logo">
            <Link to="/">
              <img src={logo} alt="CampusSphere Logo" />
            </Link>
          </div>
          <div className="notes-nav-links">
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
          <div className="notes-profile-section">
            <img
              src={profileIcon}
              alt="Profile"
              className="notes-profile-icon"
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div className={`notes-dropdown ${dropdownVisible ? 'show' : ''}`}>
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
        <div className="notes-hero-content">
          <img src={notesIcon} alt="Note Sharing" className="notes-hero-icon" />
          <h1 className="notes-hero-title">Note Sharing</h1>
          <p className="notes-hero-subtitle">
            Share, discover, and, access notes from friends, seniors, and juniors
          </p>
        </div>
      </div>

      {/* --- MAIN SECTION --- */}
      <div className="notes-main-section">
        <div className="notes-content-wrapper">

          {/* Top Search Bar */}
          <div className="search-container glass-card">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#65749b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search notes by subject or topic" 
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="search-filters">
              <select 
                className="filter-select"
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
              
              <select 
                className="filter-select"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="All Subjects">All Subjects</option>
                <option value="DBMS">DBMS</option>
                <option value="OS">OS</option>
                <option value="CN">Computer Networks</option>
                <option value="Math">Maths</option>
              </select>
            </div>
          </div>

          {/* Grid Layout below search */}
          <div className="notes-grid-layout">
            
            {/* LEFT COLUMN */}
            <div className="grid-left-col">
              
              {/* Upload Notes Form */}
              <div className="glass-card upload-notes-card">
                <h3 className="card-heading">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#65749b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"/>
                  </svg>
                  Upload Notes
                </h3>
                
                <div className="upload-form" onSubmit={handleUploadSubmit}>
                  <input type="text"  name="subject" placeholder="Subject" className="form-input" value={uploadSubject} onChange={e => setUploadSubject(e.target.value)} required/>
                  
                  <select name="semester" className="form-input custom-arrow" value={uploadSemester} onChange={e => setUploadSemester(e.target.value)}>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                  
                  <input type="text" name="courseCode" placeholder="Course Code" className="form-input" value={uploadCourseCode} onChange={e => setUploadCourseCode(e.target.value)} />
                  <input type="text" name="topic" placeholder="e.g. Unit 3 Normalization" className="form-input" value={uploadTopic} onChange={e => setUploadTopic(e.target.value)} />
                  
                  <div className="form-group-spaced">
                    <label>Description</label>
                    <textarea 
                      placeholder="Add short details about the notes" 
                      className="form-input auto-resize" 
                      rows="2"
                      name="description"
                      value={uploadDescription}
                      onChange={e => setUploadDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-group-spaced">
                    <label>Upload File</label>
                    <input 
                      type="file"
                      name="file"
                      ref={fileInputRef}
                      className="form-input"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        console.log("SELECTED FILE:", selectedFile);
                        setFile(selectedFile);
                        }}
                    />
                  </div>
                  
                  <button type="button" onClick={handleUploadSubmit} className="primary-glass-btn center-btn mt-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"/>
                    </svg>
                    Upload & Share
                  </button>
                </div>
              </div>

              {/* Recently Shared Notes */}
              <div className="recent-notes-container">
                <h3 className="section-title">Recently Shared Notes</h3>
                
                <div className="notes-list">
                  {filteredNotes.map((note) => (
                    <div key={note._id} className="glass-card note-item-card">
                      <div className="note-item-header">
                        <div className="note-title-wrap">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#6a82fb" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <line x1="3" y1="9" x2="21" y2="9"/>
                            <line x1="9" y1="21" x2="9" y2="9"/>
                          </svg>
                          <h4>{note.topic || "No Title"}</h4>
                        </div>
                        <div className="note-file-info">
                          <span>{note.subject || "No Subject"} — {note.semester}</span>
                        </div>
                      </div>
                      
                      <div className="note-details">
                        <p>Shared by: {note.sharedBy}</p>
                        <p>{note.semester}</p>
                      </div>

                      <div className="note-actions">
                        <a 
                          href={note.fileUrl ? `http://localhost:5000/uploads/${note.fileUrl}` : "#"} 
                          target="_blank" 
                          rel="noreferrer"
                          className="icon-btn blue-btn"
                          style={{textDecoration: 'none'}}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                          Preview
                        </a>
                        <a 
                          href={note.fileUrl ? `http://localhost:5000/uploads/${note.fileUrl}` : "#"} 
                          download
                          className="icon-btn purple-btn"
                          style={{textDecoration: 'none'}}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Download
                        </a>
                        <button 
                          className={`icon-btn ${note.savedBy?.includes(uid) ? 'saved-btn active' : 'saved-btn'}`}
                          onClick={() => toggleSaveNote(note._id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={note.savedBy?.includes(uid) ? "#65749b" : "none"} xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                          {note.savedBy?.includes(uid) ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {notes.length === 0 && <p style={{color: '#65749b'}}>No notes found.</p>}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="grid-right-col">
              
              {/* Request Notes Form */}
              <div className="glass-card side-box">
                <h3 className="card-heading">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#f6ad55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Request Notes
                </h3>
                <p className="box-desc">Need notes that are not available?</p>
                <form onSubmit={handleRequestSubmit}>
                  <textarea 
                    placeholder="Need Computer Networks Unit 2 notes" 
                    className="form-input auto-resize mt-2" 
                    rows="3"
                    value={requestDesc}
                    onChange={e => setRequestDesc(e.target.value)}
                  ></textarea>
                  <button type="submit" className="primary-glass-btn full-btn mt-2">
                    Request from Seniors
                  </button>
                </form>
              </div>

              {/* Saved Notes Box */}
              <div className="glass-card side-box">
                <h3 className="card-heading">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#f6ad55" xmlns="http://www.w3.org/2000/svg" stroke="#f6ad55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Saved Notes
                </h3>
                <div className="star-list mt-2">
                  {savedNotes.map((note) => (
                    <div key={note._id} className="star-list-item">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="#f6ad55" xmlns="http://www.w3.org/2000/svg" stroke="#f6ad55" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      {note.topic} ({note.subject})
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Notes List (From Screenshot) */}
              <div className="recent-requests-container">
                <h3 className="section-title title-flush">Request Notes</h3>
                <div className="glass-card side-box">
                  <div className="star-list">
                    {myRequests.map((req, index) => (
                      <div key={index} className="star-list-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#f6ad55" xmlns="http://www.w3.org/2000/svg" stroke="#f6ad55" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        {req.description}
                      </div>
                    ))}
                  </div>
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

export default Notes;
