const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email."],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm your password"],
    minlength: 8,
    select: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
