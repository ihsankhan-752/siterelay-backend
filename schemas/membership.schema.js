import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User required for membership"],
      index: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company required"],
    },

    roleInCompany: {
      type: String,
      enum: ["owner", "admin", "member"],
      required: true,
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "removed"],
      default: "active",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

membershipSchema.index({ companyId: 1, userId: 1 }, { unique: true });

export const Membership = mongoose.model("Membership", membershipSchema);
