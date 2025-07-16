const express = require("express");
const moviesRouter = require("./routes/moviesRoutes");

let app = express();
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public/"));
app.use("/api/v1/movies", moviesRouter);

module.exports = app;
