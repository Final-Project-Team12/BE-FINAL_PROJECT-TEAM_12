function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ 
    status: 'fail',
    statusCode: 500,
    message: 'Internal Server Error', 
    error: err.message 
  });
}

module.exports = errorHandler;
