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

// Create Task
router.post(
  "/companies/:cId/projects/:pId/tasks",
  authMiddleware,
  verifyProjectAccess("project manager"),
  validateMiddleware(taskValidatorSchema),
  createTask,
);

// Get Project Tasks
router.get(
  "/companies/:cId/projects/:pId/tasks",
  authMiddleware,
  verifyProjectAccess(),
  getProjectTasks,
);

// Get Task By ID
router.get(
  "/companies/:cId/projects/:pId/tasks/:taskId",
  authMiddleware,
  verifyProjectAccess(),
  getTaskById,
);

// Update Task Information
router.patch(
  "/companies/:cId/projects/:pId/tasks/:taskId",
  authMiddleware,
  verifyProjectAccess("project manager"),
  validateMiddleware(updateTaskValidatorSchema),
  updateTaskInformation,
);

// Assign Task
router.patch(
  "/companies/:cId/projects/:pId/tasks/:taskId/assign",
  authMiddleware,
  verifyProjectAccess("project manager"),
  validateMiddleware(assignTaskValidatorSchema),
  assignTask,
);

// Update Task Status
router.patch(
  "/companies/:cId/projects/:pId/tasks/:taskId/status",
  authMiddleware,
  verifyProjectAccess("project manager"),
  validateMiddleware(updateTaskStatusValidatorSchema),
  updateTaskStatus,
);

// Delete Task
router.delete(
  "/companies/:cId/projects/:pId/tasks/:taskId",
  authMiddleware,
  verifyProjectAccess("project manager"),
  deleteTask,
);

export default router;
