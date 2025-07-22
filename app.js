const express = require("express");
const moviesRouter = require("./routes/moviesRoutes");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const CustomError = require("./utils/customError");
const gobalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const hpp = require("hpp");

let app = express();

app.use(helmet());

let limit = rateLimit({
  max: 10, // Max requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  message:
    "We have received too many requests from this IP. Please try after one hour.",
  // Add this line to include rate limit headers
  headers: true, // This will add X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
});

app.use("/api/", limit);

// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));

app.use(sanitize());
app.use(xss());
// app.use(hpp({whitelist:['duration']}));

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
