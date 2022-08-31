const errorHandler = (err, req, res, next) => {
  console.log(err)
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  // Only show stack if in developments
  res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

module.exports = {
  errorHandler,
}