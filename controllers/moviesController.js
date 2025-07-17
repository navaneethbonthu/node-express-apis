const CustomError = require("../utils/customError");
const Movie = require("./../models/moviesModel");
const ApiFeatures = require("./../utils/ApiFeatures");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");
exports.getHighestRated = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-rating";
  // console.log("-------------------------------------------------");
  // console.log("Highest reated called ");
  next();
};

exports.getAllMovies = asyncErrorHandler(async (req, res) => {
  const features = new ApiFeatures(Movie.find(), req.query);
  // .sort()
  // .limitFields()
  // .pagination();
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
});

exports.getMovieById = asyncErrorHandler(async (req, res, next) => {
  // const movie = await Movie.find({ _id: req.body.id });
  // console.log(req.params.id);

  const movie = await Movie.findById(req.params.id);
  // console.log("req.params.id", movie);
  if (!movie) {
    const error = new CustomError(`Movie with that ID is not found!`, 404);
    return next(error);
  }

  res.status(201).json({
    status: "Success",

    data: { movie },
  });
});

exports.updateMovieById = asyncErrorHandler(async (req, res, next) => {
  // const movie = await Movie.find({ _id: req.body.id });
  // console.log(req.params.id);
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!movie) {
    const error = new CustomError(`Movie with that ID is not found!`, 404);
    return next(error);
  }
  res.status(201).json({
    status: "Success",
    data: { movie },
  });
});

exports.deleteMovieById = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) {
    const error = new CustomError(`Movie with that ID is not found!`, 404);
    return next(error);
  }
  res.status(204).json({
    status: "Success",
    data: null,
  });
});

exports.createMovie = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.create(req.body);
  res.status(201).json({
    status: "Success",
    data: { movie },
  });
});

exports.getMovieStats = asyncErrorHandler(async (req, res, next) => {
  const stats = await Movie.aggregate([
    // { $match: { releaseDate: { $lte: new Date() } } },
    { $match: { rating: { $gte: 1 } } },
    {
      $group: {
        // _id: null,
        _id: "$releaseDate",
        avgRating: {
          $avg: "$rating",
        },
        avgPrice: {
          $avg: "$price",
        },
        minPrice: {
          $min: "$price",
        },
        maxPrice: {
          $max: "$price",
        },
        totalPrice: {
          $sum: "$price",
        },
        movieCount: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        minPrice: 1,
      },
    },
    {
      $match: {
        maxPrice: { $gte: 5 },
      },
    },
  ]);
  res.status(200).json({
    status: "Success",
    count: stats.length,
    data: { stats },
  });
});

exports.getMovieByGenres = asyncErrorHandler(async (req, res, next) => {
  const genreParamStr = req.params.genre;
  let movie;
  if (req.params.genre) {
    const genreParamStr = req.params.genre;
    movie = await Movie.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          movieCount: { $sum: 1 },
          movies: { $push: "$name" },
        },
      },
      { $addFields: { genres: "$_id" } },
      {
        $project: {
          _id: 0,
        },
      },
      { $sort: { movieCount: -1 } },
      { $match: { genres: genreParamStr } },
    ]);
  } else {
    movie = await Movie.aggregate([
      { $match: { releaseDate: { $gte: new Date() } } },
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          movieCount: { $sum: 1 },
          movies: { $push: "$name" },
        },
      },
      { $addFields: { genres: "$_id" } },
      {
        $project: {
          _id: 0,
        },
      },
      { $sort: { movieCount: -1 } },
    ]);
  }
  res.status(200).json({
    status: "Success",
    count: movie.length,
    data: { movie },
  });
});
