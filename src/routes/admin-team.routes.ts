import { Router } from "express";
import {
  createTeamMember,
  deleteTeamMember,
  getAdminTeamMemberById,
  getAdminTeamMembers,
  updateTeamMember,
} from "../controllers/team.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";
import { sanitizeDescriptionHtml } from "../middlewares/descriptionHtml.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
} from "../validators/team.validator.js";

const router = Router();

router.use(requireAdmin);

router.post(
  "/",
  validateBody(createTeamMemberSchema),
  sanitizeDescriptionHtml,
  createTeamMember,
);

router.get("/", getAdminTeamMembers);

router.get("/:id", getAdminTeamMemberById);

router.patch(
  "/:id",
  validateBody(updateTeamMemberSchema),
  sanitizeDescriptionHtml,
  updateTeamMember,
);

router.delete("/:id", deleteTeamMember);

export default router;