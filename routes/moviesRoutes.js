const express = require("express");

const router = express.Router();
const moviesController = require("./../controllers/moviesController");

// router.param("id", moviesController.checkId);

router
  .route("/highest-rated")
  .get(moviesController.getHighestRated, moviesController.getAllMovies);

router
  .route("/")
  .get(moviesController.getAllMovies)
  .post(moviesController.createMovie);
router
  .route("/:id")
  .get(moviesController.getMovieById)
  .patch(moviesController.updateMovieById)
  .delete(moviesController.deleteMovieById);

module.exports = router;
