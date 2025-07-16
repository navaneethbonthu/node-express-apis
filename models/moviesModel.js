const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  rating: {
    type: Number,
  },
  totalRatings: {
    type: Number,
  },
  releaseDate: {
    type: Date,
    required: [true, "Relese Year is Required"],
  },
  releaseYear: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  genres: {
    type: [String],
    required: [true, "Geners is required"],
  },
  directors: {
    type: String,
    required: [true, "Director is required field"],
  },
  coverImage: {
    type: String,
    required: [true, "Cover Image is required field"],
  },
  actors: {
    type: String,
    required: [true, "Actors is requreid field"],
  },
  price: {
    type: Number,
    required: [true, "Price is requreid field"],
  },
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;

// const testMovie = new Movie({
//   name: "The Dark Knight",
//   description:
//     "When the menace known as The Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
//   rating: 9.0,
//   duration: 152,
// });

// testMovie
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((error) => {
//     console.log(error + "is occured");
//   });
