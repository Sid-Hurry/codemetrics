/**
 * Global Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  // Extract error info or assign default values
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log detailed error stack traces locally for debugger visibility
  if (process.env.NODE_ENV !== 'test') {
    console.error(`🚨 Error [${req.method} ${req.url}]:`);
    console.error(err.stack || err);
  }

  // Return formatted JSON standard responses
  res.status(status).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
