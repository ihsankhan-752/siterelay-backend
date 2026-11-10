import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Project name required"],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["planning", "active", "onHold", "completed", "archived"],
      default: "planning",
    },
    startDate: {
      type: Date,
      required: [true, "Project Starting date required"],
    },
    targetEndDate: {
      type: Date,
      required: [true, "Expected End date required"],
    },
  },
  { timestamps: true },
);

projectSchema.index({ companyId: 1, status: 1 });

export const Project = mongoose.model("Project", projectSchema);
