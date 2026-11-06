import express from "express";
import authRouter from "./auth.routes.js";
import companyRouter from "./company.routes.js";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/companies", companyRouter);

export default router;
