const User = require("./../models/userModel");
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const filerReqObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  });

  return newObj;
};

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (
    !(await user.confirmPasswordInDb(req.body.currentPassword, user.password))
  ) {
    return next(new CustomError("current password you provided is wrong", 401));
  }

  user.password = req.body.password;
  user.conformPassword = req.body.conformPassword;
  await user.save();

  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});

exports.updateMe = asyncErrorHandler(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    const error = new CustomError(
      "you can not update your password and confirm password using  this end point",
      400
    );
    next(error);
  }

  const filterdObj = filerReqObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterdObj, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

exports.deleteMe = asyncErrorHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});
