import { asyncHandler } from "../utils/async.handler.js";
import { ProgressReport } from "../schemas/progress.report.schema.js";
import { ProgressReportRevision } from "../schemas/progress.report.revision.schema.js";
import ErrorHandler from "../utils/error.handler.js";
import mongoose from "mongoose";

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

    const previousRevision = await ProgressReportRevision.findOne({
      reportId: submittedReport._id,
    })
      .sort({ version: -1 })
      .session(session);

    const nextVersion = previousRevision ? previousRevision.version + 1 : 1;

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

export const reviewProgressReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { action, reviewComment } = req.body;

  const session = await mongoose.startSession();

  let reviewedReport;

  try {
    session.startTransaction();

    const report = await ProgressReport.findOne({
      _id: reportId,
      companyId: req.company._id,
      projectId: req.project._id,
      status: "submitted",
    }).session(session);

    if (!report) {
      throw new ErrorHandler("Report not found or already reviewed", 404);
    }

    if (
      report.resubmissionCount === 0 &&
      !["approve", "request_revision"].includes(action)
    ) {
      throw new ErrorHandler("Invalid action for first review", 400);
    }

    if (
      report.resubmissionCount === 1 &&
      !["approve", "reject"].includes(action)
    ) {
      throw new ErrorHandler(
        "Only approval or rejection is allowed after resubmission",
        400,
      );
    }

    const latestRevision = await ProgressReportRevision.findOne({
      reportId: report._id,
      reviewStatus: "pending",
    })
      .sort({ version: -1 })
      .session(session);

    if (!latestRevision) {
      throw new ErrorHandler("Pending report revision not found", 404);
    }

    const statusMap = {
      approve: "approved",
      request_revision: "revision_requested",
      reject: "rejected",
    };

    const newStatus = statusMap[action];

    await ProgressReportRevision.findOneAndUpdate(
      {
        _id: latestRevision._id,
        reviewStatus: "pending",
      },
      {
        $set: {
          reviewStatus: newStatus,
          reviewedBy: req.user._id,
          reviewComment: reviewComment || null,
          reviewedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    reviewedReport = await ProgressReport.findOneAndUpdate(
      {
        _id: report._id,
        status: "submitted",
      },
      {
        $set: {
          status: newStatus,
          reviewedBy: req.user._id,
          reviewComment: reviewComment || null,
          reviewedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!reviewedReport) {
      throw new ErrorHandler("Unable to update report review", 409);
    }

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
    message: `Report ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "revision requested"} successfully`,
    report: reviewedReport,
  });
});

export const resubmitProgressReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  const {
    title,
    progressPercentage,
    workCompleted,
    workInProgress,
    pendingWork,
    challenges,
    nextSteps,
  } = req.body;

  const session = await mongoose.startSession();

  let resubmittedReport;

  try {
    session.startTransaction();

    const report = await ProgressReport.findOne({
      _id: reportId,
      companyId: req.company._id,
      projectId: req.project._id,
      createdBy: req.user._id,
      status: "revision_requested",
      resubmissionCount: 0,
    }).session(session);

    if (!report) {
      throw new ErrorHandler(
        "Report not found or resubmission is not allowed",
        404,
      );
    }

    const previousRevision = await ProgressReportRevision.findOne({
      reportId: report._id,
      reviewStatus: "revision_requested",
    })
      .sort({ version: -1 })
      .session(session);

    if (!previousRevision) {
      throw new ErrorHandler("Previous revision not found", 404);
    }

    const nextVersion = previousRevision.version + 1;
    const submittedAt = new Date();

    resubmittedReport = await ProgressReport.findOneAndUpdate(
      {
        _id: report._id,
        status: "revision_requested",
        resubmissionCount: 0,
      },
      {
        $set: {
          title,
          progressPercentage,
          workCompleted,
          workInProgress,
          pendingWork,
          challenges,
          nextSteps,
          status: "submitted",
          resubmissionCount: 1,
          submittedAt,
          reviewedBy: null,
          reviewComment: null,
          reviewedAt: null,
        },
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!resubmittedReport) {
      throw new ErrorHandler("Unable to resubmit progress report", 409);
    }

    await ProgressReportRevision.create(
      [
        {
          reportId: resubmittedReport._id,
          version: nextVersion,
          submittedBy: req.user._id,
          submittedAt,
          reportSnapshot: {
            title: resubmittedReport.title,
            progressPercentage: resubmittedReport.progressPercentage,
            workCompleted: resubmittedReport.workCompleted,
            workInProgress: resubmittedReport.workInProgress,
            pendingWork: resubmittedReport.pendingWork,
            challenges: resubmittedReport.challenges,
            nextSteps: resubmittedReport.nextSteps,
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
    message: "Progress report resubmitted successfully",
    report: resubmittedReport,
  });
});
