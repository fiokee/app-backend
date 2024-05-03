const HttpError = require('../models/http_error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Check if Authorization header exists
        if (!req.headers.authorization) {
            throw new Error('Authorization header is missing');
        }

        // Split Authorization header to get token (assuming format: Bearer token)
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1]; // Get token part after 'Bearer '

        // Check if token exists
        if (!token) {
            throw new Error('Authentication failed: Token is missing');
        }

        // Verify and decode the token
        const decodedToken = jwt.verify(token, 'supersecret_dont_share_2024');

        // Set decoded user data in request object
        req.userData = { userId: decodedToken.userId };

        // Call next middleware
        next();
    } catch (err) {
        // Handle authentication errors
        const error = new HttpError('Authentication failed: Invalid token', 401);
        return next(error);
    }
};
