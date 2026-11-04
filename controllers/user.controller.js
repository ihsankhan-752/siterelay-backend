import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { registerSchemaValidator } from "../validators/auth.validator.js";
import { User } from "../schemas/user.schema.js";

export const register = asyncHandler(async (req, res, next) => {
  const result = await registerSchemaValidator.safeParseAsync(req.body);

  if (!result.success) {
    const error = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return next(new ErrorHandler(error, 400));
  }

  const { username, email, password } = result.data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("This email already exist", 409));
  }

  await User.create({ username, email, password });

  return res.status(201).json({ success: true, message: "Account Created" });
});

export const login = asyncHandler(async (req, res, next) => {


    
});
