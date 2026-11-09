import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateMiddleware } from "../middlewares/validate.middleware.js";
import { invitationValidatorSchema } from "../validators/invitation.validator.js";
import {
  createInvitation,
  acceptInvitation,
} from "../controllers/invitation.controller.js";

const router = express.Router();

router.post(
  "/:cId/invitations/",
  authMiddleware,
  validateMiddleware(invitationValidatorSchema),
  createInvitation,
);


router.post(
  "/:cId/invitations/",
  authMiddleware,
  validateMiddleware(invitationValidatorSchema),
  acceptInvitation,
);

export default router;
