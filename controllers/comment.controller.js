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

export const updateComment = asyncHandler(async (req, res) => {
  const { commentId, taskId } = req.params;

  const { updatedContent } = req.body;

  const comment = await Comment.findOne({
    _id: commentId,
    companyId: req.company._id,
    projectId: req.project._id,
    taskId,
  })
    .where("userId")
    .equals(req.user._id);

  if (!comment) {
    throw new ErrorHandler(
      "No Comment Found or you are unable to modify someone else comment",
      404,
    );
  }

  const updatedComment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
      companyId: req.company._id,
      projectId: req.project._id,
      taskId,
      userId: req.user._id,
    },
    {
      $set: {
        content: updatedContent,
        isEdited: true,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return res
    .status(200)
    .json({ success: true, message: "Comment Updated", updatedComment });
});
