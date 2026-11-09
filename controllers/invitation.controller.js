import { Company } from "../schemas/company.schema.js";
import { Invitation } from "../schemas/invitation.schema.js";
import { Membership } from "../schemas/membership.schema.js";
import { User } from "../schemas/user.schema.js";
import crypto from "crypto";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { generateInvitationToken } from "../utils/generate.invitation.token.js";
import { sendEmailForInvitation } from "../services/resend.email.services.js";
import mongoose from "mongoose";

export const createInvitation = asyncHandler(async (req, res) => {
  const { cId } = req.params;
  const { role, email } = req.body;
  const userId = req.user._id;

  const company = await Company.findById(cId);

  if (!company || company.status !== "active") {
    throw new ErrorHandler("Company not found or inactive", 404);
  }

  const companyId = company._id;

  const membershipCheck = await Membership.findOne({
    companyId,
    userId,
    status: "active",
    roleInCompany: { $in: ["owner", "admin"] },
  });

  if (!membershipCheck) {
    throw new ErrorHandler("You are not authorized to invite users", 403);
  }

  const existingCompanyUser = await User.findOne({ email });

  if (existingCompanyUser) {
    const existingMembership = await Membership.findOne({
      companyId,
      userId: existingCompanyUser._id,
      status: "active",
    });

    if (existingMembership) {
      throw new ErrorHandler(
        "This user is already a member of the company",
        409,
      );
    }
  }

  const existingInvitation = await Invitation.findOne({
    companyId,
    email,
    status: "pending",
    expiresAt: { $gt: new Date() },
  });

  if (existingInvitation) {
    throw new ErrorHandler(
      "An active invitation already exists for this email",
      409,
    );
  }

  const token = generateInvitationToken();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invitation = await Invitation.create({
    companyId,
    email,
    role,
    tokenHash: token.tokenHash,
    invitedBy: userId,
    expiresAt,
  });

  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new ErrorHandler("Invitation frontend URL is not configured", 500);
  }

  const invitationUrl = new URL("/accept-invitation", frontendUrl);

  invitationUrl.searchParams.set("token", token.rawToken);

  const emailResult = await sendEmailForInvitation({
    userEmail: email,
    role,
    invitationUrl: invitationUrl.toString(),
    companyName: company.name,
  });

  return res.status(201).json({
    success: true,
    message: "Invitation created successfully",
    response: {
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
      emailSent: emailResult.success,
    },
  });
});

export const acceptInvitation = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const invitation = await Invitation.findOne({ tokenHash: hashedToken });

  if (!invitation) {
    throw new ErrorHandler("Invalid or expired invitation", 404);
  }

  if (invitation.status !== "pending" || invitation.expiresAt <= new Date()) {
    throw new ErrorHandler("Invalid or expired invitation", 404);
  }

  if (req.user.email !== invitation.email) {
    throw new ErrorHandler("Invited email does'nt Match", 403);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await Membership.create(
      [
        {
          userId: req.user._id,
          status: "active",
          roleInCompany: invitation.role,
          companyId: invitation.companyId,
        },
      ],
      { session },
    );

    const invitationId = { _id: invitation._id, status: "pending" };

    const updatedDoc = {
      $set: {
        status: "accepted",
        acceptedAt: new Date(),
      },
    };

    const invitationResult = await Invitation.updateOne(
      invitationId,
      updatedDoc,
      { session },
    );

    if (invitationResult.modifiedCount !== 1) {
      throw new ErrorHandler("Invitation Aborted", 404);
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Invitation Accepted",
    });
  } catch (e) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw e;
  } finally {
    await session.endSession();
  }
});
