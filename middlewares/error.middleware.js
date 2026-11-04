export const errorMiddleware = (err, res, res, next) => {
  err.message = err.message || "Something went wrong";
  err.statusCode = err.statusCode || 500;

  return res.status(statusCode).json({ message: err.message });
};
