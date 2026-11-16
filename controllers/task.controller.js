import { Company } from "../schemas/company.schema.js";
import { Membership } from "../schemas/membership.schema.js";
import { ProjectMembership } from "../schemas/project.membership.schema.js";
import { Project } from "../schemas/project.schema.js";
import { User } from "../schemas/user.schema.js";
import { asyncHandler } from "../utils/async.handler.js";
import ErrorHandler from "../utils/error.handler.js";

export const assignTask = asyncHandler(async (req, res) => {
  const { cId, pId } = req.params;
  
});
