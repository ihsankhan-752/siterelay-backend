import { Company } from "../schemas/company.schema.js";
import { Project } from "../schemas/project.schema.js";
import { Membership } from "../schemas/membership.schema.js";
import { ProjectMembership } from "../schemas/project.membership.schema.js";

import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";

export const verifyProjectAccess = (requiredRole = null) =>
  asyncHandler(async (req, res, next) => {
    const { cId, pId } = req.params;

    const company = await Company.findOne({
      _id: cId,
      status: "active",
    });

    if (!company) {
      throw new ErrorHandler("Company doesn't exist or is inactive", 404);
    }

    const project = await Project.findOne({
      _id: pId,
      companyId: company._id,
    });

    if (!project || project.status !== "planning") {
      throw new ErrorHandler("Project doesn't exist", 404);
    }

    const membership = await Membership.findOne({
      companyId: company._id,
      userId: req.user._id,
      status: "active",
    });

    if (!membership) {
      throw new ErrorHandler(
        "You are not an active member of this company",
        403,
      );
    }

    const projectMembership = await ProjectMembership.findOne({
      companyId: company._id,
      projectId: project._id,
      userId: req.user._id,
      status: "active",
    });

    if (!projectMembership) {
      throw new ErrorHandler(
        "You are not an active member of this project",
        403,
      );
    }

    if (requiredRole && projectMembership.role !== requiredRole) {
      throw new ErrorHandler(
        `Only ${requiredRole}s can perform this action`,
        403,
      );
    }

    req.company = company;
    req.project = project;
    req.membership = membership;
    req.projectMembership = projectMembership;

    next();
  });
