import { asyncHandler } from "../utils/async.handler.js";
import { ProgressReport } from "../schemas/progress.report.schema.js";
import { ProgressReportRevision } from "../schemas/progress.report.revision.schema.js";
import ErrorHandler from "../utils/error.handler.js";
import mongoose from "mongoose";
import { transform } from "zod";

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

  const session = await mongoose.startSession();

  let submittedReport;

  try {
    session.startTransaction();

    submittedReport = await ProgressReport.findOneAndUpdate(
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
        session,
      },
    );

    if (!submittedReport) {
      throw new ErrorHandler("Report not found or cannot be submitted", 404);
    }

    // Find the previous revision
    const previousRevision = await ProgressReportRevision.findOne({
      reportId: submittedReport._id,
    })
      .sort({ version: -1 })
      .session(session);

    const nextVersion = previousRevision ? previousRevision.version + 1 : 1;

    // Create a snapshot of the submitted report
    await ProgressReportRevision.create(
      [
        {
          reportId: submittedReport._id,
          version: nextVersion,
          submittedBy: req.user._id,
          submittedAt: submittedReport.submittedAt,
          reportSnapshot: {
            title: submittedReport.title,
            progressPercentage: submittedReport.progressPercentage,
            workCompleted: submittedReport.workCompleted,
            workInProgress: submittedReport.workInProgress,
            pendingWork: submittedReport.pendingWork,
            challenges: submittedReport.challenges,
            nextSteps: submittedReport.nextSteps,
          },
        },
      ],
      { session },
    );

    await session.commitTransaction();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }

  return res.status(200).json({
    success: true,
    message: "Report Submitted for review",
    submittedReport,
  });
});
