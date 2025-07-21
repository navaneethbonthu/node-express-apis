const express = require("express");
const moviesRouter = require("./routes/moviesRoutes");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const CustomError = require("./utils/customError");
const gobalErrorHandler = require("./controllers/errorController");
let app = express();
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public/"));
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.use("*", (req, res, next) => {
  //   const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  //   err.statusCode = 404;
  //   err.status = "fail";
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use(gobalErrorHandler);
module.exports = app;
