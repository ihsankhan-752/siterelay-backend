import express from "express";
import authRouter from "./auth.routes.js";
import companyRouter from "./company.routes.js";
import invitationRouter from "./invitation.routes.js";
import projectRouter from "./project.routes.js";
import projectMembershipRouter from "./project.membership.routes.js";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/companies", companyRouter);
router.use("/invitations", invitationRouter);
router.use("/", projectRouter);
router.use("/", projectMembershipRouter);

export default router;
