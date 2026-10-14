import { Router } from "express";
import {
  getPublicInformationBySlug,
  getPublicInformationList,
} from "../controllers/information.controller.js";

const router = Router();

router.get("/", getPublicInformationList);
router.get("/:slug", getPublicInformationBySlug);

export default router;