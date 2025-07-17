const mongoose = require("mongoose");
const fs = require("fs");
const { log } = require("console");
const { kMaxLength } = require("buffer");

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Movie name must not have more then 100 charectors"],
      minlength: [3, "Movie name must not have less then 3 charectors"],
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
    createdBy: String,
  },
  {
    toJSON: { virtuval: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

movieSchema.pre("save", function (next) {
  this.createdBy = "Admin";
  next();
});

movieSchema.post("save", function (doc, next) {
  const content = `A new movie document with name ${doc.name} has been created by ${doc.createdAt} /n`;
  fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

// movieSchema.pre(/^find/, function (next) {
//   this.find({
//     releaseDate: {
//       $lte: Date.now(),
//     },
//   });
//   next();
// });

movieSchema.pre("aggregate", function (next) {
  console.log(
    this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } })
  );
  next();
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
