import { Router } from "express";
import { createPresignedUpload } from "../controllers/media.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { presignUploadSchema } from "../validators/media.validator.js";

const router = Router();

router.use(requireAdmin);

router.post(
  "/presign-upload",
  validateBody(presignUploadSchema),
  createPresignedUpload,
);

export default router;
