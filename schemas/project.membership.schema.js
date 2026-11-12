import mongoose from "mongoose";

const projectMembership = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID required"],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID required"],
    },
    role: {
      type: String,
      enum: ["project manager", "worker", "client"],
      default: "worker",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "removed"],
      default: "active",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID required"],
    },
  },
  { timestamps: true },
);

projectMembership.index({ projectId: 1, userId: 1 }, { unique: true });

export const ProjectMembership = mongoose.model(
  "ProjectMembership",
  projectMembership,
);
