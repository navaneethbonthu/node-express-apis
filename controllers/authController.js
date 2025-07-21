const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const util = require("util");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const { access } = require("fs");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.signin = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    const error = new CustomError("Plese provide email and password", 400);
    return next(error);
  }

  const user = await User.findOne({ email: email }).select("+password");
  // const isPwdMatch = await User.confirmPasswordInDb(password, user.password);

  if (!user || !(await user.confirmPasswordInDb(password, user.password))) {
    const error = new CustomError("Creadintials are incorrect", 400);
    next(error);
  }

  const token = signToken(user._id);

  res.status(201).json({
    status: "Success",
    token: token,
    user: user,
  });
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  // 1.extract the token and check the token

  const recivedToken = req.headers.authorization;

  let token;

  if (recivedToken || recivedToken.startsWith("Bearer")) {
    token = recivedToken.split(" ")[1];
  }

  if (!token) {
    next(new CustomError("Your not logged in ", 401));
  }

  // 2.validate the token

  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3.check the user exits or not

  const user = User.find(decodedToken.id);
  if (!user) {
    const error = new CustomError(
      "the user with given token does not exits",
      401
    );
  }

  // 4.If the user changed the password after issued token

  // 5.allow user to access the route

  req.user = user;
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== "admin") {
      const error = new CustomError(
        "you do not have permissioin to do this action"
      );
    }
    next();
  };
};

exports.forgotPassword = (req, res, next) => {
  next();
};

exports.restPassword = (req, res, next) => {
  next();
};
