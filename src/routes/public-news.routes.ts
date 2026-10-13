import { Router } from "express";
import { getPublicNews } from "../controllers/news.controller.js";

const router = Router();

router.get("/", getPublicNews);

export default router;