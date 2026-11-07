import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    email: {
      type: String,
      required: [true, "User email required"],
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "revoked"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    acceptedAt: {
      type: Date,
    },
    revokedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

invitationSchema.index({ companyId: 1, email: 1 });

export const Invitation = mongoose.model("Invitation", invitationSchema);
