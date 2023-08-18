// not found

const notFound = (req, res, next) =>
{
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Error handler 

const errorHandler = (err, req, res) =>
{
    const statusCode = res.statusCode == 200 ? 200 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err?.message,
        stack: err?.stack
    });
};

module.exports = {
    errorHandler,
    notFound,
}