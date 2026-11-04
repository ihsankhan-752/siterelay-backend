export const asyncHandler = (f) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => next(error));
};
