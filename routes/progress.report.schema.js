import mongoose from "mongoose";

const progressReportSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company Id required"],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project Id required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id required"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Progress Title required"],
    },
    progressPercentage: {
      type: Number,
      required: [true, "Progress percentage required"],
    },
    workCompleted: {
      type: String,
      required: [true, "Work Completion report required"],
    },
    workInProgress: {
      type: String,
      default: null,
    },
    pendingWork: {
      type: String,
      default: null,
    },
    challenges: {
      type: String,
      default: null,
    },
    nextSteps: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "revision_requested", "approved"],
      default: "submitted",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewComment: {
      type: String,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const ProgressReport = mongoose.model(
  "ProgressReport",
  progressReportSchema,
);
