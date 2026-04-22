const express = require("express");
const multer = require("multer");

const app = express();

const upload = multer({ dest: "uploads/" });

// ✅ GET route
app.get("/", (req, res) => {
  res.send("WORKING ✅");
});

// ✅ POST route (FIXED)
app.post("/test-upload", upload.single("file"), (req, res) => {
  console.log("🔥 HIT");
  res.send("UPLOAD WORKING ✅");
});

// ✅ Start server
app.listen(5050, () => {
  console.log("🚀 Running on 5050");
});

app.get("/test-upload", (req, res) => {
  res.send("GET WORKING ✅");
});