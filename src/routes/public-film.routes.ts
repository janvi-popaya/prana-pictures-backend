import { Router } from "express";
import {
  getPublicFilmBySlug,
  getPublicFilms,
} from "../controllers/film.controller.js";

const router = Router();

router.get("/", getPublicFilms);
router.get("/:slug", getPublicFilmBySlug);

export default router;