import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { User } from "../schemas/user.schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("This email already exist", 409));
  }

  await User.create({ username, email, password });

  return res.status(201).json({ success: true, message: "Account Created" });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Account not registered yet", 409));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const payload = {
    _id: user._id,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.status(200).json({ success: true, token });
});
