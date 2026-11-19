import { Company } from "../schemas/company.schema.js";
import { ProjectMembership } from "../schemas/project.membership.schema.js";
import { Project } from "../schemas/project.schema.js";
import { User } from "../schemas/user.schema.js";
import { Task } from "../schemas/task.schema.js";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { Membership } from "../schemas/membership.schema.js";

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

export const getProjectTasks = asyncHandler(async (req, res) => {
  const { cId, pId } = req.params;

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

  const tasks = await Task.find({
    companyId: company._id,
    projectId: project._id,
  });

  return res.status(200).json({ success: true, tasks });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const { cId, pId, taskId } = req.params;

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

  const tasks = await Task.findOne({
    companyId: company._id,
    projectId: project._id,
    _id: taskId,
  });

  return res.status(200).json({ success: true, tasks });
});

export const updateTaskInformation = asyncHandler(async (req, res) => {
  const { cId, pId, taskId } = req.params;
  const { title, description, priority, dueDate } = req.body;

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
    throw new ErrorHandler("Only project managers can update tasks", 403);
  }

  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (priority !== undefined) updateData.priority = priority;
  if (dueDate !== undefined) updateData.dueDate = dueDate;

  if (Object.keys(updateData).length === 0) {
    throw new ErrorHandler("At least one field is required to update", 400);
  }

  const updatedTask = await Task.findOneAndUpdate(
    {
      companyId: company._id,
      projectId: project._id,
      _id: taskId,
    },
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedTask) {
    throw new ErrorHandler("Task doesn't exist", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    updatedTask,
  });
});

export const assignTask = asyncHandler(async (req, res) => {
  const { cId, pId, taskId } = req.params;
  const { userId } = req.body;

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
    throw new ErrorHandler("Only project managers can update tasks", 403);
  }

  const task = await Task.findOne({
    _id: taskId,
    companyId: company._id,
    projectId: project._id,
  });

  if (!task) {
    throw new ErrorHandler("Task does'nt Exist", 404);
  }

  const user = await User.findOne({ _id: userId, status: "active" });

  if (!user) {
    throw new ErrorHandler("User doesn't exist or is inactive", 404);
  }

  if (user) {
    const existingUser = await Membership.findOne({
      companyId: company._id,
      userId: user._id,
      status: "active",
    });

    if (!existingUser) {
      throw new ErrorHandler(
        "User is not an active member of this company",
        403,
      );
    }

    const existingProjectMembership = await ProjectMembership.findOne({
      companyId: company._id,
      userId: user._id,
      projectId: project._id,
      status: "active",
    });
    if (!existingProjectMembership) {
      throw new ErrorHandler(
        "User is not an active member of this project",
        403,
      );
    }
  }

  const assignTask = await Task.findOneAndUpdate(
    {
      companyId: company._id,
      projectId: project._id,
      _id: taskId,
    },
    {
      $set: {
        assignedTo: userId,
      },
    },
    { new: true, runValidators: true },
  );

  return res
    .status(200)
    .json({ success: true, message: "Task Assigned", assignTask });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { cId, pId, taskId } = req.params;
  const { newStatus } = req.body;

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
    throw new ErrorHandler("Only project managers can update tasks", 403);
  }

  const updatedTask = await Task.findOneAndUpdate(
    {
      companyId: company._id,
      projectId: project._id,
      _id: taskId,
    },
    {
      $set: {
        status: newStatus,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedTask) {
    throw new ErrorHandler("Task doesn't exist", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Task Status Updated",
    updatedTask,
  });
});
