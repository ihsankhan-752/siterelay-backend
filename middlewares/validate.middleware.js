import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";

export const validateMiddleware = (schema) => {
  asyncHandler(async (req, res, next) => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(new ErrorHandler(errors, 400));
    }

    req.body = result.data;
    next();
  });
};
