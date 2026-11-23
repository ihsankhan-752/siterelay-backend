import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { Task } from "../schemas/task.schema.js";
import { Comment } from "../schemas/comment.schema.js";

export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
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

  const comment = await Comment.create({
    companyId: req.company._id,
    projectId: req.project._id,
    taskId: task._id,
    userId: req.user._id,
    content,
  });
  return res.status(201).json({
    success: true,

    comment,
  });
});

export const getComments = asyncHandler(async (req, res) => {
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

  const filters = {
    companyId: req.company._id,
    projectId: req.project._id,
    taskId: task._id,
  };

  const comments = await Comment.find(filters)
    .sort({ createdAt: -1 })
    .populate("userId", "name email");

  return res.status(200).json({ success: true, comments });
});
