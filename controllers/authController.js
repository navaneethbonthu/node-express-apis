const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const util = require("util");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const SendEmail = require("../utils/email");
const crypto = require("crypto");

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

  const user = await User.findById(decodedToken.id);
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
        "you do not have permissioin to do this action",
        402
      );
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  // 1.get the user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const error = new CustomError("User does not exited", 404);
    next(error);
  }

  console.log("forgotPassword called");

  // 2.generate a random reset token
  const resetToken = await user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3.send the token back to  user email
  const resetUrl = `${req.protocol}:// ${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `we have receved a password reset request. plese use the 
  below link to reset your password /n ${resetUrl}`;

  try {
    await SendEmail({
      email: user.email,
      subject: "password changes request recevied",
      message: message,
    });
    res.status(200).json({
      status: "success",
      message: "password change link send to user succssfully",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpaires = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new CustomError(
        "there was an error sending password reset emial . plese try again later",
        500
      )
    );
  }

  next();
};

exports.restPassword = asyncErrorHandler(async (req, res, next) => {
  // 1 if the user exits with given token & token has not expiered

  const token = await crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: {
      $gte: Date.now(),
    },
  });

  if (!user) {
    const error = new CustomError("token may expaired", 400);
    next(error);
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  user.passwordResetExpires = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // login the user
  const loginToken = await signToken(user._id);
  res.status(201).json({
    status: "Success",
    loginToken,
  });

  next();
});
