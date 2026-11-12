import { Company } from "../schemas/company.schema.js";
import { Membership } from "../schemas/membership.schema.js";
import { ProjectMembership } from "../schemas/project.membership.schema.js";
import { Project } from "../schemas/project.schema.js";
import { User } from "../schemas/user.schema.js";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";

export const addMemberToProject = asyncHandler(async (req, res) => {
  const { cId, pId } = req.params;
  const { userId, role } = req.body;

  const user = req.user;

  const company = await Company.findOne({ _id: cId, status: "active" });

  if (!company) {
    throw new ErrorHandler("Company doesn't exist or is inactive", 404);
  }

  const membership = await Membership.findOne({
    userId: user._id,
    companyId: company._id,
    status: "active",
  });

  if (
    !membership ||
    (membership.roleInCompany !== "owner" &&
      membership.roleInCompany !== "admin")
  ) {
    throw new ErrorHandler(
      "No membership exist or you are not authorized",
      403,
    );
  }

  const project = await Project.findOne({ _id: pId, companyId: company._id });

  if (!project || project.status !== "active") {
    throw new ErrorHandler("Project doesn't exist", 404);
  }

  const existingUser = await User.findById(userId);

  if (!existingUser || existingUser.status !== "active") {
    throw new ErrorHandler("No active user exist", 404);
  }

  const targetMembership = await Membership.findOne({
    userId: existingUser._id,
    companyId: company._id,
    status: "active",
  });

  if (!targetMembership) {
    throw new ErrorHandler(
      "Target user is not an active member of this company",
      403,
    );
  }

  const checkMembership = await ProjectMembership.findOne({
    projectId: project._id,
    userId: existingUser._id,
  });
  if (checkMembership) {
    throw new ErrorHandler("This user already assign to this project", 409);
  }

  const projectMembership = await ProjectMembership.create({
    userId:existingUser._id,
    companyId: company._id,
    projectId: project._id,
    addedBy: user._id,
    role: role,

  });

  return res.status(201).json({
    success: true,
    message: "User added to project",
    projectMembership,
  });
});
