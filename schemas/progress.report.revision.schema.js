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
      type: String,
      default: null,
    },
    reviewStatus: {
      type: String,
      enum: ["pending", "approve", "reject", "request_modification"],
      default: "pending",
    },
    reviewComment: {
      type: String,
      default: null,
    },
    reviewAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const ProgressReportRevision = mongoose.model(
  "ProgressReportRevision",
  progressReportRevisionSchema,
);
