import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User required for membership"],
      index: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company required"],
    },

    roleInCompany: {
      type: String,
      enum: ["owner", "admin", "member"],
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

export const Membership = mongoose.model("Membership", membershipSchema);
