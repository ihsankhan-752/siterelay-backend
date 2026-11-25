import { asyncHandler } from "../utils/async.handler.js";
import { ProgressReport } from "../schemas/progress.report.schema.js";

export const createProgressReport = asyncHandler(async (req, res) => {
  const {
    title,
    progressPercentage,
    workCompleted,
    workInProgress,
    pendingWork,
    challenges,
    nextSteps,
  } = req.body;

  const report = await ProgressReport.create({
    companyId: req.company._id,
    projectId: req.project._id,
    createdBy: req.user._id,
    title,
    progressPercentage,
    workCompleted,
    workInProgress,
    pendingWork,
    challenges,
    nextSteps,
  });

  return res
    .status(201)
    .json({ success: true, message: "Report Created Successfully", report });
});
