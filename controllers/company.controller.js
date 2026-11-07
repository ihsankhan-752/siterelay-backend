import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";
import { Company } from "../schemas/company.schema.js";
import { Membership } from "../schemas/membership.schema.js";
import { generateSlug } from "../utils/generate.slug.js";
import mongoose from "mongoose";

export const createCompany = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const userId = req.user._id;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const slug = generateSlug(name);

    if (!slug) {
      throw new ErrorHandler("Unable to generate valid slug", 400);
    }

    const [company] = await Company.create([{ ownerId: userId, name, slug }], {
      session,
    });

    await Membership.create(
      [
        {
          userId,
          companyId: company._id,
          roleInCompany: "owner",
          status: "active",
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (e) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return next(e);
  } finally {
    await session.endSession();
  }
});

export const getMyCompanies = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const memberships = await Membership.find({
    userId,
    status: "active",
  }).populate("companyId", "name slug status");
  return res.status(200).json({ success: true, memberships });
});
