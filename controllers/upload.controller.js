import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { Task } from "../schemas/task.schema.js";

import { Attachment } from "../schemas/attachment.schema.js";

export const uploadAttachment = asyncHandler(async (req, res) => {
  const file = req.file;

  const { taskId } = req.params;

  if (!file) {
    throw new ErrorHandler("Upload File", 404);
  }

  const task = await Task.findOne({
    companyId: req.company._id,
    projectId: req.project._id,
    _id: taskId,
    isDeleted: false,
  });

  if (!task) {
    throw new ErrorHandler("Task doesn't exist", 404);
  }

  const attachment = await Attachment.create({
    companyId: req.company._id,
    projectId: req.project._id,
    taskId: task._id,
    uploadedBy: req.user._id,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    secureUrl: file.path,
    publicId: file.filename,
    resourceType: file.resource_type,
  });
  return res.status(201).json({
    success: true,
    message: "Attachment Successfully Uploaded",
    attachment,
  });
});
