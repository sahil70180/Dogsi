import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Interval Server Error",
  };

  // handle invalid MongoDB ID Error
  if (err.name == "CastError") {
    const message = `Resource Not Found. Invalid : ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }

  // handle validations Error
  if (err.name == "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 404);
  }

  //handle JWT Error
  if (err.name == "jsonWebTokenError") {
    const message =  `JWT is invalid. Try Again !!`;
    error = new ErrorHandler(message, 400);
  }

  // handle JWT expire Error 
  if (err.name == "TokenExpiredError") {
    const message = `Json Web Token is expired. Try Again !!`;
    error = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
