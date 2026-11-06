import express from "express";
import {
  createCompany,
  getMyCompanies,
} from "../controllers/company.controller.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { companyValidatorSchema } from "../validators/company.validator.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateMiddleware(companyValidatorSchema),
  createCompany,
);

router.get("/", authMiddleware, getMyCompanies);
export default router;
