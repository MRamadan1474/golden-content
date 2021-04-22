// Import required modules
const ErrorResponse = require('../utils/errorResponse');


// Handle error
exports.errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;

    return res.status(error.statusCode || 500).json({
        success: false,
        error: {
        code: error.statusCode || 500,
        message: error.message || 'Server error'
        }
    });
}