import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task Id required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id required"],
    },

    content: {
      type: String,
      trim: true,
      minLength: [1, "Comment must be at least 1 characters"],
      maxLength: [999, "Comment must not exceed 999 characters"],
      required: [true, "Comment content is required"],
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

commentSchema.index({
  companyId: 1,
  projectId: 1,
  taskId: 1,
  createdAt: -1,
});

export const Comment = mongoose.model("Comment", commentSchema);
