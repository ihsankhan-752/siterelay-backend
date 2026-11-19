import express from "express";

import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTaskInformation,
  assignTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { verifyProjectAccess } from "../middlewares/project.access.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";

import {
  taskValidatorSchema,
  updateTaskValidatorSchema,
  updateTaskStatusValidatorSchema,
  assignTaskValidatorSchema,
} from "../validators/task.validator.js";

const router = express.Router();

router.post(
  "/companies/:cId/projects/:pId/tasks",
  authMiddleware,
  verifyProjectAccess("project manager"),
  validateMiddleware(taskValidatorSchema),
  createTask,
);

router.get(
  "/companies/:cId/projects/:pId/tasks",
  authMiddleware,
  verifyProjectAccess(),
  getProjectTasks,
);

router.get(
  "/companies/:cId/projects/:pId/tasks/:taskId",
  authMiddleware,
  verifyProjectAccess(),
  getTaskById,
);

router.patch(
  "/companies/:cId/projects/:pId/tasks/:taskId",
  authMiddleware,
  verifyProjectAccess("project manager"),
  validateMiddleware(updateTaskValidatorSchema),
  updateTaskInformation,
);

router.patch(
  "/companies/:cId/projects/:pId/tasks/:taskId/assign",
  authMiddleware,
  verifyProjectAccess("project manager"),
  validateMiddleware(assignTaskValidatorSchema),
  assignTask,
);

router.patch(
  "/companies/:cId/projects/:pId/tasks/:taskId/status",
  authMiddleware,
  verifyProjectAccess("project manager"),
  validateMiddleware(updateTaskStatusValidatorSchema),
  updateTaskStatus,
);

router.delete(
  "/companies/:cId/projects/:pId/tasks/:taskId",
  authMiddleware,
  verifyProjectAccess("project manager"),
  deleteTask,
);

export default router;
