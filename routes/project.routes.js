import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import { projectValidatorSchema } from "../validators/project.validator.js";
import {
  createProject,
  getCompanyProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post(
  "/companies/:cId/projects",
  authMiddleware,
  validateMiddleware(projectValidatorSchema),
  createProject,
);

router.get("/companies/:cId/projects", authMiddleware, getCompanyProjects);

export default router;
