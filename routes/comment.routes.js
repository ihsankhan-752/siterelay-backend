import express from "express";

import { addComment, getComments } from "../controllers/comment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { verifyProjectAccess } from "../middlewares/project.access.middleware.js";

const router = express.Router();

router.post(
  "/companies/:cId/projects/:pId/tasks/:taskId/comments",
  authMiddleware,
  verifyProjectAccess(),
  addComment,
);

router.get(
  "/companies/:cId/projects/:pId/tasks/:taskId/comments",
  authMiddleware,
  verifyProjectAccess(),
  getComments,
);

export default router;
