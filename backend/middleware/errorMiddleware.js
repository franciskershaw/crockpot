const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }

  const statusCode = err.statusCode || 500;
  let message = err.message;

  if (statusCode === 500) {
    message = 'An unexpected error occurred, please try again later.';
  }
  res.status(statusCode);

  res.json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
