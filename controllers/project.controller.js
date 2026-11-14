import mongoose from "mongoose";
import { Company } from "../schemas/company.schema.js";
import { Membership } from "../schemas/membership.schema.js";
import { Project } from "../schemas/project.schema.js";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { ProjectMembership } from "../schemas/project.membership.schema.js";

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

  const session = await mongoose.startSession();

  let project;
  let projectMembership;

  try {
    session.startTransaction();

    const createdProjects = await Project.create(
      [
        {
          companyId: company._id,
          name,
          description,
          startDate,
          targetEndDate,
        },
      ],
      { session },
    );

    project = createdProjects[0];

    const createdMemberships = await ProjectMembership.create(
      [
        {
          userId,
          companyId: company._id,
          projectId: project._id,
          addedBy: userId,
          role: "project manager",
          status: "active",
        },
      ],
      { session },
    );

    projectMembership = createdMemberships[0];

    await session.commitTransaction();
  } catch (e) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw e;
  } finally {
    await session.endSession();
  }

  return res.status(201).json({
    success: true,
    message: "Project created successfully",
    project,
    projectMembership,
  });
});

export const getCompanyProjects = asyncHandler(async (req, res) => {
  const { cId } = req.params;

  const userId = req.user._id;

  const company = await Company.findById(cId);
  if (!company || company.status !== "active") {
    throw new ErrorHandler("Company did not exist", 404);
  }

  const membership = await Membership.findOne({
    userId,
    companyId: company._id,
    status: "active",
  });

  if (!membership) {
    throw new ErrorHandler("No active membership found", 403);
  }

  const projects = await Project.find({ companyId: cId }).sort({
    startDate: 1,
  });

  return res.status(200).json({ success: true, projects });
});
