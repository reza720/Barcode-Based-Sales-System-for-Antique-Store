function globalErrorHandler(err, _req, res, _next) {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        errors: err.errors || [],
    });
}

export default globalErrorHandler;
