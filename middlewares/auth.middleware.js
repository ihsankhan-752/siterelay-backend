import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { User } from "../schemas/user.schema.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) {
    return next(new ErrorHandler("Authentication required", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded._id);

  if (user.status !== "active") {
    return next(new ErrorHandler("Your account is suspended or inactive", 403));
  }

  req.user = user;

  next();
});
