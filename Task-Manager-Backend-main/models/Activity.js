const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  projectName: String,
  taskName: String,
  user: String,
  timestamp: Date,
  type: String, // 'completed', 'assigned', 'overdue'
  assignedTo: [String],
});

module.exports = mongoose.model("Activity", activitySchema);
