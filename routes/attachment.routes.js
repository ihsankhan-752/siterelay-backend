import express from "express";

import {
  uploadAttachment,
  getAttachments,
} from "../controllers/attachment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { verifyProjectAccess } from "../middlewares/project.access.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/companies/:cId/projects/:pId/tasks/:taskId/attachments",
  authMiddleware,
  verifyProjectAccess("project manager"),
  upload.single("attachment"),
  uploadAttachment,
);

router.get(
  "/companies/:cId/projects/:pId/tasks/:taskId/attachments",
  authMiddleware,
  verifyProjectAccess(),
  getAttachments,
);

export default router;
