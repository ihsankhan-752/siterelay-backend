import { Company } from "../schemas/company.schema.js";
import { Membership } from "../schemas/membership.schema.js";
import { Project } from "../schemas/project.schema.js";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, startDate, targetEndDate } = req.body;
  const { cId } = req.params;
  const userId = req.user._id;

  const company = await Company.findById(cId);
  if (!company || company.status !== "active") {
    throw new ErrorHandler("Company did not exist", 404);
  }

  const membership = await Membership.findOne({
    userId,
    status: "active",
    companyId: company._id,
  });

  if (!membership) {
    throw new ErrorHandler("No active membership found", 403);
  }

  if (
    membership.roleInCompany !== "owner" &&
    membership.roleInCompany !== "admin"
  ) {
    throw new ErrorHandler("You are not authorized to create the project", 403);
  }

  const project = await Project.create({
    companyId: cId,
    name,
    description,
    startDate,
    targetEndDate,
  });

  return res
    .status(201)
    .json({ success: true, message: "Project created successfully", project });
});
