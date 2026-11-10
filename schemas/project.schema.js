import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Project name required"],
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["planning", "active", "onHold", "completed", "archive"],
      default: "planning",
    },
    startData: {
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

export const Project = mongoose.model("Project", projectSchema);
