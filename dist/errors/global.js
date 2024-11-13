"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = void 0;
const loggers_1 = require("../helpers/loggers");
const globalErrorHandling = (err, req, res, next) => {
    loggers_1.logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        user: req.user // if available
    });
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: 'Invalid data provided.' });
    }
    else if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized access.' });
    }
    else if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ error: 'Invalid CSRF token.' });
    }
    else {
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.globalErrorHandling = globalErrorHandling;
