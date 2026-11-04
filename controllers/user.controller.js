import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";

import { User } from "../schemas/user.schema.js";

export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("This email already exist", 409));
  }

  await User.create({ username, email, password });

  return res.status(201).json({ success: true, message: "Account Created" });
});


