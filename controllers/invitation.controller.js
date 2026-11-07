import { Company } from "../schemas/company.schema.js";
import { Invitation } from "../schemas/invitation.schema.js";
import { Membership } from "../schemas/membership.schema.js";
import { User } from "../schemas/user.schema.js";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { generateInvitationToken } from "../utils/generate.invitation.token.js";

export const createInvitation = asyncHandler(async (req, res) => {
  const { cId } = req.params;
  const { role, email } = req.body;
  const userId = req.user._id;

  const company = await Company.findById(cId);

  if (!company || company.status !== "active") {
    throw new ErrorHandler("No Company Exist", 404);
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
      "An active invitation already exist for this email",
      409,
    );
  }

  const token = generateInvitationToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invitation = await Invitation.create({
    companyId: companyId,
    email,
    role: role,
    tokenHash: token.tokenHash,
    invitedBy: userId,
    expiresAt: expiresAt,
  });

  return res.status(201).json({
    success: true,
    response: {
      email: invitation.email,
      role: invitation.role,
    },
  });
});
