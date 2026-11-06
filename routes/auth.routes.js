import express from "express";
import { register, login } from "../controllers/user.controller.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import {
  registerSchemaValidator,
  loginValidatorSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validateMiddleware(registerSchemaValidator), register);
router.post("/login", validateMiddleware(loginValidatorSchema), login);

export default router;
