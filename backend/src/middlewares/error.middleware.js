export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || (res.statusCode >= 400 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
};
