const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    error.message = message;
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error.message = message;
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Invalid reference to related data';
    error.message = message;
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return res.status(401).json({
      success: false,
      message: message
    });
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return res.status(401).json({
      success: false,
      message: message
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;

