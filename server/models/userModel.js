const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please provide with a username"],
  },
  email: {
    type: String,
    required: [true, "Please provide with a mail"],
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uid: {
    type: String,
    required: [true, "uid must be provided"],
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
