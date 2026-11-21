import { ProjectMembership } from "../schemas/project.membership.schema.js";
import { User } from "../schemas/user.schema.js";
import { Task } from "../schemas/task.schema.js";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { Membership } from "../schemas/membership.schema.js";

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  const task = await Task.create({
    companyId: req.company._id,
    projectId: req.project._id,
    createdBy: req.user._id,
    title,
    description,
    priority,
    dueDate,
  });

  return res.status(201).json({ success: true, message: "Task Created", task });
});

export const getProjectTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, priority, search } = req.query;

  const skip = (page - 1) * limit;

  const filter = {
    companyId: req.company._id,
    projectId: req.project._id,
    isDeleted: false,
  };

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const tasks = await Task.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalDocuments = await Task.countDocuments(filter);

  const totalPages = Math.ceil(totalDocuments / limit);

  return res.status(200).json({
    success: true,
    tasks,
    data: { limit: limit, totalPages: totalPages },
  });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findOne({
    companyId: req.company._id,
    projectId: req.project._id,
    _id: taskId,
    isDeleted: false,
  });

  if (!task) {
    throw new ErrorHandler("Task doesn't exist", 404);
  }

  return res.status(200).json({ success: true, task });
});

export const updateTaskInformation = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, priority, dueDate } = req.body;

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
      companyId: req.company._id,
      projectId: req.project._id,
      _id: taskId,
      isDeleted: false,
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
  const { taskId } = req.params;
  const { userId } = req.body;

  const task = await Task.findOne({
    _id: taskId,
    companyId: req.company._id,
    projectId: req.project._id,
    isDeleted: false,
  });

  if (!task) {
    throw new ErrorHandler("Task doesn't exist", 404);
  }

  const user = await User.findOne({
    _id: userId,
    status: "active",
  });

  if (!user) {
    throw new ErrorHandler("User doesn't exist or is inactive", 404);
  }

  const existingUser = await Membership.findOne({
    companyId: req.company._id,
    userId: user._id,
    status: "active",
  });

  if (!existingUser) {
    throw new ErrorHandler("User is not an active member of this company", 403);
  }

  const existingProjectMembership = await ProjectMembership.findOne({
    companyId: req.company._id,
    userId: user._id,
    projectId: req.project._id,
    status: "active",
  });

  if (!existingProjectMembership) {
    throw new ErrorHandler("User is not an active member of this project", 403);
  }

  const updatedTask = await Task.findOneAndUpdate(
    {
      companyId: req.company._id,
      projectId: req.project._id,
      _id: taskId,
      isDeleted: false,
    },
    {
      $set: { assignedTo: user._id },
    },
    { new: true, runValidators: true },
  );

  if (!updatedTask) {
    throw new ErrorHandler("Task doesn't exist", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Task Assigned",
    updatedTask,
  });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const updatedTask = await Task.findOneAndUpdate(
    {
      companyId: req.company._id,
      projectId: req.project._id,
      _id: taskId,
      isDeleted: false,
    },
    {
      $set: {
        status,
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

export const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const deletedTask = await Task.findOneAndUpdate(
    {
      companyId: req.company._id,
      projectId: req.project._id,
      _id: taskId,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!deletedTask) {
    throw new ErrorHandler("Task doesn't exist", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Task Deleted successfully",
    deletedTask,
  });
});
