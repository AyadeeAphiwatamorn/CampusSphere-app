const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: String, // from Firebase
  name: String,
  email: String,
  password: String,
  photo: String,
  phone: String,
  university: String,
  department: String,
  semester: String,
  studentId: String,
  bio: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);