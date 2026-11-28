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
      required: [true, "Progress title required"],
      minlength: 3,
      maxlength: 150,
    },
    resubmissionCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    progressPercentage: {
      type: Number,
      required: [true, "Progress percentage required"],
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot exceed 100"],
    },
    workCompleted: {
      type: String,
      required: [true, "Work completion report required"],
      trim: true,
      minlength: [5, "Work completed description is too short"],
      maxlength: [5000, "Work completed description is too long"],
    },
    workInProgress: {
      type: String,
      default: null,
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    pendingWork: {
      type: String,
      default: null,
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    challenges: {
      type: String,
      default: null,
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    nextSteps: {
      type: String,
      default: null,
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "revision_requested",
        "approved",
        "rejected",
      ],
      default: "draft",
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

progressReportSchema.index({
  companyId: 1,
  projectId: 1,
  createdAt: -1,
});

export const ProgressReport = mongoose.model(
  "ProgressReport",
  progressReportSchema,
);
