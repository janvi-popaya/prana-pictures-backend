import { Router } from "express";
import {
  createInformation,
  deleteInformation,
  getAdminInformationById,
  getAdminInformationList,
  updateInformation,
} from "../controllers/information.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";
import { sanitizeDescriptionHtml } from "../middlewares/descriptionHtml.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createInformationSchema,
  updateInformationSchema,
} from "../validators/information.validator.js";

const router = Router();

router.use(requireAdmin);

router.post(
  "/",
  validateBody(createInformationSchema),
  sanitizeDescriptionHtml,
  createInformation,
);

router.get("/", getAdminInformationList);

router.get("/:id", getAdminInformationById);

router.patch(
  "/:id",
  validateBody(updateInformationSchema),
  sanitizeDescriptionHtml,
  updateInformation,
);

router.delete("/:id", deleteInformation);

export default router;