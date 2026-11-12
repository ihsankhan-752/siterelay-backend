import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import { projectMembershipValidationSchema } from "../validators/project.membership.validator.js";
import { addMemberToProject } from "../controllers/project.membership.controller.js";

const router = express.Router();

router.post(
  "/companies/:cId/projects/:pId/members",
  authMiddleware,
  validateMiddleware(projectMembershipValidationSchema),
  addMemberToProject,
);

export default router;
