const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check cookie
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new AppError('Not authorized, no token', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return next(new AppError('User no longer exists', 401));
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token expired, please login again', 401));
        }
        return next(new AppError('Not authorized, invalid token', 401));
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(`Role '${req.user.role}' is not authorized`, 403)
            );
        }
        next();
    };
};

module.exports = { protect, authorize };
