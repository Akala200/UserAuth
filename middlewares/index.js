function notFound(req, res, next) {
    error = new Error('you made a wrong turn somehere...' +  req.originalUrl);
    res.status(404);
    next(error);
  }
  
  function errorHandler(error, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
      message: error.message,
      error: process.env.NODE_ENV === 'production' ? {} : error.stack,
    })
  }
  
  module.exports = {
    notFound,
    errorHandler
  }