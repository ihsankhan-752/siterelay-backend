import { Company } from "../schemas/company.schema.js";
import { ProjectMembership } from "../schemas/project.membership.schema.js";
import { Project } from "../schemas/project.schema.js";
import { Task } from "../schemas/task.schema.js";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";

export const createTask = asyncHandler(async (req, res) => {
  const { cId, pId } = req.params;
  const { title, description, priority, dueDate } = req.body;

  const company = await Company.findOne({ _id: cId, status: "active" });

  if (!company) {
    throw new ErrorHandler("Company doesn't exist or is inactive", 404);
  }

  const project = await Project.findOne({ _id: pId, companyId: company._id });

  if (!project || project.status !== "planning") {
    throw new ErrorHandler("Project doesn't exist", 404);
  }

  const projectMembership = await ProjectMembership.findOne({
    projectId: project._id,
    userId: req.user._id,
    status: "active",
    companyId: company._id,
  });

  if (!projectMembership) {
    throw new ErrorHandler("Active project membership not found", 403);
  }

  if (projectMembership.role !== "project manager") {
    throw new ErrorHandler("Only project managers can create tasks", 403);
  }

  const task = await Task.create({
    companyId: company._id,
    projectId: project._id,
    createdBy: req.user._id,
    title,
    description,
    priority,
    dueDate,
  });

  return res.status(201).json({ success: true, message: "Task Created", task });
});
