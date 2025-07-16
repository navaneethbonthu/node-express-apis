// const { param } = require("../Routes/moviesRoutes");
const Movie = require("./../models/moviesModel");
const ApiFeatures = require("./../utils/ApiFeatures");

exports.getHighestRated = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-rating";
  console.log("-------------------------------------------------");
  console.log("Highest reated called ");
  next();
};

exports.getAllMovies = async (req, res) => {
  try {
    const features = new ApiFeatures(Movie.find(), req.query)
      .sort()
      .limitFields()
      .pagination();
    console.log("-------------------------------------------------");
    console.log("req.query", req.query);

    const movies = await features.query;

    //  let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(queryObj);

    // const movies = await query;

    res.status(201).json({
      status: "Success",
      count: movies.length,
      data: { movies },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    // const movie = await Movie.find({ _id: req.body.id });
    // console.log(req.params.id);

    const movie = await Movie.findById(req.params.id);
    res.status(201).json({
      status: "Success",

      data: { movie },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateMovieById = async (req, res) => {
  try {
    // const movie = await Movie.find({ _id: req.body.id });
    // console.log(req.params.id);

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "Success",
      data: { movie },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMovieById = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      status: "Success",
      data: { movie },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
