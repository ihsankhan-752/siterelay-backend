import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner required"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Company name required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  { timestamps: true },
);

export const Company = mongoose.model("Company", companySchema);
