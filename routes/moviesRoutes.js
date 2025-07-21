const express = require("express");

const router = express.Router();
const moviesController = require("./../controllers/moviesController");
const authsController = require("./../controllers/authController");

// router.param("id", moviesController.checkId);

router
  .route("/highest-rated")
  .get(moviesController.getHighestRated, moviesController.getAllMovies);

router.route("/movie-stats").get(moviesController.getMovieStats);
router.route("/movie-by-genres/:genre?").get(moviesController.getMovieByGenres);

router
  .route("/")
  .get(authsController.protect, moviesController.getAllMovies)
  .post(moviesController.createMovie);
router
  .route("/:id")
  .get(authsController.protect, moviesController.getMovieById)
  .patch(moviesController.updateMovieById)
  .delete(
    authsController.protect,
    authsController.restrict("admin"),
    moviesController.deleteMovieById
  );

module.exports = router;
