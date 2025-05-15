const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "user", "manager"],
  },
  designation: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
    enum: ["hr", "marketing", "finance", "it"],
  },
  permission: {
    type: [String],
    required: true,
    enum: ["read", "write", "admin"],
  },
  postModule: {
    type: [String],
    required: true,
    enum: ["blog", "news", "project"],
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
  termsAccepted: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
