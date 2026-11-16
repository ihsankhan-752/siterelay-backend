import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import { taskValidatorSchema } from "../validators/task.validator.js";
import { createTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post(
  "/companies/:cId/projects/:pId/tasks",
  authMiddleware,
  validateMiddleware(taskValidatorSchema),
  createTask,
);

export default router;
