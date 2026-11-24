import express from "express";

import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

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

router.patch(
  "/companies/:cId/projects/:pId/tasks/:taskId/comments/:commentId",
  authMiddleware,
  verifyProjectAccess(),
  updateComment,
);

router.delete(
  "/companies/:cId/projects/:pId/tasks/:taskId/comments/:commentId",
  authMiddleware,
  verifyProjectAccess(),
  deleteComment,
);

export default router;
