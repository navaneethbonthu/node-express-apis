const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm your password"],
    minlength: 8,
    select: false,
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Password & Confirm password does not match",
    },
  },
  passwordChanged: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.confirmPasswordInDb = async function (pwd, pwdInDB) {
  return await bcrypt.compare(pwd, pwdInDB);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
