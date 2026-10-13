import { Router } from "express";
import {
  createNews,
  deleteNews,
  getAdminNews,
  getAdminNewsById,
  updateNews,
} from "../controllers/news.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  createNewsSchema,
  updateNewsSchema,
} from "../validators/news.validator.js";

const router = Router();

router.use(requireAdmin);

router.post(
  "/",
  validateBody(createNewsSchema),
  createNews,
);

router.get("/", getAdminNews);

router.get("/:id", getAdminNewsById);

router.patch(
  "/:id",
  validateBody(updateNewsSchema),
  updateNews,
);

router.delete("/:id", deleteNews);

export default router;