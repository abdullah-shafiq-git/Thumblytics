const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = new AppError(`Resource not found with id: ${err.value}`, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new AppError(`${field} already exists`, 409);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ');
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        error = new AppError('Token expired, please login again', 401);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', err);
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
