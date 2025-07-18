const User = require("./../models/userModel");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");

exports.signup = asyncErrorHandler(async (req, res, next) => {
  console.log("user post route is called");

  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "Success",
    data: {
      user: newUser,
    },
  });
});
