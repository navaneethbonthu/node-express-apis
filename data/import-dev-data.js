const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

const Movie = require("./../models/moviesModel");

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log(conn);
    // console.log("connection create successfully");
  })
  .catch((err) => {
    console.log(err);
    // console.log("some error occured");
  });

const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log("Data deleted succssfully");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

const importMovies = async () => {
  try {
    await Movie.create(movies);
    console.log("Data imported succssfully");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importMovies();
}
if (process.argv[2] === "--delete") {
  deleteMovies();
}
