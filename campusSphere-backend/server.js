console.log("🔥 SERVER.JS IS RUNNING");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key"; // In production, use environment variables

// IMPORT MODELS
const User = require("./models/User");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// =============================================
// SCHEMAS (Inline for consistency)
// =============================================

// Deadline
const deadlineSchema = new mongoose.Schema({
  title: String,
  subject: String,
  dueDate: String,
  reminderDate: String,
  details: String
});
const Deadline = mongoose.model("Deadline", deadlineSchema);

// Note
const noteSchema = new mongoose.Schema({
  topic: String,
  subject: String,
  sharedBy: { type: String, default: "Anonymous" },
  semester: String,
  courseCode: String,
  description: String,
  fileUrl: String,
  savedBy: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model("Note", noteSchema);

// Note Request
const noteRequestSchema = new mongoose.Schema({
  description: String,
  requestedBy: String,
  createdAt: { type: Date, default: Date.now }
});
const NoteRequest = mongoose.model("NoteRequest", noteRequestSchema);

// Lost & Found
const lostFoundSchema = new mongoose.Schema({
  itemName: String,
  location: String,
  date: String,
  category: String,
  description: String,
  contact: String,
  emoji: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});
const LostFound = mongoose.model("LostFound", lostFoundSchema);

// Expense Session
const expenseSchema = new mongoose.Schema({
  sessionName: String,
  participants: [String],
  items: [{
    name: String,
    price: Number,
    sharedBy: [String]
  }],
  tax: Number,
  discount: Number,
  totalCost: Number,
  grandTotal: Number,
  perPerson: [{
    name: String,
    amount: String
  }],
  createdAt: { type: Date, default: Date.now }
});
const Expense = mongoose.model("Expense", expenseSchema);

// =============================================
// ROUTES
// =============================================

// --- AUTHENTICATION ---
app.get("/api/test", (req, res) => {
  res.json({ message: "API IS WORKING" });
});

// SIGN UP
app.post("/api/signup", async (req, res) => {
  console.log("📝 SIGNUP REQUEST RECEIVED:", req.body);
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      uid: Date.now().toString(), // Generate a temporary UID if not using Firebase
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SIGN IN
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ 
      message: "Login success", 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        uid: user.uid
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- USER PROFILE ---
// GET user by uid
app.get("/api/user/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE or UPDATE user
app.post("/api/user", async (req, res) => {
  const { uid } = req.body;
  console.log("📤 Incoming profile update for UID:", uid);
  try {
    const user = await User.findOneAndUpdate(
      { uid },
      req.body,
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    console.error("❌ Profile Save Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- DEADLINES ---
app.post("/add-deadline", async (req, res) => {
  try {
    const newTask = new Deadline(req.body);
    await newTask.save();
    res.status(201).json({ message: "Task Added", data: newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/deadlines", async (req, res) => {
  try {
    const data = await Deadline.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/delete-deadline/:id", async (req, res) => {
  try {
    await Deadline.findByIdAndDelete(req.params.id);
    res.json({ message: "Task Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/update-deadline/:id", async (req, res) => {
  try {
    const updated = await Deadline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NOTES ---
app.post("/add-note", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newNote = new Note({
      topic: req.body.topic || "No Title",
      subject: req.body.subject || "No Subject",
      semester: req.body.semester,
      courseCode: req.body.courseCode,
      description: req.body.description,
      fileUrl: req.file.filename,
      sharedBy: "You",
    });

    const saved = await newNote.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/notes", async (req, res) => {
  try {
    const data = await Note.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE SAVE NOTE
app.post("/api/notes/:id/toggle-save", async (req, res) => {
  const { uid } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const index = note.savedBy.indexOf(uid);
    if (index === -1) {
      note.savedBy.push(uid);
    } else {
      note.savedBy.splice(index, 1);
    }

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NOTE REQUESTS
app.post("/api/note-requests", async (req, res) => {
  try {
    const newRequest = new NoteRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/note-requests", async (req, res) => {
  try {
    const data = await NoteRequest.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LOST & FOUND ---
app.post("/add-lostfound", upload.single("image"), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = req.file.filename;
    }
    const newItem = new LostFound(data);
    await newItem.save();
    res.status(201).json({ message: "Item Reported", data: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/lostfound", async (req, res) => {
  try {
    const data = await LostFound.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EXPENSES ---
app.post("/add-expense", async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json({ message: "Expense Saved", data: newExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const data = await Expense.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ROOT ---
app.get("/", (req, res) => {
  res.send("Server running");
});

// =============================================
// DATABASE CONNECTION & START
// =============================================
const PORT = 5000;
mongoose.connect("mongodb://127.0.0.1:27017/campusSphere")
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log("❌ MongoDB Error:", err);
  });