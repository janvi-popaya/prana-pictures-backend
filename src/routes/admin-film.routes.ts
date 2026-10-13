import { Router } from "express";
import {
  createFilm,
  deleteFilm,
  getAdminFilmById,
  getAdminFilms,
  updateFilm,
} from "../controllers/film.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

import {
  createFilmSchema,
  updateFilmSchema,
} from "../validators/film.validator.js";
import { sanitizeDescriptionHtml } from "../middlewares/descriptionHtml.middleware.js";

const router = Router();

router.use(requireAdmin);

router.post(
  "/",
  validateBody(createFilmSchema),
  sanitizeDescriptionHtml,
  createFilm,
);
router.get("/", getAdminFilms);
router.get("/:id", getAdminFilmById);
router.patch(
  "/:id",
  validateBody(updateFilmSchema),
  sanitizeDescriptionHtml,
  updateFilm,
);
router.delete("/:id", deleteFilm);

export default router;
