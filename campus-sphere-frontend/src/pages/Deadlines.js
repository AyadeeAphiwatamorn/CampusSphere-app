import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Deadlines.css";

// Shared assets
import logo from "../icons/logo_campusSphere.svg";
import profileIcon from "../icons/profile.svg";
import deadlineIcon from "../icons/deadline 1.svg";

import githubIcon from "../icons/ri_github-fill.svg";
import Footer from "../components/Footer";

function Deadlines() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [tasks, setTasks] = useState([]);

  // ✅ ใช้อันเดียวพอ
  useEffect(() => {
    fetch("http://localhost:5000/deadlines")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.log(err));
  }, []);

  // Form state
  const [dueDate, setDueDate] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // ✅ FIXED: POST to backend
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!assignmentTitle.trim() || !dueDate) return;

    const newTask = {
      title: assignmentTitle,
      subject,
      dueDate,
      reminderDate,
      details,
    };

    try {
      const res = await fetch("http://localhost:5000/add-deadline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const data = await res.json();

      // ✅ update UI from DB response
      const updated = await fetch("http://localhost:5000/deadlines");
const newData = await updated.json();
setTasks(newData);
      // reset form
      setDueDate("");
      setReminderDate("");
      setAssignmentTitle("");
      setSubject("");
      setDetails("");
    } catch (err) {
      console.log("POST error:", err);
    }
  };

  // ❌ DELETE task from backend
  const handleDeleteTask = async (id) => {
    if (!id) {
      console.log("ID is missing ❌");
      return;
    }

    console.log("DELETE CLICKED:", id);

    try {
      const res = await fetch(`http://localhost:5000/delete-deadline/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.log("DELETE error:", err);
    }
  };


  const handleUpdateTask = async (id, updatedData) => {
  try {
    const res = await fetch(
      `http://localhost:5000/update-deadline/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    const data = await res.json();

    // update UI
    setTasks(tasks.map(t => (t._id === id ? data : t)));

  } catch (err) {
    console.log(err);
  }
};
  return (
    <div className="deadlines-page">
      {/* --- HERO SECTION --- */}
      <div className="deadlines-hero-section">
        {/* Navbar */}
        <div className="deadlines-navbar">
          <div className="deadlines-logo">
            <Link to="/">
              <img src={logo} alt="CampusSphere Logo" />
            </Link>
          </div>
          <div className="deadlines-nav-links">
            <div className="global-nav-dropdown-wrapper">
              <span className="nav-link-btn">Modules ▾</span>
              <div className="global-nav-dropdown-menu">
                <Link to="/deadlines">Deadline Tracker</Link>
                <Link to="/notes">Notes Sharing</Link>
                <Link to="/lostfound">Lost & Found</Link>
                <Link to="/expenses">Expense Split</Link>
              </div>
            </div>
            <a href="/#features" className="nav-link-btn">
              Features
            </a>
            <a href="/#how-it-works" className="nav-link-btn">
              How it works
            </a>
            <a href="#contact" className="nav-link-btn">
              Contact Us
            </a>
          </div>
          <div className="deadlines-profile-section">
            <img
              src={profileIcon}
              alt="Profile"
              className="deadlines-profile-icon"
              onClick={toggleDropdown}
            />
            {dropdownVisible && (
              <div
                className={`deadlines-dropdown ${dropdownVisible ? "show" : ""}`}
              >
                <ul>
                  <li>
                    <Link to="/signin">Sign In</Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign Up</Link>
                  </li>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/">Logout</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Hero Content */}
        <div className="deadlines-hero-content">
          <img
            src={deadlineIcon}
            alt="Deadline Tracker"
            className="deadlines-hero-icon"
          />
          <h1 className="deadlines-hero-title">Deadline Tracker</h1>
          <p className="deadlines-hero-subtitle">
            Stay on top of your assignments and never miss a deadline.
            <br />
            Add your assignments, set due dates, and stay ahead of your
            schedule.
          </p>
        </div>
      </div>

      {/* --- FORM SECTION --- */}
      <div className="deadlines-form-section">
        <form className="deadlines-form" onSubmit={handleAddTask}>
          {/* Date pickers row */}
          <div className="form-row form-row-half">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Reminder Date</label>
              <input
                type="date"
                className="form-input"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
            </div>
          </div>

          {/* Assignment Title */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Assignment Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., DBMS Lab Report"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Subject */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Data Structures"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Additional Details</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Add instructions, notes, or submission requirements"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-submit-row">
            <button type="submit" className="deadlines-submit-btn">
              Add Task
            </button>
          </div>
        </form>

        {/* --- TASK LIST --- */}
        <div className="deadlines-task-list">
          {tasks.length === 0 ? (
            <p className="deadlines-empty">
              No upcoming deadlines. You're all caught up! 🎉
            </p>
          ) : null}
          {(Array.isArray(tasks) ? tasks : []).map((task) => (
  <div key={task._id} className="deadlines-task-card">
              <div className="task-card-content">
                <h3 className="task-card-title">{task.title}</h3>
                {task.subject && (
                  <p className="task-card-subject">{task.subject}</p>
                )}
                {task.dueDate && (
                  <p className="task-card-date">Due: {task.dueDate}</p>
                )}
                {task.details && (
                  <p className="task-card-details">{task.details}</p>
                )}
              </div>
              <button
                className="task-delete-btn"
                onClick={() => handleDeleteTask(task._id)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Deadlines;
