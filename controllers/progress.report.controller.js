import { asyncHandler } from "../utils/async.handler.js";
import { ProgressReport } from "../schemas/progress.report.schema.js";
import ErrorHandler from "../utils/error.handler.js";

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

export const submitProgressReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  const submittedReport = await ProgressReport.findOneAndUpdate(
    {
      _id: reportId,
      companyId: req.company._id,
      projectId: req.project._id,
      status: { $in: ["draft", "revision_requested"] },
    },
    {
      $set: {
        status: "submitted",
        submittedAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!submittedReport) {
    throw new ErrorHandler("Report not found or cannot be submitted", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Report Submitted for review",
    submittedReport,
  });
});
