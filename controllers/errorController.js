const CustomError = require("../utils/customError");

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  const castErrorHandler = (err) => {
    const message = `Invalid value for ${err.path} :${err.value}!`;
    return new CustomError(message, 400);
  };

  const duplicateKeyErrorHandler = (err) => {
    const message = `there is already movie with name ${err.keyValue.name} plese enter another name`;
    return new CustomError(message, 400);
  };

  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      stackTrace: error.stack,
      error: error,
    });
  } else if (process.env.NODE_ENV === "producton") {
    if (error.name === "CastError") {
      error = castErrorHandler(error);
    }
    if (error.code === 11000) {
      error = duplicateKeyErrorHandler(error);
    }

    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: `some thing went worng plese try again later`,
      });
    }
  }
  next();
};
