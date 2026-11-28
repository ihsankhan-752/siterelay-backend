import mongoose from "mongoose";

const progressReportRevisionSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgressReport",
      required: [true, "Progress Report ID required"],
    },
    version: {
      type: Number,
      required: true,
      min: 1,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID required"],
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    reportSnapshot: {
      type: {
        title: { type: String, required: true },
        progressPercentage: { type: Number, required: true },
        workCompleted: { type: String, required: true },
        workInProgress: { type: String, default: null },
        pendingWork: { type: String, default: null },
        challenges: { type: String, default: null },
        nextSteps: { type: String, default: null },
      },
      required: true,
      _id: false,
    },
    reviewStatus: {
      type: String,
      enum: ["pending", "approved", "revision_requested"],
      default: "pending",
    },
    reviewComment: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

progressReportRevisionSchema.index(
  { reportId: 1, version: 1 },
  { unique: true },
);
export const ProgressReportRevision = mongoose.model(
  "ProgressReportRevision",
  progressReportRevisionSchema,
);
