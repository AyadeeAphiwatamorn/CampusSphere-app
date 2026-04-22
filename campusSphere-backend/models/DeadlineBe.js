const mongoose = require("mongoose");

const deadlineSchema = new mongoose.Schema({
  title: String,
  subject: String,
  dueDate: String,
  reminderDate: String,
  details: String,
});

module.exports = mongoose.model("Deadline", deadlineSchema);